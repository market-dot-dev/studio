import { User, Subscription, Charge } from "@prisma/client";
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
import LinkButton from "@/components/common/link-button";
import { Card } from "@/components/ui/card";
import SubscriptionStatusBadge from "./subscription-state";
import PurchaseStatusBadge from "./purchase-state";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export type CustomerWithChargesAndSubscriptions = User & {
  charges: (Charge & { tier: Tier })[];
  subscriptions: (Subscription & { tier: Tier })[];
};

type RowProps = {
  user: User;
  item: (Subscription | Charge) & { tier: Tier };
  hideCustomerDetails: boolean;
};

const CustomerRow: React.FC<RowProps> = ({
  user,
  item,
  hideCustomerDetails,
}) => {
  const isSubscription = "status" in item;

  return (
    <TableRow className="m-0 p-2" key={item.id}>
      <TableCell className="m-0 p-4">
        {hideCustomerDetails ? "" : user.name}
      </TableCell>
      <TableCell className="m-0 p-4 text-left">
        {hideCustomerDetails ? "" : user.company || "(unknown)"}
      </TableCell>
      <TableCell className="m-0 p-4 text-left">
        {hideCustomerDetails ? (
          ""
        ) : (
          <a href={`mailto:${user.email}`}>{user.email}</a>
        )}
      </TableCell>
      <TableCell className="m-0 p-4 text-left">{item.tier.name}</TableCell>
      <TableCell className="m-0 p-4 text-left">
        {isSubscription ? (
          <SubscriptionStatusBadge subscription={item as Subscription} />
        ) : (
          <PurchaseStatusBadge charge={item as Charge} />
        )}
      </TableCell>
      <TableCell className="m-0 p-4 text-right">
        {formatDate(item.createdAt)}
      </TableCell>
      <TableCell className="m-0 p-4 text-right">
        {!hideCustomerDetails && (
          <div className="flex flex-row justify-end gap-1">
            <LinkButton label="View" href={`/customers/${user.id}`} />
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};

export const CustomersTable: React.FC<{
  customers: CustomerWithChargesAndSubscriptions[];
  maxInitialRows?: number;
}> = ({ customers, maxInitialRows }) => {
  const showAll = false;

  const rows = customers.flatMap((customer) => {
    const allItems = [
      ...customer.subscriptions.map((sub) => ({
        ...sub,
        type: "subscription" as const,
      })),
      ...customer.charges.map((charge) => ({
        ...charge,
        type: "charge" as const,
      })),
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return allItems.map((item, index) => (
      <CustomerRow
        key={item.id}
        user={customer}
        item={item}
        hideCustomerDetails={
          index > 0 && item.userId === allItems[index - 1].userId
        }
      />
    ));
  });

  const visibleRows = showAll ? rows : rows.slice(0, maxInitialRows);

  return (
    <>
      <Card>
        <Table>
          <TableHead>
            <TableRow>
              {[
                "Name",
                "Company",
                "Email",
                "Package",
                "Status",
                "Customer Since",
                "",
              ].map((header, index) => (
                <TableHeaderCell
                  key={header}
                  className={index < 5 ? "text-left" : "text-right"}
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
          <Link href="/customers">
            <Button size="xs" className="h-6" variant="secondary">
              View All Customers →
            </Button>
          </Link>
        </div>
      )}
    </>
  );
};

export default CustomersTable;
