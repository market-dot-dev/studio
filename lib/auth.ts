import AuthService from "@/app/services/auth-service";
import { sendVerificationEmail } from "@/app/services/email-service";
import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type NextAuthOptions } from "next-auth";
import { Provider } from "next-auth/providers";
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
      // @NOTE: "server"/"from" are unused, but required here as sendgrid takes care of email
      server: process.env.EMAIL_SERVER,
      from: process.env.SENDGRID_FROM_EMAIL,
      maxAge: 5 * 60, // 5 minutes
      generateVerificationToken: async () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
      },
      sendVerificationRequest: async ({ identifier: email, token, url }) => {
        // Create custom URL that goes to our verification page instead of direct callback
        const urlParams = new URL(url);
        const verificationUrl = new URL(`/login/email`, urlParams.origin);

        // Copy all the original params to our custom page
        urlParams.searchParams.forEach((value, key) => {
          verificationUrl.searchParams.set(key, value);
        });

        // Send email with link to our custom verification page
        return sendVerificationEmail(email, token, domainCopy(), verificationUrl.toString());
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
          email: profile.email,
          image: profile.avatar_url
        };
      }
    })
  ].filter(Boolean) as Provider[],
  pages: {
    signIn: `/login`,
    verifyRequest: `/login/pending`,
    error: "/login" // Error code passed in query string as ?error=
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
