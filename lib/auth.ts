import Session from "@/app/models/Session";
import AuthService from "@/app/services/auth-service";
import { sendVerificationEmail } from "@/app/services/email-service";
import { upsertUser } from "@/app/services/onboarding/registration-service";
import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { getServerSession, type NextAuthOptions } from "next-auth";
import { Provider } from "next-auth/providers";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import GitHubProvider from "next-auth/providers/github";
import { domainCopy } from "./domain";

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;
const isPreview = process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";
const isDevelopment =
  process.env.NODE_ENV === "development" ||
  process.env.NEXT_PUBLIC_VERCEL_ENV === "development" ||
  process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";

const cookieDomain = isPreview
  ? process.env.VERCEL_BRANCH_URL
  : `.${process.env.NEXT_PUBLIC_ROOT_HOST}`;

export const authOptions: NextAuthOptions = {
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.SENDGRID_API_KEY
        }
      },
      from: process.env.SENDGRID_FROM_EMAIL,
      // the following configuration of EmailProvider makes it use a 6 digit token number instead of a magic link
      maxAge: 5 * 60,
      generateVerificationToken: async () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
      },
      sendVerificationRequest: ({ identifier: email, token }) => {
        return sendVerificationEmail(email, token, domainCopy());
      }
    }),
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
      allowDangerousEmailAccountLinking: isDevelopment,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          gh_id: profile.id,
          gh_username: profile.login,
          email: profile.email,
          image: profile.avatar_url
        };
      }
    }),
    isDevelopment &&
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          gh_username: {
            label: "GitHub Username",
            type: "text",
            placeholder: "Enter your GitHub username"
          },
          password: {
            label: "Password",
            type: "password",
            placeholder: "Enter the override password"
          }
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
              id: `dev-${credentials.gh_username}`, // Unique ID constructed using the GitHub username
              gh_username: credentials.gh_username, // GitHub username from the provided credentials
              name: "", // No default name, it will be set based on existing data or remain empty
              email: `${credentials.gh_username}@gh.${domainCopy()}`, // No default email, it will be set based on existing data or remain empty
              image: "" // No default image, it will be set based on existing data or remain empty
            };

            const user = await upsertUser(userDetails);

            return user;
          }

          // If verification fails or credentials are missing, return null
          return null;
        }
      })
  ].filter(Boolean) as Provider[],
  pages: {
    signIn: `/login`,
    verifyRequest: `/api/authresponse`,
    error: "/api/authresponse" // Error code passed in query string as ?error=
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
        domain: cookieDomain,
        secure: VERCEL_DEPLOYMENT
      }
    }
  },
  callbacks: {
    jwt: AuthService.jwtCallback,
    session: AuthService.sessionCallback,
    redirect({ url, baseUrl }: { url: string; baseUrl: string }): string {
      // custom redirect logic
      if (!/^https?:\/\//.test(url)) {
        return url.startsWith(baseUrl) ? url : baseUrl;
      }

      const rootHost = process.env.NEXT_PUBLIC_ROOT_HOST;
      if (rootHost) {
        try {
          const { host } = new URL(url);
          if (host.endsWith(rootHost)) {
            return url;
          }
        } catch (error) {
          console.error("Error parsing redirect URL:", error);
        }
      }
      return url.startsWith(baseUrl) ? url : baseUrl;
    }
  },
  events: {
    signIn: async ({ user, account }: any) => {},
    createUser: async ({ user }: { user: any }) => {
      if (!user) {
        return;
      }
    }
  }
};

export async function getSession() {
  return getServerSession(authOptions) as Promise<Session>;
}
