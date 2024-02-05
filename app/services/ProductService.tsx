"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import Product from "@/app/models/Product";
import StripeService from "./StripeService";
import UserService from "./UserService";

class ProductService {
  static async getCurrentUserId() {
    const session = await getSession();
    return session?.user.id;
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

    const stripeProduct = await StripeService.createOrUpdateProduct({ userId: userId, name: `user-${userId}-${existingUser.name!}` });

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
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        stripeProductId: null,
      },
    });

    if (user?.stripeProductId) await StripeService.destroyProduct(user.stripeProductId);

    return {
      userId: user?.id,
      stripeProductId: user?.stripeProductId,
    } as Product;
  }
};

export default ProductService;
export const { createProduct, destroyProduct, findProduct, updateProduct } = ProductService;