import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";
import { NextRequest, NextResponse } from "next/server";


const nextAuthHandler = NextAuth(authOptions);

const handler = async (req: NextRequest, res: NextResponse) => {
    
    // in case its an email verification callback request, then the redirect should be made to the subdomain of the given host
    if( req.nextUrl.pathname === '/api/auth/callback/email') {
        
        const referer = req.headers.get('referer') as string;    
        let subdomain = 'app';
        
        try {
            subdomain = referer.split('.')[0].split('://')[1];
        } catch {
        }
        
        const options = {...authOptions, callbacks: {
            ...authOptions.callbacks,
            async redirect({ url } : { url: string}) {
                // replace the original subdomain from the url
                const originalSubdomain = url.split('.')[0].split('://')[1];
                const final = url.replace(originalSubdomain, subdomain);

                return final
            }
        }};
        
        return NextAuth(options)(req, res);
    }
    
    return nextAuthHandler(req, res);

};

export { handler as GET, handler as POST };
