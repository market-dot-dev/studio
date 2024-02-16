import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const nextAuthHandler = NextAuth(authOptions);

const handler = async (req: NextRequest, res: NextResponse) => {
    
    // enable next auth email token verification on subdomain
    if( req.nextUrl.pathname === '/api/auth/callback/email') {
        const host = req.nextUrl.searchParams.get('host');
        if(host && host !== process.env.NEXTAUTH_URL) {
            process.env.NEXTAUTH_URL = host;
        }
    }

    return nextAuthHandler(req, res);
  };

export { handler as GET, handler as POST };
