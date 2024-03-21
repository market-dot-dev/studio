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
import { cookies } from 'next/headers'
import { projectDescription, projectName } from "./constants/site-template";
import Session, { createSessionUser } from "@/app/models/Session";
import UserService from "@/app/services/UserService";

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;
const isDevelopment = process.env.NODE_ENV === "development";

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
      generateVerificationToken: async () => Math.floor(100000 + Math.random() * 900000).toString(),
      sendVerificationRequest: ({ identifier: email, token }) => {
        const html = `<p>Your verification code for signing in to Gitwallet.co is <strong>${token}</strong></p>`;
        const text = `Your verification code for signing in to Gitwallet.co is ${token}`;
        return EmailService.sendEmail(email, `Verification code`, text, html)
        
      }
		}),
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
        domain: `.${process.env.NEXT_PUBLIC_ROOT_HOST}`,
        secure: VERCEL_DEPLOYMENT,
      },
    },
  },
  callbacks: {
    jwt: async ({ token, user, account, trigger, session, isNewUser } : any) => {
      // update the roleId if switched by the user from the frontend
      if (trigger === "update"){
        const currentUser = await UserService.getCurrentUser();
        const isAdmin = currentUser?.roleId === 'admin';

        if(session?.roleId && isAdmin) {
          token.user = { ...token.user, roleId: session.roleId}
        } else {
          if(currentUser) {
            token.user = {
              ...token.user,
              ...createSessionUser(currentUser),
            }
          }
        }

        return token;
      }

      const userData = user ? {...user} : null;

      // if its a new user, then based on the provider, we can set the roleId
      if( isNewUser ) {
        const signupName = (cookies().get('signup_name') ?? null) ;
        const name = (signupName?.value ?? null) as string | null;
      
        const roleId = account.provider === 'github' ? 'maintainer' : 'customer';
        await prisma.user.update({
          where: { id: user.id },
          data: {
            roleId,
            projectName,
            projectDescription,
            ...(name ? { name } : {})
          },
        });
        // also update the roleId in the token
        userData.roleId = roleId;
        if(name) {
          userData.name = name;
        }
        
        if(userData.roleId === 'maintainer') {
          await EmailService.sendNewMaintainerSignUpEmail({...userData});
        } else {
          await EmailService.sendNewCustomerSignUpEmail({...userData});
        }

        if(signupName) {
          cookies().delete('signup_name')
        }
      }

      // Store the refresh token in the database when the user logs in
      if (account && user) {
        // at this point, the user item in table does not have the onboarding data set. So, we can attach the default one to the first token being generated on signup.
        if (!user.onboarding) {
          userData.onboarding = JSON.stringify( defaultOnboardingState );
        }
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
            refresh_token_expires_in: account.refresh_token_expires_in
          },
          // the default nextauth implementation does not add the following values to the account object, so updating here
          update: {
            expires_at: account.expires_at,
            refresh_token: account.refresh_token,
            refresh_token_expires_in: account.refresh_token_expires_in
          },
        });
      } 
      
      if (userData) {
        token.user = userData;
      }
      
      return token;
    },
    session: async ({ session, token }: any) => {
      const filteredSession = createSessionUser(token.user);
      session.user = {
        //id: token.sub, # FIXME do we need this?
        ...(filteredSession || {}),
        // an empty token.user?.onboarding will signal that the user's onboarding is complete
        ...(token.user?.onboarding?.length ? { onboarding: true } : {}),
      };
      
      return session;
    }
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

export async function withSiteAuth(action: any) {
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

export async function withPostAuth(action: any) {
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


