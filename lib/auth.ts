import { getServerSession, type NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { Provider } from "next-auth/providers";
import RegistrationService from "@/app/services/registration-service";

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;
const isDevelopment = process.env.NODE_ENV === "development";

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
    isDevelopment &&
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
              roleId: "admin",
            };
      
            const user = await RegistrationService.upsertUser(userDetails);
      
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

      return await RegistrationService.createSite(user);
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


