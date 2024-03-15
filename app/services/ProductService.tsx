"use server";

import prisma from "@/lib/prisma";
import Product from "@/app/models/Product";
import StripeService from "./StripeService";
import UserService from "./UserService";
import SessionService from "./SessionService";

class ProductService {
  static async getCurrentUserId() {
    return SessionService.getCurrentUserId();
  }

  static async findProduct(userId: string): Promise<Product | null> {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    return {
      userId: user?.id,
      stripeProductId: user?.stripeProductId,
    } as Product;
  }

  static async createProduct(userId: string) {
    const existingUser = await UserService.findUser(userId);
    if (!existingUser) throw new Error(`User with ID ${userId} not found`);

    if(existingUser.stripeProductId) {
      return {
        userId: existingUser.id,
        stripeProductId: existingUser.stripeProductId,
      } as Product;
    }

    const stripeService = new StripeService(existingUser.stripeAccountId!);
    const stripeProduct = await stripeService.createOrUpdateProduct({ userId: userId, name: `user-${userId}-${existingUser.name!}` });

    // Update the user record with the new Stripe product ID
    const user = await prisma.user.update({
      where: { id: userId },
      data: { stripeProductId: stripeProduct.id },
    });

    return {
      userId: user.id,
      stripeProductId: user.stripeProductId,
    } as Product;
  }

  static async updateProduct(userId: string, product: Partial<Product>) {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        stripeProductId: product.stripeProductId,
      },
    });
    
    return {
      userId: user?.id,
      stripeProductId: user?.stripeProductId,
    } as Product;
  }

  static async destroyProduct(userId: string) {
    let user = await UserService.findUser(userId);

    const stripeService = new StripeService(user?.stripeAccountId!);
    if (user?.stripeProductId) await stripeService.destroyProduct(user.stripeProductId);

    user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        stripeProductId: null,
      },
    });

    

    return {
      userId: user?.id,
      stripeProductId: user?.stripeProductId,
    } as Product;
  }
};

export default ProductService;
export const { createProduct, destroyProduct, findProduct, updateProduct } = ProductService;