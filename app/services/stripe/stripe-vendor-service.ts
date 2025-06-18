"use server";

import { getRootUrl } from "@/lib/domain";
import prisma from "@/lib/prisma";
import { ErrorMessageCode, errorMessageMapping, HealthCheckResult } from "@/types/stripe";
import { createStripeClient } from "../create-stripe-client";
import { requireOrganization } from "../user-context-service";
import {
  getCurrentVendorOrganization,
  getVendorOrganizationById,
  updateVendorStripeData
} from "../vendor-organization-service";

/**
 * Get the human-readable error message for a given error code
 */
export async function getVendorStripeErrorMessage(code: ErrorMessageCode): Promise<string> {
  return errorMessageMapping[code] || "An unknown error occurred.";
}

/**
 * Get account information for current vendor organization
 */
export async function getVendorStripeAccountInfo() {
  const organization = await getCurrentVendorOrganization();
  let accountInfo = null;

  if (organization.stripeAccountId) {
    try {
      const stripe = await createStripeClient();
      const account = await stripe.accounts.retrieve(organization.stripeAccountId);

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

  return { organization, accountInfo };
}

/**
 * Check the health of a specific organization's Stripe account
 * Optionally update the organization record with the results
 *
 * @param organizationId - The ID of the org to check
 * @param updateOrgRecord - Whether to update the org record with the results
 * @returns The health check results
 */
export async function checkVendorStripeStatusByOrgId(
  organizationId: string,
  updateOrgRecord: boolean = false
): Promise<HealthCheckResult> {
  const messageCodes: ErrorMessageCode[] = [];
  let canSell = true;
  let disabledReasons: string[] = [];

  const organization = await getVendorOrganizationById(organizationId);

  if (!organization) {
    throw new Error(ErrorMessageCode.UserNotFound);
  }

  if (!organization.stripeAccountId) {
    messageCodes.push(ErrorMessageCode.StripeAccountNotConnected);
    canSell = false;
  }

  try {
    if (organization.stripeAccountId) {
      const stripe = await createStripeClient();
      const account = await stripe.accounts.retrieve(organization.stripeAccountId);

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
        disabledReasons = [account.requirements.disabled_reason];
        canSell = false;
      }
    }
  } catch (error) {
    console.error("Error fetching stripe account info", error);
    messageCodes.push(ErrorMessageCode.StripeAccountInfoFetchError);
    canSell = false;
  }

  if (updateOrgRecord) {
    const reasons = JSON.stringify(messageCodes.map((code) => getVendorStripeErrorMessage(code)));

    await updateVendorStripeData(organizationId, {
      stripeAccountDisabled: !canSell,
      stripeAccountDisabledReason: reasons
    });
  }

  return { canSell, messageCodes, disabledReasons };
}

/**
 * Check the health of the current organization's Stripe account
 * Optionally update the organization record with the results
 */
export async function checkVendorStripeStatus(
  updateOrgRecord: boolean = false
): Promise<HealthCheckResult> {
  const organization = await requireOrganization();
  return checkVendorStripeStatusByOrgId(organization.id, updateOrgRecord);
}

/**
 * Check if current organization has a connected Stripe account
 */
export async function hasVendorStripeAccount(): Promise<boolean> {
  const organization = await getCurrentVendorOrganization();
  return !!organization.stripeAccountId;
}

/**
 * Generate a CSRF token to protect against CSRF attacks during Stripe OAuth
 * @private
 */
async function generateVendorStripeOAuthToken(organizationId: string): Promise<string> {
  return `${organizationId}-${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Get OAuth link for Stripe Connect for current organization
 */
export async function getVendorStripeConnectURL(): Promise<string> {
  const organization = await getCurrentVendorOrganization();

  const state = organization.stripeCSRF || (await generateVendorStripeOAuthToken(organization.id));

  if (!organization.stripeCSRF) {
    await updateVendorStripeData(organization.id, { stripeCSRF: state });
  }

  const redirectUri = getRootUrl("app", "/settings/payment/callback");
  const oauthLink = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.STRIPE_CLIENT_ID}&scope=read_write&state=${state}&redirect_uri=${redirectUri}`;

  return oauthLink;
}

/**
 * Handle OAuth response from Stripe Connect
 */
export async function processVendorStripeConnectCallback(code: string, state: string) {
  // Verify the state parameter to prevent CSRF attacks
  const organization = await prisma.organization.findUnique({
    where: { stripeCSRF: state }
  });

  if (!organization) {
    throw new Error("Invalid state parameter");
  }

  const stripe = await createStripeClient();
  const response = await stripe.oauth.token({
    grant_type: "authorization_code",
    code
  });

  const connectedAccountId = response.stripe_user_id;

  await updateVendorStripeData(organization.id, {
    stripeAccountId: connectedAccountId,
    stripeCSRF: null
  });

  return connectedAccountId;
}

/**
 * Disconnect current organization's Stripe account
 */
export async function disconnectVendorStripeAccount(): Promise<void> {
  const organization = await getCurrentVendorOrganization();

  if (!organization.stripeAccountId) {
    throw new Error("Organization does not have a connected Stripe account");
  }

  await updateVendorStripeData(organization.id, {
    stripeAccountId: null
  });
}
