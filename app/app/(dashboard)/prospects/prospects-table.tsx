import { Prospect, Subscription } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Button,
} from "@tremor/react";
import React from "react";
import Tier from "@/app/models/Tier";
import DashboardCard from "@/components/common/dashboard-card";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

type RowProps = {
  prospect: Prospect & { tier: Tier };
};

const ProspectRow: React.FC<RowProps> = ({ prospect }) => {
  return (
    <TableRow className="m-0 p-2" key={prospect.id}>
      <TableCell className="m-0 p-4 text-left">{prospect.name}</TableCell>
      <TableCell className="m-0 p-4 text-left">
        <a href={`mailto:${prospect.email}`}>{prospect.email}</a>
      </TableCell>
      <TableCell className="m-0 p-4 text-left">
        <Link href={`/tiers/${prospect.tier.id}`} target="_blank">
          {prospect.tier.name}
        </Link>
      </TableCell>
      <TableCell className="m-0 p-4 text-center">
        {formatDate(prospect.createdAt)}
      </TableCell>
    </TableRow>
  );
};

export const ProspectsTable: React.FC<{
  prospects: (Prospect & { tier: Tier })[];
  maxInitialRows?: number;
}> = ({ prospects, maxInitialRows }) => {
  const showAll = false;

  const rows = prospects.map((prospect) => (
    <ProspectRow key={prospect.id} prospect={prospect} />
  ));

  const visibleRows = showAll ? rows : rows.slice(0, maxInitialRows);

  return (
    <>
      <DashboardCard>
        <Table>
          <TableHead>
            <TableRow>
              {["Name", "Email", "Package", "Submitted On"].map(
                (header, index) => (
                  <TableHeaderCell
                    key={header}
                    className={index === 3 ? "text-center" : "text-left"}
                  >
                    {header}
                  </TableHeaderCell>
                ),
              )}
            </TableRow>
          </TableHead>
          <TableBody>{visibleRows}</TableBody>
        </Table>
      </DashboardCard>
      {!showAll && maxInitialRows && rows.length > maxInitialRows && (
        <div className="grid justify-items-end">
          <Link href="/prospects">
            <Button size="xs" className="h-6" variant="secondary">
              View All Prospects →
            </Button>
          </Link>
        </div>
      )}
    </>
  );
};

export default ProspectsTable;
