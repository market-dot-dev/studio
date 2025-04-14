import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

import SiteAdmin from "@/components/site/site-admin";

async function SitePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return <SiteAdmin id={params.id} />;
}

export default SitePage;
