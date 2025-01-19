import { Text } from "@tremor/react";
import React from "react";
import PageHeading from "@/components/common/page-heading";
import ProspectsTable from "./prospects-table";
import ProspectService from "@/app/services/prospect-service";
import { getCurrentSessionUser } from "@/app/services/UserService";

export default async function ProspectsPage() {
  const user = await getCurrentSessionUser();
  const prospects = await ProspectService.getProspects(user!.id);

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
      <ProspectsTable prospects={prospects} />
    </div>
  );
}
