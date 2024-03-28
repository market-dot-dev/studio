"use server";


import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import PageHeading from "@/components/common/page-heading";

import SiteService from "@/app/services/SiteService";
import SiteSettings from "@/components/user/site-settings";
import { Title } from "@tremor/react";


export default async function SiteSettingsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const site = await SiteService.getCurrentSite();

  return (    
    <div className="space-y-6">
      { site  ? <SiteSettings site={site} /> : null }
    </div>
    
  );
}
