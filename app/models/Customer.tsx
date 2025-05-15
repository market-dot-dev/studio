import { User } from "@/app/generated/prisma";
import Stripe from "stripe";
import { createStripeCustomer } from "../services/stripe-payment-service";
import StripeService from "../services/StripeService";
import UserService from "../services/UserService";
import { SessionUser } from "./Session";

class Customer {
  user: User | SessionUser;
  maintainerUserId: string;
  maintainerStripeAccountId: string;
  stripeCustomerIds: Record<string, string>;
  stripePaymentMethodIds: Record<string, string>;

  stripe: Stripe;
  stripeService: StripeService;

  constructor(
    user: User | SessionUser,
    maintainerUserId: string,
    maintainerStripeAccountId: string
  ) {
    this.user = user;
    this.stripeCustomerIds = (user.stripeCustomerIds || {}) as Record<string, string>;
    this.stripePaymentMethodIds = (user.stripePaymentMethodIds || {}) as Record<string, string>;
    this.maintainerUserId = maintainerUserId;
    this.maintainerStripeAccountId = maintainerStripeAccountId;

    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      stripeAccount: maintainerStripeAccountId
    });
    this.stripeService = new StripeService(maintainerStripeAccountId);
  }

  // utility
  canBuy() {
    return (
      !!this.stripeCustomerIds[this.maintainerStripeAccountId] &&
      !!this.stripePaymentMethodIds[this.maintainerStripeAccountId]
    );
  }

  // customer
  getStripeCustomerId() {
    return this.stripeCustomerIds[this.maintainerStripeAccountId];
  }

  async getOrCreateStripeCustomerId() {
    return this.getStripeCustomerId() || (await this.createStripeCustomer()).id;
  }

  async clearCustomerId() {
    delete this.stripeCustomerIds[this.maintainerStripeAccountId];
    return this.updateUser({ stripeCustomerIds: this.stripeCustomerIds });
  }

  async createStripeCustomer() {
    if (!this.user.email) throw new Error("User does not have an email address.");
    const { email, name } = this.user;

    const customer = await createStripeCustomer(
      this.maintainerStripeAccountId,
      email,
      name || undefined
    );

    this.stripeCustomerIds[this.maintainerStripeAccountId] = customer.id;

    await this.updateUser({ stripeCustomerIds: this.stripeCustomerIds });

    return customer;
  }

  // payment method
  async getStripePaymentMethod() {
    return await this.stripeService.getPaymentMethod(
      await this.getStripePaymentMethodId(),
      this.maintainerStripeAccountId
    );
  }

  async getStripePaymentMethodId() {
    return this.stripePaymentMethodIds[this.maintainerStripeAccountId];
  }

  async attachPaymentMethod(paymenMethodId: string) {
    const customerId = await this.getOrCreateStripeCustomerId();
    await this.stripeService.attachPaymentMethod(paymenMethodId, customerId);
    this.stripePaymentMethodIds[this.maintainerStripeAccountId] = paymenMethodId;

    return await this.updateUser({ stripePaymentMethodIds: this.stripePaymentMethodIds });
  }

  async detachPaymentMethod() {
    try {
      await this.stripeService.detachPaymentMethod(
        await this.getStripePaymentMethodId(),
        await this.getStripeCustomerId()
      );
    } catch (error: any) {
      if (error.code !== "resource_missing") throw error;
    }
    delete this.stripePaymentMethodIds[this.maintainerStripeAccountId];

    return await this.updateUser({ stripePaymentMethodIds: this.stripePaymentMethodIds });
  }

  async updateUser(userData: any) {
    return await UserService.updateUser(this.user.id, userData);
  }
}

export default Customer;
