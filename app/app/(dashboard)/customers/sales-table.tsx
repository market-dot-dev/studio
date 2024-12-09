import { User, Subscription, Charge } from '@prisma/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Button,
} from '@tremor/react';
import React from 'react';
import Tier from '@/app/models/Tier';
import LinkButton from '@/components/common/link-button';
import DashboardCard from '@/components/common/dashboard-card';
import SubscriptionStatusBadge from './subscription-state';
import PurchaseStatusBadge from './purchase-state';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { InfoIcon } from 'lucide-react';
import SecondaryButton from "@/components/common/secondary-button";

export type CustomerWithChargesAndSubscriptions = User & {
  charges: (Charge & { tier: Tier })[];
  subscriptions: (Subscription & { tier: Tier })[];
};

type SalesRowProps = {
  user: User;
  tierName: string;
  statusBadge: JSX.Element;
  createdAt: Date;
  userId: string;
};

const SalesRow = ({ user, tierName, statusBadge, createdAt, userId }: SalesRowProps) => {
  return (
    <TableRow className="m-0 p-2">
      <TableCell className="m-0 p-2">{user.name}</TableCell>
      <TableCell className="m-0 p-2 text-left">{user.company || '(unknown)'}</TableCell>
      <TableCell className="m-0 p-2 text-left"><a href={`mailto:${user.email}`}>{user.email}</a></TableCell>
      <TableCell className="m-0 p-2 text-left">{tierName}</TableCell>
      <TableCell className="m-0 p-2 text-center">{statusBadge}</TableCell>
      <TableCell className="m-0 p-2 text-center">{formatDate(createdAt)}</TableCell>
      <TableCell className="m-0 p-2 text-right">
        <div className="flex flex-row justify-end gap-1">
          <LinkButton label="View Customer" href={`/customers/${userId}`} />
        </div>
      </TableCell>
    </TableRow>
  );
};

const SalesTable = ({ customers, maxInitialRows }: { customers: CustomerWithChargesAndSubscriptions[], maxInitialRows?: number }) => {

  const showAll = false;

  const sales = customers.flatMap((customer) => [
    ...customer.subscriptions.map((subscription) => ({
      type: 'subscription',
      user: customer,
      tierName: subscription.tier.name,
      statusBadge: <SubscriptionStatusBadge subscription={subscription} />,
      createdAt: subscription.createdAt,
      userId: customer.id,
    })),
    ...customer.charges.map((charge) => ({
      type: 'charge',
      user: customer,
      tierName: charge.tier.name,
      statusBadge: <PurchaseStatusBadge charge={charge} />,
      createdAt: charge.createdAt,
      userId: customer.id,
    }))
  ]);

  // Sort by createdAt in descending order (latest first)
  sales.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const visiblePurchases = showAll ? sales : sales.slice(0, maxInitialRows);

  return (
    <>
      <div className="flex justify-between">
        <h3 className="text-xl font-bold mb-2">Latest Sales</h3>
        {!showAll && maxInitialRows && (
          <div className="grid justify-items-end">
            <Link href='/customers'>
              <SecondaryButton label="View More Customers" />
            </Link>
          </div>
        )}
      </div>

      <DashboardCard className="mb-8">
        {sales.length === 0 ?
          <div className="flex flex-col items-center justify-center py-8">
            <InfoIcon className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No sales data available</h3>
            <p className="text-gray-500 text-center max-w-md">
              When you make your first sale, it will appear here.
            </p>
          </div> : 
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell className="text-left">Company</TableHeaderCell>
                <TableHeaderCell className="text-left">Email</TableHeaderCell>
                <TableHeaderCell className="text-left">Package</TableHeaderCell>
                <TableHeaderCell className="text-center">Status</TableHeaderCell>
                <TableHeaderCell className="text-center">Date</TableHeaderCell>
                <TableHeaderCell className="text-right"></TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visiblePurchases.map((purchase, index) => (
                <SalesRow
                  key={`${purchase.type}-${index}`}
                  user={purchase.user}
                  tierName={purchase.tierName}
                  statusBadge={purchase.statusBadge}
                  createdAt={purchase.createdAt}
                  userId={purchase.userId}
                />
              ))}
            </TableBody>
          </Table>
        }
      </DashboardCard>
    </>
  );
};

export default SalesTable;
