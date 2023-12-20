import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;
const prismaClient = new PrismaClient();

export const authOptions: NextAuthOptions = {
	providers: [
		// EmailProvider({
		// 	server: process.env.EMAIL_SERVER ?? '',
		// 	from: process.env.EMAIL_FROM ?? '',
		// }),
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: "Email", type: "text", placeholder: "john.doe@example.com" },
			},
			authorize: async (credentials) => {

				// console.log('credentials', credentials)

				if (!credentials || !credentials.email) {
					return null;
				}

				// // Check if the user exists, if not, create a new user
				const user = await prisma.user.findUnique({
				  where: { email: credentials.email },
				}) || await prisma.user.create({
				  data: { email: credentials.email },
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
	// events: {
	//   createUser: async ({user}: {user: any}) => {
	//     // console.log('creating user')
	//     if (!user) {
	//       return;
	//     }
	//     const pageData = {
	//       title: "Welcome",
	//       slug: 'index',
	//       content: "<h1>Welcome to our homepage</h1>",
	//       user: {
	//         connect: {
	//           id: user.id,
	//         }
	//       }
	//       // other page fields...
	//     };
	//     // You can use this information to perform additional actions in your database
	//     const site = await prismaClient.site.create({
	//       data: {
	//         name: 'Support Website',
	//         description: 'Support Website Description',
	//         subdomain: user.gh_username ?? user.id,
	//         user: {
	//           connect: {
	//             id: user.id,
	//           },
	//         },
	//         pages: {
	//           create: [pageData]
	//         }
	//       },
	//       include: {
	//         pages: true // Include the pages in the result
	//       }
	//     });

	//     const homepageId = site.pages[0].id;

	//     // Update the site to set the homepageId
	//     await prisma.site.update({
	//       where: {
	//         id: site.id
	//       },
	//       data: {
	//         homepageId: homepageId
	//       }
	//     });
	//   },
	// },
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