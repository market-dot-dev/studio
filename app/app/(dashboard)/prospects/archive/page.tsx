import { ProspectState } from "@/app/generated/prisma";
import { getProspects } from "@/app/services/prospects/prospect-service";
import { requireOrganization } from "@/app/services/user-context-service";
import PageHeader from "@/components/common/page-header";
import { DataTable } from "@/components/ui/data-table";
import { columns, renderProspectContextSubRowComponent } from "../columns";

export default async function ArchivedProspectsPage() {
  const organization = await requireOrganization();
  const prospects = await getProspects(organization.id, {
    states: [ProspectState.ARCHIVED]
  });

  return (
    <div className="flex max-w-screen-xl flex-col space-y-10">
      <PageHeader
        title="Archived Prospects"
        description="Archived prospects are hidden from the active list but kept for your records."
        backLink={{
          href: "/prospects",
          title: "Prospects"
        }}
      />

      {prospects.length === 0 ? (
        <div className="rounded-lg border border-dashed border-stone-300 bg-stone-50 p-10 text-center text-sm text-stone-600">
          You have not archived any prospects yet.
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={prospects}
          renderSubRowComponent={renderProspectContextSubRowComponent}
        />
      )}
    </div>
  );
}
