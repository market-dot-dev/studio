import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";
import { NextRequest } from "next/server";

// Create the handler function that will check for email verification
const handler = async (req: NextRequest) => {
  // In case it's an email verification callback request, use custom options
  if (req.nextUrl.pathname.includes("/api/auth/callback/email")) {
    const referer = req.headers.get("referer") as string;
    let subdomain = "app";

    try {
      subdomain = referer.split(".")[0].split("://")[1];
    } catch {
      // empty
    }

    const options = {
      ...authOptions,
      callbacks: {
        ...authOptions.callbacks,
        async redirect({ url }: { url: string }) {
          // replace the original subdomain from the url
          const originalSubdomain = url.split(".")[0].split("://")[1];
          const final = url.replace(originalSubdomain, subdomain);

          return final;
        }
      }
    };

    return NextAuth(options)(req);
  }

  // Otherwise use standard options
  return NextAuth(authOptions)(req);
};

// Export the handler for both GET and POST
export { handler as GET, handler as POST };
