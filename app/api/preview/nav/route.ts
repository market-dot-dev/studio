import { getSession } from "@/lib/auth";
import { getSiteNav } from "@/app/services/SiteService";

// Get nav items for the site of the current admin
export async function GET() {
  const session = await getSession();

  if (!session?.user.id) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
    });
  }

  try {
    const nav = await getSiteNav(null, session.user.id);
    return new Response(JSON.stringify(nav), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
