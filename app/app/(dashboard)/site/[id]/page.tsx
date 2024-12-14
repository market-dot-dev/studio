import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

import SiteAdmin from "../../../../../components/site/site-admin";

async function SitePage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;

  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <SiteAdmin id={id} />
    </>
  );
}

export default SitePage;
