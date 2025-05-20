import { getSiteNav } from "@/app/services/site-nav-service";
import { getCurrentOrganizationId } from "@/app/services/user-context-service";

// @TODO: Feels like this shouldn't be an endpoint, but rather a fn to be used in components.

// Get nav items for the site of the current admin
export async function GET() {
  const orgId = await getCurrentOrganizationId();
  try {
    const nav = await getSiteNav(null, orgId ?? undefined);
    return new Response(JSON.stringify(nav), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
