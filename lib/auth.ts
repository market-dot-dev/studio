import { jwtCallback, sessionCallback } from "@/app/services/auth-service";
import { sendVerificationEmail } from "@/app/services/email-service";
import prisma from "@/lib/prisma";
import { Session } from "@/types/session";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { getServerSession, type NextAuthOptions } from "next-auth";
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
        console.log("EMAIL VERIFICATION DEBUG - Original Next-Auth URL:", url);

        // Parse the original Next-Auth generated URL
        const originalUrl = new URL(url);
        console.log(
          "EMAIL VERIFICATION DEBUG - Original search params:",
          Object.fromEntries(originalUrl.searchParams.entries())
        );

        // Create custom URL that goes to our verification page
        const verificationUrl = new URL(`/login/email`, originalUrl.origin);

        // Copy all the original params to our custom page
        originalUrl.searchParams.forEach((value, key) => {
          verificationUrl.searchParams.set(key, value);
        });

        console.log(
          "EMAIL VERIFICATION DEBUG - Final verification URL:",
          verificationUrl.toString()
        );

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
    jwt: jwtCallback,
    session: sessionCallback,
    redirect({ url, baseUrl }: { url: string; baseUrl: string }): string {
      console.log("REDIRECT CALLBACK DEBUG", { url, baseUrl });

      // Handle relative URLs (like "/dashboard", "/checkout")
      if (url.startsWith("/")) {
        const result = `${baseUrl}${url}`;
        console.log("REDIRECT CALLBACK - Relative URL result:", result);
        return result;
      }

      // Handle absolute URLs
      try {
        const urlObj = new URL(url);
        const baseUrlObj = new URL(baseUrl);

        const rootHost = process.env.NEXT_PUBLIC_ROOT_HOST;

        if (rootHost) {
          // Allow URLs on subdomains of your root host (this is key for cross-subdomain redirects)
          if (urlObj.hostname.endsWith(rootHost)) {
            console.log("REDIRECT CALLBACK - Allowing subdomain URL:", url);
            return url;
          }

          // Also allow URLs on localhost with the same port for development
          if (
            isDevelopment &&
            urlObj.hostname.includes("localhost") &&
            baseUrlObj.hostname.includes("localhost") &&
            urlObj.port === baseUrlObj.port
          ) {
            console.log("REDIRECT CALLBACK - Allowing localhost URL:", url);
            return url;
          }

          // Allow URLs with .local domain for development
          if (
            isDevelopment &&
            urlObj.hostname.endsWith(".local") &&
            baseUrlObj.hostname.endsWith(".local")
          ) {
            console.log("REDIRECT CALLBACK - Allowing .local URL:", url);
            return url;
          }
        }

        // Allow URLs on the same origin as baseUrl
        if (urlObj.origin === baseUrlObj.origin) {
          console.log("REDIRECT CALLBACK - Allowing same origin URL:", url);
          return url;
        }

        console.log("REDIRECT CALLBACK - Rejecting URL, falling back to baseUrl:", {
          url,
          baseUrl
        });
      } catch (error) {
        console.error("REDIRECT CALLBACK - Error parsing URL:", error);
      }

      // Default fallback
      return baseUrl;
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
