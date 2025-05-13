"use server";

import * as EmailTemplates from "@/app/components/email/templates";
import { domainCopy, getRootUrl } from "@/lib/domain";
import { Lead, User } from "@prisma/client";
import sgMail from "@sendgrid/mail";
import { findUser } from "./UserService";

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

type RequiredUserProps = {
  name: User["name"];
  email: User["email"];
} & Partial<User>;

type RequiredProspectProps = {
  name: Lead["name"];
  email: Lead["email"];
};

const rootURL = domainCopy();
const appURL = domainCopy("app");
const rootURLWithProtocol = getRootUrl();
const appURLWithProtocol = getRootUrl("app");

/**
 * Send an email with the provided details
 *
 * @param email - Recipient's email address
 * @param subject - Email subject
 * @param text - Plain text content
 * @param html - HTML content
 */
export async function sendEmail(email: string | null, subject: string, text: string, html: string) {
  // console.log('sending email', email, subject, html);
  if (!email) {
    console.error("Invalid email address");
    return;
  }
  const msg = {
    to: email, // recipient
    from: {
      name: process.env.SENDGRID_FROM_NAME, // verified sender
      email: process.env.SENDGRID_FROM_EMAIL // verified sender
    },
    subject: subject,
    text: text,
    html: html
  } as any;

  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${email}`);
  } catch (error: any) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
}

/**
 * Send subscription notification to tier owner
 *
 * @param userId - ID of the tier owner
 * @param customer - Customer who subscribed
 * @param tierName - Name of the tier
 */
export async function notifyOwnerOfNewSubscription(
  userId: string,
  customer: RequiredUserProps,
  tierName: string
) {
  const subject = `You have a new customer for ${tierName}!`;
  const html = EmailTemplates.createNewSubscriptionEmail(customer.name || "", tierName);
  const text = `Congratulations! ${customer.name} has purchased your ${tierName} tier.`;
  const user = await findUser(userId);

  if (!user) {
    console.error(`User not found with id: ${userId}`);
    return;
  }

  try {
    await sendEmail(user.email, subject, text, html);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

/**
 * Send purchase notification to tier owner
 *
 * @param userId - ID of the tier owner
 * @param customer - Customer who made the purchase
 * @param tierName - Name of the tier
 */
export async function notifyOwnerOfNewPurchase(
  userId: string,
  customer: RequiredUserProps,
  tierName: string
) {
  const subject = `You have a new customer for ${tierName}!`;
  const html = EmailTemplates.createNewPurchaseEmail(customer.name || "", tierName);
  const text = `Congratulations! ${customer.name} has purchased your ${tierName} package.`;
  const user = await findUser(userId);

  if (!user) {
    console.error(`User not found with id: ${userId}`);
    return;
  }

  try {
    await sendEmail(user.email, subject, text, html);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

/**
 * Send subscription confirmation to customer
 *
 * @param customer - Customer who subscribed
 * @param tierName - Name of the tier
 */
export async function confirmCustomerSubscription(customer: RequiredUserProps, tierName: string) {
  const subject = `Thank you for purchasing ${tierName}!`;
  const html = EmailTemplates.createSubscriptionConfirmationEmail(tierName);
  const text = `Thank you for purchasing the ${tierName} tier. You now have access to all the benefits of this tier. Please visit your dashboard at ${appURLWithProtocol} to manage your subscription & benefits.`;

  try {
    await sendEmail(customer.email, subject, text, html);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

/**
 * Send purchase confirmation to customer
 *
 * @param customer - Customer who made the purchase
 * @param tierName - Name of the tier
 */
export async function confirmCustomerPurchase(customer: RequiredUserProps, tierName: string) {
  const subject = `Thank you for purchasing ${tierName}!`;
  const html = EmailTemplates.createPurchaseConfirmationEmail(tierName);
  const text = `Thank you for purchasing the ${tierName} tier. You now have access to all the benefits of this tier.`;

  try {
    await sendEmail(customer.email, subject, text, html);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

/**
 * Send subscription cancellation notification to tier owner
 *
 * @param user - Tier owner
 * @param customer - Customer who cancelled
 * @param tierName - Name of the tier
 */
export async function notifyOwnerOfSubscriptionCancellation(
  user: RequiredUserProps,
  customer: RequiredUserProps,
  tierName: string
) {
  const subject = `Subscription Cancelled by ${customer.name}`;
  const html = EmailTemplates.createSubscriptionCancelledEmail(customer.name || "", tierName);
  const text = `${customer.name} has cancelled their subscription to your ${tierName} tier.`;

  try {
    await sendEmail(user.email, subject, text, html);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

/**
 * Send subscription cancellation confirmation to customer
 *
 * @param customer - Customer who cancelled
 * @param tierName - Name of the tier
 */
export async function confirmCustomerSubscriptionCancellation(
  customer: RequiredUserProps,
  tierName: string
) {
  const subject = "Subscription Cancelled";
  const html = EmailTemplates.createSubscriptionCancelledConfirmationEmail(tierName);
  const text = `You have cancelled your subscription to the ${tierName} tier.`;

  try {
    await sendEmail(customer.email, subject, text, html);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

/**
 * Send new prospect notification to tier owner
 *
 * @param user - Tier owner
 * @param prospect - Prospect who expressed interest
 * @param tierName - Name of the tier
 */
export async function notifyOwnerOfNewProspect(
  user: RequiredUserProps,
  prospect: RequiredProspectProps,
  tierName: string
): Promise<void> {
  const subject = `A new prospect is interested in ${tierName}!`;
  const html = EmailTemplates.createNewProspectEmail(
    prospect.name || "",
    prospect.email!,
    tierName
  );
  const text = `Congratulations! ${prospect.name} has expressed interest in your ${tierName} tier.`;

  try {
    await sendEmail(user.email, subject, text, html);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

/**
 * Send welcome email to new maintainer
 *
 * @param user - New maintainer
 */
export async function sendWelcomeEmailToMaintainer(user: RequiredUserProps): Promise<void> {
  const subject = `Welcome to market.dev!`;
  const html = EmailTemplates.createWelcomeEmail(user.name || "");
  const text = `Hello ${user.name},\n\nThank you for registering with market.dev!`;

  await sendEmail(user.email, subject, text, html);
}

/**
 * Send welcome email to new customer
 *
 * @param user - New customer
 */
export async function sendWelcomeEmailToCustomer(user: RequiredUserProps): Promise<void> {
  const subject = `Welcome to market.dev!`;
  const html = EmailTemplates.createNewCustomerSignUpEmail(user.name || "");
  const text = `Hello ${user.name},\n\nThank you for registering with market.dev!`;

  await sendEmail(user.email, subject, text, html);
}

/**
 * Send verification email with login token
 *
 * @param email - Recipient email
 * @param token - Verification token
 * @param domain - Domain for the verification
 */
export async function sendVerificationEmail(
  email: string,
  token: string,
  domain: string
): Promise<void> {
  const subject = `Verification code`;
  const html = EmailTemplates.createVerificationEmail(token, domain);
  const text = `Your verification code for signing in to ${domain} is ${token}`;

  await sendEmail(email, subject, text, html);
}
