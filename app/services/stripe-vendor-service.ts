"use server";

import { getRootUrl } from "@/lib/domain";
import prisma from "@/lib/prisma";
import { ErrorMessageCode, errorMessageMapping, HealthCheckResult } from "@/types/stripe";
import { createStripeClient } from "./create-stripe-client";
import UserService from "./UserService";

/**
 * Get the human-readable error message for a given error code
 */
export async function getVendorStripeErrorMessage(code: ErrorMessageCode): Promise<string> {
  return errorMessageMapping[code] || "An unknown error occurred.";
}

/**
 * Get account information for a Stripe vendor
 */
export async function getVendorStripeAccountInfo() {
  const user = await UserService.getCurrentUser();

  if (!user) {
    throw new Error("User not found");
  }

  let accountInfo = null;

  if (user.stripeAccountId) {
    try {
      const stripe = await createStripeClient();
      const account = await stripe.accounts.retrieve(user.stripeAccountId);

      // Extracting only relevant information
      accountInfo = {
        chargesEnabled: account.charges_enabled,
        payoutsEnabled: account.payouts_enabled,
        country: account.country,
        defaultCurrency: account.default_currency,
        requirements: {
          currentlyDue: account.requirements?.currently_due,
          disabledReason: account.requirements?.disabled_reason
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
 * Check the health of a specific user's Stripe account
 * Optionally update the user record with the results
 *
 * @param userId - The ID of the user to check
 * @param updateUserRecord - Whether to update the user record with the results
 * @returns The health check results
 */
export async function checkVendorStripeStatusById(
  userId: string,
  updateUserRecord: boolean = false
): Promise<HealthCheckResult> {
  const messageCodes: ErrorMessageCode[] = [];
  let canSell = true;
  let disabledReasons: string[] = [];

  const user = await UserService.findUser(userId);

  if (!user) {
    throw new Error(ErrorMessageCode.UserNotFound);
  }

  if (!user.stripeAccountId) {
    messageCodes.push(ErrorMessageCode.StripeAccountNotConnected);
    canSell = false;
  }

  try {
    if (user.stripeAccountId) {
      const stripe = await createStripeClient();
      const account = await stripe.accounts.retrieve(user.stripeAccountId);

      if (!account.charges_enabled) {
        messageCodes.push(ErrorMessageCode.StripeChargeNotEnabled);
        canSell = false;
      }

      if (!account.payouts_enabled) {
        messageCodes.push(ErrorMessageCode.StripePayoutNotEnabled);
        canSell = false;
      }

      if (account.requirements?.disabled_reason) {
        messageCodes.push(ErrorMessageCode.StripeAccountDisabled);
        disabledReasons = Array(account.requirements.disabled_reason);
        canSell = false;
      }
    }
  } catch (error) {
    console.error("Error fetching stripe account info", error);
    messageCodes.push(ErrorMessageCode.StripeAccountInfoFetchError);
    canSell = false;
  }

  if (updateUserRecord) {
    const reasons = JSON.stringify(messageCodes.map((code) => getVendorStripeErrorMessage(code)));

    await UserService.updateUser(userId, {
      stripeAccountDisabled: !canSell,
      stripeAccountDisabledReason: reasons
    });
  }

  return { canSell, messageCodes, disabledReasons };
}

/**
 * Check the health of the current user's Stripe account
 * Optionally update the user record with the results
 *
 * @param updateUserRecord - Whether to update the user record with the results
 * @returns The health check results
 */
export async function checkVendorStripeStatus(
  updateUserRecord: boolean = false
): Promise<HealthCheckResult> {
  const user = await UserService.getCurrentUser();

  if (!user) {
    throw new Error(ErrorMessageCode.UserNotFound);
  }

  return checkVendorStripeStatusById(user.id, updateUserRecord);
}

/**
 * Check if a user has a connected Stripe account
 */
export async function hasVendorStripeAccount(): Promise<boolean> {
  const user = await UserService.getCurrentUser();
  if (!user) {
    throw new Error("User not found");
  }
  return !!user.stripeAccountId;
}

/**
 * Generate a CSRF token to protect against CSRF attacks during Stripe OAuth
 * @private
 */
async function generateVendorStripeOAuthToken(userId: string): Promise<string> {
  return `${userId}-${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Get OAuth link for Stripe Connect
 */
export async function getVendorStripeConnectURL(userId: string): Promise<string> {
  const user = await UserService.findUser(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const state = user.stripeCSRF || (await generateVendorStripeOAuthToken(userId));

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
export async function processVendorStripeConnectCallback(
  code: string,
  state: string
): Promise<string> {
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
export async function disconnectVendorStripeAccount(userId: string): Promise<void> {
  const user = await UserService.findUser(userId);
  if (!user) {
    throw new Error("User not found");
  }

  if (!user.stripeAccountId) {
    throw new Error("User does not have a connected Stripe account");
  }

  await UserService.updateUser(userId, { stripeAccountId: null });
}
