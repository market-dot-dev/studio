"use server";

import { getRootUrl } from "@/lib/domain";
import prisma from "@/lib/prisma";
import { ErrorMessageCode, errorMessageMapping, HealthCheckResult } from "@/types/stripe";
import { createStripeClient } from "./create-stripe-client";
import UserService from "./UserService";

/**
 * Get the human-readable error message for a given error code
 */
export async function getErrorMessage(code: ErrorMessageCode) {
  return errorMessageMapping[code] || "An unknown error occurred.";
}

/**
 * Get account information for a Stripe vendor
 */
export async function getAccountInfo() {
  const user = await UserService.getCurrentUser();

  if (!user) {
    throw new Error("User not found");
  }

  let accountInfo = null;

  if (user.stripeAccountId) {
    try {
      const stripe = await createStripeClient();
      const account = (await stripe.accounts.retrieve(user.stripeAccountId)) as any;

      // Extracting only relevant information
      accountInfo = {
        chargesEnabled: account.charges_enabled,
        payoutsEnabled: account.payouts_enabled,
        country: account.country,
        defaultCurrency: account.default_currency,
        requirements: {
          currentlyDue: account.requirements.currently_due,
          disabledReason: account.requirements.disabled_reason
        }
      };
    } catch (error) {
      console.error("Error fetching Stripe account info:", error);
      throw error;
    }
  }

  return { user, accountInfo };
}

/**
 * Perform a health check on the current user's Stripe account and update user record
 */
export async function performStripeAccountHealthCheck(): Promise<HealthCheckResult> {
  const { messageCodes, canSell, disabledReasons } = await stripeAccountHealthCheck();
  const reasons = JSON.stringify(messageCodes.map((code) => getErrorMessage(code)));

  await UserService.updateCurrentUser({
    stripeAccountDisabled: !canSell,
    stripeAccountDisabledReason: reasons
  });

  return { messageCodes, canSell, disabledReasons };
}

/**
 * Check the health of the current user's Stripe account without updating user record
 */
export async function stripeAccountHealthCheck(): Promise<HealthCheckResult> {
  const messageCodes: ErrorMessageCode[] = [];
  let canSell = true;
  let disabledReasons: string[] = [];

  const user = await UserService.getCurrentUser();

  if (!user) {
    throw new Error(ErrorMessageCode.UserNotFound);
  }

  if (!user.stripeAccountId) {
    messageCodes.push(ErrorMessageCode.StripeAccountNotConnected);
    canSell = false;
  }

  try {
    const { accountInfo } = await getAccountInfo();

    if (accountInfo) {
      if (!accountInfo.chargesEnabled) {
        messageCodes.push(ErrorMessageCode.StripeChargeNotEnabled);
        canSell = false;
      }

      if (!accountInfo.payoutsEnabled) {
        messageCodes.push(ErrorMessageCode.StripePayoutNotEnabled);
        canSell = false;
      }

      if (accountInfo.requirements.disabledReason) {
        messageCodes.push(ErrorMessageCode.StripeAccountDisabled);
        disabledReasons = Array(accountInfo.requirements.disabledReason);
        canSell = false;
      }
    }
  } catch (error) {
    console.error("Error fetching stripe account info", error);
    messageCodes.push(ErrorMessageCode.StripeAccountInfoFetchError);
    canSell = false;
  }

  return { canSell, messageCodes, disabledReasons };
}

/**
 * Check if a user has a connected Stripe account
 */
export async function userHasStripeAccountIdById(): Promise<boolean> {
  const user = await UserService.getCurrentUser();
  if (!user) {
    throw new Error("User not found");
  }
  return !!user.stripeAccountId;
}

/**
 * Generate a CSRF token to protect against CSRF attacks during Stripe OAuth
 */
export async function generateStripeCSRF(userId: string): Promise<string> {
  return `${userId}-${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Get OAuth link for Stripe Connect
 */
export async function getOAuthLink(userId: string): Promise<string> {
  const user = await UserService.findUser(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const state = user.stripeCSRF || (await generateStripeCSRF(userId));

  if (!user.stripeCSRF) {
    await UserService.updateUser(userId, { stripeCSRF: state });
  }

  const redirectUri = getRootUrl("app", "/settings/payment");
  const oauthLink = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.STRIPE_CLIENT_ID}&scope=read_write&state=${state}&redirect_uri=${redirectUri}`;

  return oauthLink;
}

/**
 * Handle OAuth response from Stripe Connect
 */
export async function handleOAuthResponse(code: string, state: string): Promise<string> {
  // Verify the state parameter to prevent CSRF attacks
  const user = await prisma.user.findUnique({ where: { stripeCSRF: state } });

  if (!user) {
    throw new Error("Invalid state parameter");
  }

  const stripe = await createStripeClient();
  const response = await stripe.oauth.token({
    grant_type: "authorization_code",
    code
  });

  const connectedAccountId = response.stripe_user_id;
  await UserService.updateUser(user.id, {
    stripeAccountId: connectedAccountId,
    stripeCSRF: null
  });

  return connectedAccountId as string;
}

/**
 * Disconnect a vendor's Stripe account
 */
export async function disconnectStripeAccount(userId: string): Promise<void> {
  const user = await UserService.findUser(userId);
  if (!user) {
    throw new Error("User not found");
  }

  if (!user.stripeAccountId) {
    throw new Error("User does not have a connected Stripe account");
  }

  await UserService.updateUser(userId, { stripeAccountId: null });
}
