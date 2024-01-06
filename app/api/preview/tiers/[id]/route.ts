import { getSession } from "@/lib/auth";

import { getTierOfUser } from "@/lib/tiers/fetchers";

// Get published tiers of the current admin
export async function GET(req: Request, context : any) {
    
    const session = await getSession();
    
    if (!session?.user.id) {
        return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
    }

    try {
        const tiers = await getTierOfUser(session.user.id, context.params.id);
        return new Response(JSON.stringify(tiers), { status: 200 });
    } catch (error : any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

}