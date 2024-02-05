import PageHeading from "@/components/common/page-heading";
import {
  Button,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableBody,
  BadgeDelta,
  Bold,
  Badge,
} from "@tremor/react";
import DashboardCard from "@/components/common/dashboard-card";
import { MoreHorizontal } from "lucide-react";
import TierService from "@/app/services/TierService";
import PrimaryLinkButton from "../common/link-button";

export default async function CustomersList(props: { numRecords?: number, previewMode?: boolean}) {

  // Number of records to show (optional)
  const numRecords = props.numRecords || null;

  // In preview mode, only a few columns are shown
  const previewMode = props.previewMode || false;

  // Number of days to look back for new customers
  const daysAgo = 30;

  const customersList = await TierService.getLatestCustomers(numRecords, daysAgo) as any[];

  return (
    <div className="flex max-w-screen-xl flex-col space-y-4">
        <Bold>You have new customers!</Bold>

        <Table className="">
          <TableHead>
            <TableRow>
              {previewMode || <TableHeaderCell>ID</TableHeaderCell>}
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell className="text-right">Company</TableHeaderCell>
              <TableHeaderCell className="text-right">Tier</TableHeaderCell>
              {previewMode || <TableHeaderCell className="text-right">Status</TableHeaderCell>}
              <TableHeaderCell className="text-right">Subscription Date</TableHeaderCell>
              {previewMode || <TableHeaderCell className="text-right">Renewal</TableHeaderCell>}
              <TableHeaderCell className="text-right"></TableHeaderCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {customersList
              .map((item) => (
                <TableRow className="p-2 m-0" key={item.name}>                  
                  {previewMode || <TableCell className="p-2 m-0">{item.id}</TableCell>}
                  <TableCell className="p-2 m-0">{item.name}</TableCell>
                  <TableCell  className="p-2 m-0 text-right">{item.company}</TableCell>
                  <TableCell className="p-2 m-0 text-right">{item.tier}</TableCell>
                  {previewMode ||<TableCell className="p-2 m-0 text-right">
                    <Badge size="xs">
                      {item.status}
                    </Badge>
                  </TableCell>}
                  <TableCell className="p-2 m-0 text-right">{item.dateSince}</TableCell>
                  {previewMode ||<TableCell className="p-2 m-0 text-right">{item.nextRenewal}</TableCell>}
                  <TableCell className="p-2 m-0 text-right">
                    <div className="flex flex-row gap-1 justify-end">
                      <PrimaryLinkButton label="View More" href={`/customers/${item.id}`} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
    </div>
  );
}