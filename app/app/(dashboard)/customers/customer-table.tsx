"use client";
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

export type CustomerWithChargesAndSubscriptions = User & {
  charges: (Charge & { tier: Tier })[];
  subscriptions: (Subscription & { tier: Tier })[];
};

type SubscriptionRowProps = {
  user: User;
  subscription: Subscription & { tier: Tier };
};

const SubscriptionRow = ({ user, subscription }: SubscriptionRowProps) => {
  return (
    <TableRow className="m-0 p-2" key={subscription.id}>
      <TableCell className="m-0 p-2">{user.name}</TableCell>
      <TableCell className="m-0 p-2 text-left">{user.company || '(unknown)'}</TableCell>
      <TableCell className="m-0 p-2 text-left"><a href={`mailto:${user.email}`}>{user.email}</a></TableCell>
      <TableCell className="m-0 p-2 text-left">{subscription.tier.name}</TableCell>
      <TableCell className="m-0 p-2 text-center"><SubscriptionStatusBadge subscription={subscription} /></TableCell>
      <TableCell className="m-0 p-2 text-center">{formatDate(subscription.createdAt)}</TableCell>
      <TableCell className="m-0 p-2 text-right">
        <div className="flex flex-row justify-end gap-1">
          <LinkButton label="View" href={`/customers/${user.id}`} />
        </div>
      </TableCell>
    </TableRow>
  );
};

type ChargeRowProps = {
  user: User;
  charge: Charge & { tier: Tier };
};

const ChargeRow = ({ user, charge }: ChargeRowProps) => {
  return (
    <TableRow className="m-0 p-2" key={charge.id}>
      <TableCell className="m-0 p-2">{user.name}</TableCell>
      <TableCell className="m-0 p-2 text-left">{user.company || '(unknown)'}</TableCell>
      <TableCell className="m-0 p-2 text-left"><a href={`mailto:${user.email}`}>{user.email}</a></TableCell>
      <TableCell className="m-0 p-2 text-left">{charge.tier.name}</TableCell>
      <TableCell className="m-0 p-2 text-center"><PurchaseStatusBadge charge={charge} /></TableCell>
      <TableCell className="m-0 p-2 text-center">{formatDate(charge.createdAt)}</TableCell>
      <TableCell className="m-0 p-2 text-right">
        <div className="flex flex-row justify-end gap-1">
          <LinkButton label="View" href={`/customers/${user.id}`} />
        </div>
      </TableCell>
    </TableRow>
  );
};

export const CustomersTable = ({ customers , maxInitialRows }: { customers: CustomerWithChargesAndSubscriptions[], maxInitialRows?: number }) => {
  
  const showAll = false;

  const rows = customers.flatMap((customer) => [
    ...customer.subscriptions.map((subscription) => (
      <SubscriptionRow key={subscription.id} user={customer} subscription={subscription} />
    )),
    ...customer.charges.map((charge) => (
      <ChargeRow key={charge.id} user={customer} charge={charge} />
    )),
  ]);

  const visibleRows = showAll ? rows : rows.slice(0, maxInitialRows);

  return (
    <>
      <DashboardCard>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell className="text-left">Company</TableHeaderCell>
              <TableHeaderCell className="text-left">Email</TableHeaderCell>
              <TableHeaderCell className="text-left">Tier</TableHeaderCell>
              <TableHeaderCell className="text-center">Status</TableHeaderCell>
              <TableHeaderCell className="text-center">Customer Since</TableHeaderCell>
              <TableHeaderCell className="text-right"></TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows}
          </TableBody>
        </Table>
      </DashboardCard>
      {!showAll && maxInitialRows && rows.length > maxInitialRows && (
        <div className="grid justify-items-end">
          <Link href='/customers'>
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