"use server";

import { User } from '@prisma/client';

type RequiredUserProps = {
    name: User['name'];
    email: User['email'];
  } & Partial<User>;

class EmailService {
  static async sendNewSubscriberEmail(user: RequiredUserProps) {
    console.log(`Sending mail to new subscriber: ${user.email}`);
    // integration with email provider
  }

  static async sendNewUserSignUpEmail(user: RequiredUserProps) {
    console.log(`Sending signup confirmation email to new user: ${user.email}`);
    // integration with email provider
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
