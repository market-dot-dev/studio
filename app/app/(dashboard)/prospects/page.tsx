import ProspectService from "@/app/services/prospect-service";
import { requireUserSession } from "@/app/services/user-context-service";
import PageHeader from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Link from "next/link";
import { columns, renderProspectContextSubRowComponent } from "./columns";

export default async function ProspectsPage() {
  const user = await requireUserSession();
  const prospects = await ProspectService.getProspects(user.id);

  // This is the full prospects page, so we don't need to limit the rows
  // but we're preserving the logic from the original component
  const showAll = true; // Set to true since this is the full prospects page
  const maxInitialRows = undefined; // No need to limit rows on the full page

  return (
    <div className="flex max-w-screen-xl flex-col space-y-10">
      <PageHeader
        title="Prospects"
        description="View all prospects who have submitted an interest on one of your packages."
      />

      <DataTable
        columns={columns}
        data={prospects}
        renderSubRowComponent={renderProspectContextSubRowComponent}
      />

      {!showAll && maxInitialRows && prospects.length > maxInitialRows && (
        <div className="mt-4 grid justify-items-end">
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
