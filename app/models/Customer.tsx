import { User } from "@prisma/client"
import Stripe from 'stripe';
import StripeService from "../services/StripeService";
import UserService from "../services/UserService";

class Customer {
  user: User;
  maintainerUserId: string;
  maintainerStripeAccountId: string;
  stripeCustomerIds: Record<string, string>;
  stripePaymentMethodIds: Record<string, string>;

  stripe: Stripe;
  stripeService: StripeService;

  constructor(user: User, maintainerUserId: string, maintainerStripeAccountId: string) {
    this.user = user;
    this.stripeCustomerIds = (user.stripeCustomerIds || {}) as Record<string, string>;
    this.stripePaymentMethodIds = (user.stripePaymentMethodIds || {}) as Record<string, string>;
    this.maintainerUserId = maintainerUserId;
    this.maintainerStripeAccountId = maintainerStripeAccountId;

    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { stripeAccount: maintainerStripeAccountId });
    this.stripeService = new StripeService(maintainerStripeAccountId);
  }

  // utility
  canBuy() {
    !!this.stripeCustomerIds[this.maintainerUserId] 
      && !!this.stripePaymentMethodIds[this.maintainerUserId];
  }

  // customer
  getStripeCustomerId() {
    return this.stripeCustomerIds[this.maintainerUserId];
  }

  async getOrCreateStripeCustomerId() {
    return this.getStripeCustomerId() ||
      (await this.createStripeCustomer()).id;
  }
  
  async setCustomerId(customerId: string) {
    this.stripeCustomerIds[this.maintainerUserId] = customerId;
    return this.updateUser({ stripeCustomerIds: this.stripeCustomerIds });
  }

  async clearCustomerId() {
    delete this.stripeCustomerIds[this.maintainerUserId];
    return this.updateUser({ stripeCustomerIds: this.stripeCustomerIds });
  }

  async createStripeCustomer() {
    if(!this.user.email) throw new Error('User does not have an email address.');
    const { email, name } = this.user;

    const customer = await this.stripeService.createCustomer(email, name || undefined);

    this.stripeCustomerIds[this.maintainerUserId] = customer.id;

    await this.updateUser({ stripeCustomerIds: this.stripeCustomerIds });

    return customer;
  }

  async destroyCustomer() {
    await this.stripeService.destroyCustomer(await this.getStripeCustomerId());
    delete this.stripeCustomerIds[this.maintainerUserId];

    return await this.updateUser({ stripeCustomerIds: this.stripeCustomerIds });
  }

  // payment method
  async getStripePaymentMethodId() {
    return this.stripePaymentMethodIds[this.maintainerUserId];
  }

  async attachPaymentMethod(paymenMethodId: string) {
    const customerId = await this.getOrCreateStripeCustomerId();
    await this.stripeService.attachPaymentMethod(paymenMethodId, customerId);
    this.stripePaymentMethodIds[this.maintainerUserId] = paymenMethodId;

    return await this.updateUser({ stripePaymentMethodIds: this.stripePaymentMethodIds });
  }

  async detachPaymentMethod() {
    await this.stripeService.detachPaymentMethod(await this.getStripePaymentMethodId(), await this.getStripeCustomerId());
    delete this.stripePaymentMethodIds[this.maintainerUserId];

    return await this.updateUser({ stripePaymentMethodIds: this.stripePaymentMethodIds });
  }

  async updateUser(userData: any) {
    return await UserService.updateUser(this.user.id, userData);
  }
}

export default Customer;