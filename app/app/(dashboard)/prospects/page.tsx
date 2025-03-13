import { Text } from "@tremor/react";
import React from "react";
import PageHeading from "@/components/common/page-heading";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProspectService from "@/app/services/prospect-service";

export default async function ProspectsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const prospects = await ProspectService.getProspects(session.user.id);

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12">
      <div className="flex w-full justify-between">
        <div className="flex flex-col">
          <PageHeading title="Prospects" />
          <Text>
            View all prospects who have submitted an interest on one of your
            packages.
          </Text>
        </div>
      </div>
    </div>
  );
}
