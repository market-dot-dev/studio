import { jwtCallback, sessionCallback } from "@/app/services/auth-service";
import { sendVerificationEmail } from "@/app/services/email-service";
import prisma from "@/lib/prisma";
import { Session } from "@/types/session";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { getServerSession, type NextAuthOptions } from "next-auth";
import { Provider } from "next-auth/providers";
import EmailProvider from "next-auth/providers/email";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
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
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile",
          // Force Google to redirect to localhost in development
          ...(isDevelopment && {
            redirect_uri: "http://localhost:3000/api/auth/callback/google"
          })
        }
      },
      allowDangerousEmailAccountLinking: true // Allows you to sign in with different providers
    }),
    EmailProvider({
      // @NOTE: "server"/"from" are unused, but required here as sendgrid takes care of email
      server: process.env.EMAIL_SERVER,
      from: process.env.SENDGRID_FROM_EMAIL,
      // the following configuration of EmailProvider makes it use a 6 digit token number instead of a magic link
      maxAge: 5 * 60, // 5 minutes
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
      allowDangerousEmailAccountLinking: true, // Allows you to sign in with different providers
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url
        };
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
    jwt: jwtCallback,
    session: sessionCallback,
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

export async function getSession(): Promise<Session | null> {
  return getServerSession(authOptions) as Promise<Session | null>;
}
