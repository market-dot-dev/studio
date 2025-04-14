import { getSiteNav } from "@/app/services/SiteService";
import { getSession } from "@/lib/auth";

// @TODO: Feels like this shouldn't be an endpoint, but rather a fn to be used in components.

// Get nav items for the site of the current admin
export async function GET() {
  const session = await getSession();

  if (!session?.user.id) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  }

  try {
    const nav = await getSiteNav(null, session.user.id);
    return new Response(JSON.stringify(nav), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
