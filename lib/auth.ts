import { getServerSession, type NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { Provider } from "next-auth/providers";
import EmailService from "@/app/services/EmailService";
import { defaultOnboardingState } from "@/app/services/onboarding/onboarding-steps";
import RegistrationService from "@/app/services/registration-service";
import Session from "@/app/models/Session";
import AuthService from "@/app/services/auth-service";

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;
const isPreview = process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";
const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_VERCEL_ENV === "development" || process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";

const cookieDomain = isPreview ? process.env.VERCEL_BRANCH_URL : `.${process.env.NEXT_PUBLIC_ROOT_HOST}`;

export const authOptions: NextAuthOptions = {
  providers: [
    EmailProvider({
			server: {
				host: process.env.EMAIL_SERVER_HOST,
				port: process.env.EMAIL_SERVER_PORT,
				auth: {
					user: process.env.EMAIL_SERVER_USER,
					pass: process.env.SENDGRID_API_KEY,
				}
			},
      from: process.env.SENDGRID_FROM_EMAIL,
      // the following configuration of EmailProvider makes it use a 6 digit token number instead of a magic link
      maxAge: 5 * 60,
      generateVerificationToken: async () => {
        if(isDevelopment) {
          return "123456";
        } else {
          return Math.floor(100000 + Math.random() * 900000).toString();
        }
      },
      sendVerificationRequest: ({ identifier: email, token }) => {
        const html = `<p>Your verification code for signing in to Gitwallet.co is <strong>${token}</strong></p>`;
        const text = `Your verification code for signing in to Gitwallet.co is ${token}`;
        return EmailService.sendEmail(email, `Verification code`, text, html)
        
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
              email: `${credentials.gh_username}@gh.gitwallet.co`,  // No default email, it will be set based on existing data or remain empty
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
    verifyRequest: `/api/authresponse`,
    error: "/api/authresponse", // Error code passed in query string as ?error=
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
        secure: VERCEL_DEPLOYMENT,
      },
    },
  },
  callbacks: {
    jwt: AuthService.jwtCallback,
    session: AuthService.sessionCallback,
  },
  events: {
    signIn: async ({user, account }: any) => {
    },
    createUser: async ({user}: {user: any}) => {
      if (!user) {
        return;
      }
      
      // Add onboarding status to a new user
      await prisma.user.update({
        where: { id: user.id },
        data: {
          onboarding: JSON.stringify( defaultOnboardingState )
        },
      });
      
      await RegistrationService.createSite(user);
    },
  },
};

export async function getSession() {
  return getServerSession(authOptions) as Promise<Session>;
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
    if (!site || site.userId !== session.user!.id) {
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
    if (!session?.user!.id) {
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


