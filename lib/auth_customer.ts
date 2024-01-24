import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: "Email", type: "text", placeholder: "john.doe@example.com" },
			},
			authorize: async (credentials) => {

				if (!credentials || !credentials.email) {
					return null;
				}

				// // Check if the user exists, if not, create a new user
				const user = await prisma.user.findUnique({
				  where: { email: credentials.email },
				}) || await prisma.user.create({
				  data: { email: credentials.email, roleId: 'customer' },
				});

				if (user) {
				  return { id: user.id, name: user.name, email: user.email };
				} else {
				  return null;
				}
			},
		}),
	],
	pages: {
		signIn: `/login`,
		verifyRequest: `/login`,
		error: "/login",
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
		jwt: async ({ token, user }) => {
			if (user) {
				token.user = user;
			}
			return token;
		},
		session: async ({ session, token }) => {
			session.user = {
				...session.user,
				// @ts-expect-error
				id: token.sub,
				// @ts-expect-error
				username: token?.user?.username || token?.user?.gh_username,
			};
			return session;
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