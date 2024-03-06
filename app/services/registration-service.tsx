'use server';

import { User } from "@prisma/client"
import prisma from "@/lib/prisma"
import { siteName, siteDescription, homepageTitle, homepageTemplate} from "@/lib/constants/site-template";
import { signIn } from "next-auth/react";
import { cookies } from 'next/headers'


interface UserDetails {
  id: string;
  gh_username: string;
  name: string;
  email: string;
  image: string;
  roleId: string;
}

class RegistrationService {
  static async registerCustomer(userAttributes: Partial<User> ) {
    return await prisma.user.create({
      data: {
        email: userAttributes.email,
        name: userAttributes.name,
        roleId: 'customer',
      },
    });
  }

  
  static async registerAndSignInCustomer(userAttributes: Partial<User> ) { 
    const res = await signIn("email", {
      redirect: false,
      email: userAttributes.email
    });

  }

  static async upsertUser(userDetails: UserDetails) {
    const { id, gh_username, name, email, image } = userDetails;
  
    // Check if a user exists with the given GitHub username
    const existingUser = await prisma.user.findUnique({
      where: { gh_username }, // Assuming gh_username is unique
    });
  
    if (existingUser) {
      // If the user exists, conditionally update their information
      const user = await prisma.user.update({
        where: { id: existingUser.id }, // Use the unique identifier for updates
        data: {
          // Update only if the existing record has these fields blank
          name: existingUser.name ? existingUser.name : name,
          email: existingUser.email ? existingUser.email : email,
          image: existingUser.image ? existingUser.image : image,
          username: existingUser.username ? existingUser.username : gh_username,
          updatedAt: new Date(), // Update the 'updatedAt' field to the current time
        },
      });
  
      return user;
    } else {
      // If the user doesn't exist, create a new one with the provided details
      const user = await prisma.user.create({
        data: {
          id, // This should be a unique identifier, ensure you generate or provide this
          gh_username,
          name,
          email,
          image,
          username: gh_username, // Assuming you want to store the GitHub username here
          roleId: 'customer',
          emailVerified: null, // Set this to the current time if the email is verified at creation
          createdAt: new Date(), // Set to the current time
          updatedAt: new Date(), // Set to the current time
        },
      });
  
      await RegistrationService.createSite(user);
  
      return user;
    }
  }

  static async createSite(user: User) {
    const pageData = {
      title: homepageTitle,
      slug: 'index',
      content: homepageTemplate,
      draft: false,
      user: {
        connect: {
          id: user.id,
        }
      }
      // other page fields...
    };
    // You can use this information to perform additional actions in your database
    const site = await prisma.site.create({
      data: {
        name: siteName,
        description: siteDescription,
        subdomain: user.gh_username ?? user.id,
        user: {
          connect: {
            id: user.id,
          },
        },
        pages: {
          create: [pageData]
        }
      },
      include: {
        pages: true // Include the pages in the result
      }
    });

    const homepageId = site.pages[0].id;

    // Update the site to set the homepageId
    await prisma.site.update({
      where: {
        id: site.id
      },
      data: {
        homepageId: homepageId
      }
    });
  }

  static async userExists(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return !!user;
  }

  static async setSignUp(userAttributes: Partial<User>) {
    if(! userAttributes.email ) {
      throw new Error('Email is required');
    }

    if( !userAttributes.name ) {
      throw new Error('Name is required');
    }


    // Check if the user exists
    const exists = await RegistrationService.userExists(userAttributes.email);

    if(exists) {
      return false;
    }

    cookies().set('signup_name', userAttributes.name);

    return true;

  }
};

export default RegistrationService;
export const { registerAndSignInCustomer, userExists, setSignUp } = RegistrationService;