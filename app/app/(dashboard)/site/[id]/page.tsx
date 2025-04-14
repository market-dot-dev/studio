import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

import SiteAdmin from "@/components/site/site-admin";

async function SitePage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return <SiteAdmin id={params.id} />;
}

export default SitePage;
