import React from "react";
import PageHeading from "@/components/common/page-heading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProspectService from "@/app/services/prospect-service";
import ProspectsTable from "./prospects-table";

export default async function ProspectsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const prospects = await ProspectService.getProspects(session.user.id);

  // This is the full prospects page, so we don't need to limit the rows
  // but we're preserving the logic from the original component
  const showAll = true; // Set to true since this is the full prospects page
  const maxInitialRows = undefined; // No need to limit rows on the full page

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12">
      <div className="flex w-full justify-between">
        <div className="flex flex-col">
          <PageHeading title="Prospects" />
          <p className="text-sm text-stone-500">
            View all prospects who have submitted an interest on one of your
            packages.
          </p>
        </div>
      </div>
      
      <DataTable columns={columns} data={prospects} />
      
      {!showAll && maxInitialRows && prospects.length > maxInitialRows && (
        <div className="grid justify-items-end mt-4">
          <Link href="/prospects">
            <Button size="sm" variant="outline">
              View All Prospects →
            </Button>
          </Link>
        </div>
        )}
    </div>
  );
}
