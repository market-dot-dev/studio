import { getSession } from "@/lib/auth";
import { getTiersForUser } from "@/lib/tiers/fetchers";

// Get published tiers of the current admin
export async function GET(req: Request, res: Response) {
    
    const session = await getSession();

    if (!session?.user.id) {
        return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
    }

    try {
        const tiers = await getTiersForUser(session.user.id);
        return new Response(JSON.stringify(tiers), { status: 200 });
    } catch (error : any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

}