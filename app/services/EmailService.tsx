"use server";

import * as EmailTemplates from "@/app/components/email/templates";
import { domainCopy, getRootUrl } from "@/lib/domain";
import { Prospect, User } from "@prisma/client";
import sgMail from "@sendgrid/mail";
import UserService from "./UserService";

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

type RequiredUserProps = {
  name: User["name"];
  email: User["email"];
} & Partial<User>;

type RequiredProspectProps = {
  name: Prospect["name"];
  email: Prospect["email"];
};

const rootURL = domainCopy();
const appURL = domainCopy("app");
const rootURLWithProtocol = getRootUrl();
const appURLWithProtocol = getRootUrl("app");

class EmailService {
  static async sendEmail(email: string | null, subject: string, text: string, html: string) {
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

  static async newSubscriptionInformation(
    userId: string,
    customer: RequiredUserProps,
    tierName: string
  ) {
    const subject = `You have a new customer for ${tierName}!`;
    const html = EmailTemplates.createNewSubscriptionEmail(customer.name || "", tierName);
    const text = `Congratulations! ${customer.name} has purchased your ${tierName} tier.`;
    const user = await UserService.findUser(userId);

    if (!user) {
      console.error(`User not found with id: ${userId}`);
      return;
    }

    try {
      await this.sendEmail(user.email, subject, text, html);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  }

  static async newPurchaseInformation(
    userId: string,
    customer: RequiredUserProps,
    tierName: string
  ) {
    const subject = `You have a new customer for ${tierName}!`;
    const html = EmailTemplates.createNewPurchaseEmail(customer.name || "", tierName);
    const text = `Congratulations! ${customer.name} has purchased your ${tierName} package.`;
    const user = await UserService.findUser(userId);

    if (!user) {
      console.error(`User not found with id: ${userId}`);
      return;
    }

    try {
      await this.sendEmail(user.email, subject, text, html);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  }

  static async newSubscriptionConfirmation(customer: RequiredUserProps, tierName: string) {
    const subject = `Thank you for purchasing ${tierName}!`;
    const html = EmailTemplates.createSubscriptionConfirmationEmail(tierName);
    const text = `Thank you for purchasing the ${tierName} tier. You now have access to all the benefits of this tier. Please visit your dashboard at ${appURLWithProtocol} to manage your subscription & benefits.`;

    try {
      await this.sendEmail(customer.email, subject, text, html);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  }

  static async newPurchaseConfirmation(customer: RequiredUserProps, tierName: string) {
    const subject = `Thank you for purchasing ${tierName}!`;
    const html = EmailTemplates.createPurchaseConfirmationEmail(tierName);
    const text = `Thank you for purchasing the ${tierName} tier. You now have access to all the benefits of this tier.`;

    try {
      await this.sendEmail(customer.email, subject, text, html);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  }

  static async subscriptionCancelledInfo(
    user: RequiredUserProps,
    customer: RequiredUserProps,
    tierName: string
  ) {
    const subject = `Subscription Cancelled by ${customer.name}`;
    const html = EmailTemplates.createSubscriptionCancelledEmail(customer.name || "", tierName);
    const text = `${customer.name} has cancelled their subscription to your ${tierName} tier.`;

    try {
      await this.sendEmail(user.email, subject, text, html);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  }

  static async subscriptionCancelledConfirmation(customer: RequiredUserProps, tierName: string) {
    const subject = "Subscription Cancelled";
    const html = EmailTemplates.createSubscriptionCancelledConfirmationEmail(tierName);
    const text = `You have cancelled your subscription to the ${tierName} tier.`;

    try {
      await this.sendEmail(customer.email, subject, text, html);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  }

  static async sendNewProspectEmail(
    user: RequiredUserProps,
    prospect: RequiredProspectProps,
    tierName: string
  ): Promise<void> {
    const subject = `A new prospect is interested in ${tierName}!`;
    const html = EmailTemplates.createNewProspectEmail(
      prospect.name || "",
      prospect.email,
      tierName
    );
    const text = `Congratulations! ${prospect.name} has expressed interest in your ${tierName} tier.`;

    try {
      await this.sendEmail(user.email, subject, text, html);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  }

  static async sendNewMaintainerSignUpEmail(user: RequiredUserProps): Promise<void> {
    const subject = `Welcome to market.dev!`;
    const html = EmailTemplates.createWelcomeEmail(user.name || "");
    const text = `Hello ${user.name},\n\nThank you for registering with market.dev!`;

    await this.sendEmail(user.email, subject, text, html);
  }

  static async sendNewCustomerSignUpEmail(user: RequiredUserProps): Promise<void> {
    const subject = `Welcome to market.dev!`;
    const html = EmailTemplates.createNewCustomerSignUpEmail(user.name || "");
    const text = `Hello ${user.name},\n\nThank you for registering with market.dev!`;

    await this.sendEmail(user.email, subject, text, html);
  }

  static async sendVerificationEmail(email: string, token: string, domain: string): Promise<void> {
    const subject = `Verification code`;
    const html = EmailTemplates.createVerificationEmail(token, domain);
    const text = `Your verification code for signing in to ${domain} is ${token}`;

    await this.sendEmail(email, subject, text, html);
  }
}

export default EmailService;
