"use server";

import { Prisma } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";
import { OrganizationForStripeOps, includeOrgForStripeOps } from "@/types/organization";
import { StripeCard } from "@/types/stripe";
import {
  attachStripePaymentMethod,
  createStripeCustomer,
  createStripeSetupIntent,
  detachStripePaymentMethod,
  retrieveStripePaymentMethod
} from "./stripe/stripe-payment-service";
import { requireOrganization } from "./user-context-service";

/**
 * Customer-specific organization operations
 * Used when the organization is acting as a CUSTOMER (buying products/services)
 * Manages payment methods, subscriptions, purchase history for different vendors
 */

/**
 * Get the current organization as a customer (includes Stripe details)
 */
export async function getCurrentCustomerOrganization(): Promise<OrganizationForStripeOps> {
  const org = await requireOrganization();

  const customerOrg = await prisma.organization.findUnique({
    where: { id: org.id },
    ...includeOrgForStripeOps
  });

  if (!customerOrg) {
    throw new Error("Organization not found");
  }

  return customerOrg as OrganizationForStripeOps;
}

/**
 * Get customer organization by ID (includes Stripe details)
 */
export async function getCustomerOrganizationById(
  id: string
): Promise<OrganizationForStripeOps | null> {
  const customerOrg = await prisma.organization.findUnique({
    where: { id },
    ...includeOrgForStripeOps
  });

  return customerOrg as OrganizationForStripeOps | null;
}

/**
 * Update organization's Stripe customer/payment data
 */
async function updateCustomerStripeData(
  organizationId: string,
  data: {
    stripeCustomerIds?: Record<string, string>;
    stripePaymentMethodIds?: Record<string, string>;
  }
): Promise<void> {
  const updateData: Prisma.OrganizationUpdateInput = {};

  if (data.stripeCustomerIds) {
    updateData.stripeCustomerIds = data.stripeCustomerIds as Prisma.InputJsonValue;
  }

  if (data.stripePaymentMethodIds) {
    updateData.stripePaymentMethodIds = data.stripePaymentMethodIds as Prisma.InputJsonValue;
  }

  await prisma.organization.update({
    where: { id: organizationId },
    data: updateData
  });
}

/**
 * Get Stripe Customer ID for a specific vendor
 */
export async function getStripeCustomerIdForVendor(
  vendorStripeAccountId: string,
  customerOrgId?: string
): Promise<string | null> {
  const customerOrg = customerOrgId
    ? await getCustomerOrganizationById(customerOrgId)
    : await getCurrentCustomerOrganization();

  if (!customerOrg) return null;

  const customerIds = (customerOrg.stripeCustomerIds as Record<string, string>) || {};
  return customerIds[vendorStripeAccountId] || null;
}

/**
 * Get or create Stripe Customer ID for a specific vendor
 */
export async function getOrCreateStripeCustomerIdForVendor(
  vendorStripeAccountId: string,
  customerOrgId?: string
): Promise<string> {
  const customerOrg = customerOrgId
    ? await getCustomerOrganizationById(customerOrgId)
    : await getCurrentCustomerOrganization();

  if (!customerOrg) {
    throw new Error("Customer organization not found");
  }

  let stripeCustomerId = await getStripeCustomerIdForVendor(vendorStripeAccountId, customerOrg.id);

  if (stripeCustomerId) {
    return stripeCustomerId;
  }

  if (!customerOrg.owner?.email) {
    throw new Error(
      `Organization owner does not have an email address, required for Stripe customer creation.`
    );
  }

  // Create customer using the stripe service
  const stripeCustomer = await createStripeCustomer(
    vendorStripeAccountId,
    customerOrg.owner.email,
    customerOrg.name || customerOrg.owner.name || `Organization ${customerOrg.id}`
  );

  stripeCustomerId = stripeCustomer.id;

  // Update organization record with new customer ID
  const existingCustomerIds = (customerOrg.stripeCustomerIds as Record<string, string>) || {};
  const updatedCustomerIds = {
    ...existingCustomerIds,
    [vendorStripeAccountId]: stripeCustomerId
  };

  await updateCustomerStripeData(customerOrg.id, { stripeCustomerIds: updatedCustomerIds });

  return stripeCustomerId;
}

/**
 * Get Stripe Payment Method ID for a specific vendor
 */
export async function getStripePaymentMethodIdForVendor(
  vendorStripeAccountId: string,
  customerOrgId?: string
): Promise<string | null> {
  const customerOrg = customerOrgId
    ? await getCustomerOrganizationById(customerOrgId)
    : await getCurrentCustomerOrganization();

  if (!customerOrg) return null;

  const paymentMethodIds = (customerOrg.stripePaymentMethodIds as Record<string, string>) || {};
  return paymentMethodIds[vendorStripeAccountId] || null;
}

/**
 * Create setup intent for collecting payment method
 */
export async function createPaymentMethodSetupIntent(
  vendorStripeAccountId: string,
  customerOrgId?: string
): Promise<{ clientSecret: string | null; error: string | null }> {
  try {
    const stripeCustomerId = await getOrCreateStripeCustomerIdForVendor(
      vendorStripeAccountId,
      customerOrgId
    );

    const setupIntent = await createStripeSetupIntent(vendorStripeAccountId, stripeCustomerId);

    return { clientSecret: setupIntent.client_secret, error: null };
  } catch (error: unknown) {
    console.error("Error creating setup intent:", error);
    return {
      clientSecret: null,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}

/**
 * Attach payment method to organization for a specific vendor
 */
export async function attachPaymentMethodForVendor(
  vendorStripeAccountId: string,
  paymentMethodId: string,
  customerOrgId?: string
): Promise<void> {
  const customerOrg = customerOrgId
    ? await getCustomerOrganizationById(customerOrgId)
    : await getCurrentCustomerOrganization();

  if (!customerOrg) {
    throw new Error("Customer organization not found");
  }

  const stripeCustomerId = await getOrCreateStripeCustomerIdForVendor(
    vendorStripeAccountId,
    customerOrg.id
  );

  // Use stripe service to attach payment method
  await attachStripePaymentMethod(vendorStripeAccountId, paymentMethodId, stripeCustomerId);

  // Update organization record
  const existingPaymentMethodIds =
    (customerOrg.stripePaymentMethodIds as Record<string, string>) || {};
  const updatedPaymentMethodIds = {
    ...existingPaymentMethodIds,
    [vendorStripeAccountId]: paymentMethodId
  };

  await updateCustomerStripeData(customerOrg.id, {
    stripePaymentMethodIds: updatedPaymentMethodIds
  });
}

/**
 * Detach payment method from organization for a specific vendor
 */
export async function detachPaymentMethodForVendor(
  vendorStripeAccountId: string,
  customerOrgId?: string
): Promise<void> {
  const customerOrg = customerOrgId
    ? await getCustomerOrganizationById(customerOrgId)
    : await getCurrentCustomerOrganization();

  if (!customerOrg) {
    throw new Error("Customer organization not found");
  }

  const paymentMethodId = await getStripePaymentMethodIdForVendor(
    vendorStripeAccountId,
    customerOrg.id
  );
  const stripeCustomerId = await getStripeCustomerIdForVendor(
    vendorStripeAccountId,
    customerOrg.id
  );

  if (paymentMethodId && stripeCustomerId) {
    try {
      // Use stripe service to detach payment method
      await detachStripePaymentMethod(vendorStripeAccountId, paymentMethodId, stripeCustomerId);
    } catch (error: any) {
      if (error.code !== "resource_missing") {
        console.warn(
          `Could not detach payment method ${paymentMethodId} on Stripe for vendor ${vendorStripeAccountId}: ${error.message}`
        );
      }
    }
  }

  // Clear from organization record
  const existingPaymentMethodIds =
    (customerOrg.stripePaymentMethodIds as Record<string, string>) || {};
  delete existingPaymentMethodIds[vendorStripeAccountId];

  await updateCustomerStripeData(customerOrg.id, {
    stripePaymentMethodIds: existingPaymentMethodIds
  });
}

/**
 * Get payment method details for a vendor
 */
export async function getPaymentMethodDetailsForVendor(
  vendorStripeAccountId: string,
  customerOrgId?: string
): Promise<StripeCard | null> {
  const paymentMethodId = await getStripePaymentMethodIdForVendor(
    vendorStripeAccountId,
    customerOrgId
  );

  if (!paymentMethodId) return null;

  try {
    const paymentMethod = await retrieveStripePaymentMethod(vendorStripeAccountId, paymentMethodId);

    if (paymentMethod.type === "card" && paymentMethod.card) {
      return {
        brand: paymentMethod.card.brand,
        last4: paymentMethod.card.last4
      };
    }
  } catch (error) {
    console.error(`Error retrieving payment method ${paymentMethodId} from Stripe:`, error);
    return null;
  }

  return null;
}

/**
 * Check if organization can make payment to a specific vendor
 */
export async function canMakePaymentToVendor(
  vendorStripeAccountId: string,
  customerOrgId?: string
): Promise<boolean> {
  const stripeCustomerId = await getStripeCustomerIdForVendor(vendorStripeAccountId, customerOrgId);
  const paymentMethodId = await getStripePaymentMethodIdForVendor(
    vendorStripeAccountId,
    customerOrgId
  );
  return !!stripeCustomerId && !!paymentMethodId;
}

/**
 * Get purchase history for organization
 */
export async function getPurchaseHistory(customerOrgId?: string) {
  const customerOrg = customerOrgId
    ? await getCustomerOrganizationById(customerOrgId)
    : await getCurrentCustomerOrganization();

  if (!customerOrg) {
    throw new Error("Customer organization not found");
  }

  const [charges, subscriptions] = await Promise.all([
    prisma.charge.findMany({
      where: { organizationId: customerOrg.id },
      include: { tier: true },
      orderBy: { createdAt: "desc" },
      take: 10
    }),
    prisma.subscription.findMany({
      where: { organizationId: customerOrg.id },
      include: { tier: true },
      orderBy: { createdAt: "desc" },
      take: 10
    })
  ]);

  return {
    charges,
    subscriptions
  };
}
