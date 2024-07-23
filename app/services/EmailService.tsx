"use server";

import { User } from '@prisma/client';
import sgMail from '@sendgrid/mail';
import UserService from './UserService';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

type RequiredUserProps = {
  name: User['name'];
  email: User['email'];
} & Partial<User>;

class EmailService {
  static headerImage = '<img src="https://gitwallet.co/gw-logo.png" alt="Gitwallet" style="width:50px; height:auto;"><br /><br />';
  static footerMessage = '<p>Thank you,<br>The Gitwallet Team</p>';

  static async sendEmail(email: string | null, subject: string, text: string, html: string) {
    // console.log('sending email', email, subject, html);
    if (!email) {
      console.error('Invalid email address');
      return;
    }
    const msg = {
      to: email, // recipient
      from: {
        name: process.env.SENDGRID_FROM_NAME, // verified sender
        email: process.env.SENDGRID_FROM_EMAIL, // verified sender
      },
      subject: subject,
      text: text,
      html: EmailService.headerImage + html + EmailService.footerMessage,
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

  static async newSubscriptionInformation(userId: string, customer: RequiredUserProps, tierName: string) {
    const subject = `You have a new customer for ${tierName}!`;
    const text = `Congratulations! ${customer.name} has purchased your ${tierName} tier.`;
    const html = `Congratulations! <b>${customer.name}</b> has purchased your <b>${tierName}</b> tier. You can contact them at ${customer.email} to provide them with the benefits of this tier.`;
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

  static async newPurchaseInformation(userId: string, customer: RequiredUserProps, tierName: string) {
    const subject = `You have a new customer for ${tierName}!`;
    const text = `Congratulations! ${customer.name} has purchased your ${tierName} package.`;
    const html = `Congratulations! <b>${customer.name}</b> has purchased your <b>${tierName}</b> tier. You can contact them at ${customer.email} to provide them with the benefits of this package.`;
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
    const text = `Thank you for purchasing the ${tierName} tier. You now have access to all the benefits of this tier. Please visit your dashboard at https://app.gitwallet.co to manage your subscription & benefits.`;
    const html = `Thank you for purchasing the <b>${tierName}</b> tier. You now have access to all the benefits of this tier. Please visit your <a href="https://app.gitwallet.co/customer-login">dashboard</a> to manage your subscription & benefits.`;

    try {
      await this.sendEmail(customer.email, subject, text, html);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  }

  static async newPurchaseConfirmation(customer: RequiredUserProps, tierName: string) {
    const subject = `Thank you for purchasing ${tierName}!`;
    const text = `Thank you for purchasing the ${tierName} tier. You now have access to all the benefits of this tier. Please visit your dashboard at https://app.gitwallet.co. to view your package benefits`;
    const html = `Thank you for purchasing the <b>${tierName}</b> tier. You now have access to all the benefits of this tier. Please visit your <a href="https://app.gitwallet.co/customer-login">dashboard</a> to view your package benefits.`;

    try {
      await this.sendEmail(customer.email, subject, text, html);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  }

  static async subscriptionCancelledInfo(user: RequiredUserProps, customer: RequiredUserProps, tierName: string) {
    const subject = `Subscription Cancelled by ${customer.name}`;
    const text = `${customer.name} has cancelled their subscription to your ${tierName} tier.`;
    const html = `<b>${customer.name}</b> has cancelled their subscription to your <b>${tierName}</b> tier.`;

    try {
      await this.sendEmail(user.email, subject, text, html);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  }

  static async subscriptionCancelledConfirmation(customer: RequiredUserProps, tierName: string) {
    const subject = "Subscription Cancelled";
    const text = `You have cancelled your subscription to the ${tierName} tier.`;
    const html = `You have cancelled your subscription to the <b>${tierName}</b> tier.`;

    try {
      await this.sendEmail(customer.email, subject, text, html);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  }

  static async sendNewMaintainerSignUpEmail(user: RequiredUserProps): Promise<void> {
    const subject = 'Welcome to gitwallet.co!';
    const text = `Hello ${user.name},\n\nThank you for registering with gitwallet.co! The next steps are to set up your payment information and offerings at app.gitwallet.co in order to start selling your services.\n\nGet started here: app.gitwallet.co`;
    const html = `
      <p>Hello <strong>${user.name}</strong>,</p>
      <p>Thank you for registering with <strong>gitwallet.co</strong>! The next steps are to set up your payment information and offerings at <a href="https://app.gitwallet.co">app.gitwallet.co</a> in order to start selling your services.</p>
      <p>Get started here: <a href="https://app.gitwallet.co">app.gitwallet.co</a></p>
    `;

    await this.sendEmail(user.email, subject, text, html);
  }

  static async sendNewCustomerSignUpEmail(user: RequiredUserProps): Promise<void> {
    const subject = 'Welcome to gitwallet.co!';
    const text = `Hello ${user.name},\n\nThank you for registering with gitwallet.co!\n\nGet started here: gitwallet.co`;
    const html = `
      <p>Hello <strong>${user.name}</strong>,</p>
      <p>Thank you for registering with <strong>gitwallet.co</strong>!</p>
      <p>Get started here: <a href="https://gitwallet.co">gitwallet.co</a></p>
    `;

    await this.sendEmail(user.email, subject, text, html);
  }

  static async sendNewSubscriberEmail(user: RequiredUserProps) {
    console.log(`Sending new subscription email to new subscriber: ${user.email}`);
  }

  static async sendPasswordResetEmail(user: RequiredUserProps) {
    console.log(`Sending password reset email to: ${user.email}`);
    // integration with email provider
  }

  static async sendSubscriptionRenewalReminder(user: RequiredUserProps) {
    console.log(`Sending subscription renewal reminder to: ${user.email}`);
    // integration with email provider
  }

  // other email functions here
}

export default EmailService;
