import { getServerSession, type NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { Provider } from "next-auth/providers";

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;

interface UserDetails {
  id: string;
  gh_username: string;
  name: string;
  email: string;
  image: string;
}

// return a refreshed acccess token of github
async function getAccessToken(userId : string) : Promise<string | null> {
  try {
    // Retrieve the current refresh token from the database
    const currentAccount = await prisma.account.findFirst({
      where: { userId: userId, provider: 'github' },
    });
    
    // if access token and not expired
    if( currentAccount?.access_token && currentAccount?.expires_at && Date.now() < currentAccount?.expires_at * 1000 ) {
      return currentAccount.access_token;
    }

    if (!currentAccount?.refresh_token) {
      throw new Error("No refresh token available");
    }

    // get updated tokens using refresh token
    const url = `https://github.com/login/oauth/access_token`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        refresh_token: currentAccount.refresh_token,
        client_id: process.env.AUTH_GITHUB_ID,
        client_secret: process.env.AUTH_GITHUB_SECRET,
        grant_type: 'refresh_token'
      }),
    });

    const refreshedTokens = await response.json();
    
    if (!response.ok) {
      throw refreshedTokens;
    }

    // Update the refresh token in the database
    await prisma.account.update({
      where: { id: currentAccount.id },
      data: {
        access_token: refreshedTokens.access_token,
        expires_at: Math.round(Date.now() / 1000) + refreshedTokens.expires_in,
        refresh_token: refreshedTokens.refresh_token
      },
    });

    return refreshedTokens.access_token;

  } catch (error) {
    console.error('RefreshAccessTokenError', error);
    return null;
  }
}

async function upsertUser(userDetails: UserDetails) {
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
        emailVerified: null, // Set this to the current time if the email is verified at creation
        createdAt: new Date(), // Set to the current time
        updatedAt: new Date(), // Set to the current time
      },
    });

    await createSite(user);

    return user;
  }
}

const createSite = async (user: any) => {
  const pageData = {
    title: "Welcome",
    slug: 'index',
    content: "<h1>Welcome to our homepage</h1>",
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
      name: 'Support Website',
      description: 'Support Website Description',
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

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          gh_username: profile.login,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    }),
    process.env.NODE_ENV === "development" &&
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          gh_username: { label: "GitHub Username", type: "text", placeholder: "Enter your GitHub username" },
          password: { label: "Password", type: "password", placeholder: "Enter the override password" },
        },
        async authorize(credentials, req) {
          if (
            credentials &&
            credentials.gh_username &&
            credentials.password &&
            process.env.DEV_OVERRIDE_PASSWORD &&
            credentials.password === process.env.DEV_OVERRIDE_PASSWORD
          ) {
            // Prepare minimal user details for upserting
            const userDetails = {
              id: `dev-${credentials.gh_username}`,  // Unique ID constructed using the GitHub username
              gh_username: credentials.gh_username,  // GitHub username from the provided credentials
              name: "",  // No default name, it will be set based on existing data or remain empty
              email: "",  // No default email, it will be set based on existing data or remain empty
              image: "",  // No default image, it will be set based on existing data or remain empty
            };
      
            const user = await upsertUser(userDetails);
      
            return user;
          }
      
          // If verification fails or credentials are missing, return null
          return null;
        },
      }),
  ].filter(Boolean) as Provider[],
  pages: {
    signIn: `/login`,
    verifyRequest: `/login`,
    error: "/login", // Error code passed in query string as ?error=
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  cookies: {
    sessionToken: {
      name: `${VERCEL_DEPLOYMENT ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        // When working on localhost, the cookie domain must be omitted entirely (https://stackoverflow.com/a/1188145)
        domain: VERCEL_DEPLOYMENT
          ? `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
          : undefined,
        secure: VERCEL_DEPLOYMENT,
      },
    },
  },
  callbacks: {
    jwt: async ({ token, user, account } : any) => {
      // Store the refresh token in the database when the user logs in
      if (account && user) {
        await prisma.account.upsert({
          where: {
            provider_providerAccountId: { provider: account.provider, providerAccountId: account.providerAccountId },
          },
          // this create might not even be required, assuming that the nextauth has already created the account, but just in case
          create: {
            userId: user.id,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            type: 'oauth',

            // just ensuring that the account object has the following values
            expires_at: account.expires_at,
            refresh_token: account.refresh_token,
            refresh_token_expires_in: account.refresh_token_expires_in,
            
          },
          // the default nextauth implementation does not add the following values to the account object, so updating here
          update: {
            expires_at: account.expires_at,
            refresh_token: account.refresh_token,
            refresh_token_expires_in: account.refresh_token_expires_in
          },
        });
      } 
      
      if (user) {
        token.user = user;
      }

      
      return token;
    },
    session: async ({ session, token } : any) => {

      session.user = {
        ...session.user,
        id: token.sub,
        username: token?.user?.username || token?.user?.gh_username,
      };
      
      return session;
    },
  },
  events: {
    signIn: async ({user}: {user: any}) => {
    },
    createUser: async ({user}: {user: any}) => {
      if (!user) {
        return;
      }

      return await createSite(user);
    },
  },
};

export function getSession() {
  return getServerSession(authOptions) as Promise<{
    user: {
      id: string;
      name: string;
      username: string;
      email: string;
      image: string;
    };
  } | null>;
}

export function withSiteAuth(action: any) {
  return async (
    formData: FormData | null,
    siteId: string,
    key: string | null,
  ) => {
    const session = await getSession();
    if (!session) {
      return {
        error: "Not authenticated",
      };
    }
    const site = await prisma.site.findUnique({
      where: {
        id: siteId,
      },
    });
    if (!site || site.userId !== session.user.id) {
      return {
        error: "Not authorized",
      };
    }

    return action(formData, site, key);
  };
}

export function withPostAuth(action: any) {
  return async (
    formData: FormData | null,
    postId: string,
    key: string | null,
  ) => {
    const session = await getSession();
    if (!session?.user.id) {
      return {
        error: "Not authenticated",
      };
    }
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        site: true,
      },
    });
    if (!post || post.userId !== session.user.id) {
      return {
        error: "Post not found",
      };
    }

    return action(formData, post, key);
  };
}


