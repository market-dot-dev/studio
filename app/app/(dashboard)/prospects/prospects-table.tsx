import { Prospect, Subscription } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";
import { Button } from "@/components/ui/button";
import React from "react";
import Tier from "@/app/models/Tier";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

type RowProps = {
  prospect: Prospect & { tier: Tier };
};

const ProspectRow: React.FC<RowProps> = ({ prospect }) => {
  return (
    <>
      <TableRow className="m-0 border-0 p-2" key={`${prospect.id}-details`}>
        <TableCell className="m-0 p-4 pb-2 text-center">
          {formatDate(prospect.createdAt)}
        </TableCell>
        <TableCell className="m-0 p-4 pb-2 text-left">{prospect.name}</TableCell>
        <TableCell className="m-0 p-4 pb-2 text-left">
          <a href={`mailto:${prospect.email}`}>{prospect.email}</a>
        </TableCell>
        <TableCell className="m-0 p-4 pb-2 text-left">{prospect.organization}</TableCell>
        <TableCell className="m-0 p-4 pb-2 text-left">
          <Link href={`/tiers/${prospect.tier.id}`} target="_blank">
            {prospect.tier.name}
          </Link>
        </TableCell>
        <TableCell className="m-0 p-4 pb-2 text-left">
          {prospect.context}
        </TableCell>
      </TableRow>
    </>
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
      <Card>
        <Table>
          <TableHead>
            <TableRow>
              {[
                "Submitted On",
                "Name",
                "Email",
                "Organization",
                "Package",
                "Details",
              ].map((header, index) => (
                <TableHeaderCell
                  key={header}
                  className={index === 4 ? "text-center" : "text-left"}
                >
                  {header}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>{visibleRows}</TableBody>
        </Table>
      </Card>
      {!showAll && maxInitialRows && rows.length > maxInitialRows && (
        <div className="grid justify-items-end">
          <Link href="/prospects">
            <Button size="sm" variant="outline">
              View All Prospects →
            </Button>
          </Link>
        </div>
      )}
    </>
  );
};

export default ProspectsTable;
