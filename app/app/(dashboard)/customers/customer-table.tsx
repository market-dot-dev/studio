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
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export type CustomerWithChargesAndSubscriptions = User & {
  charges: (Charge & { tier: Tier })[];
  subscriptions: (Subscription & { tier: Tier })[];
};

const CustomerRow = ({ customer }: { customer: CustomerWithChargesAndSubscriptions }) => {
  const customerSince = formatDate(
    new Date(Math.min(
      ...customer.subscriptions.map(s => s.createdAt.getTime()),
      ...customer.charges.map(c => c.createdAt.getTime())
    ))
  );

  const purchasesSummary = `${customer.subscriptions.length} subscription${customer.subscriptions.length !== 1 ? 's' : ''}, ${customer.charges.length} charge${customer.charges.length !== 1 ? 's' : ''}`;

  return (
    <TableRow key={customer.id}>
      <TableCell>{customer.name}</TableCell>
      <TableCell className="text-left">{customer.company || '(unknown)'}</TableCell>
      <TableCell className="text-left"><a href={`mailto:${customer.email}`}>{customer.email}</a></TableCell>
      <TableCell className="text-left">{purchasesSummary}</TableCell>
      <TableCell className="text-center">{customerSince}</TableCell>
      <TableCell className="text-right">
        <LinkButton label="View" href={`/customers/${customer.id}`} />
      </TableCell>
    </TableRow>
  );
};

export const CustomersTable = ({ customers, maxInitialRows }: { customers: CustomerWithChargesAndSubscriptions[], maxInitialRows?: number }) => {
  const showAll = !maxInitialRows;
  const visibleCustomers = showAll ? customers : customers.slice(0, maxInitialRows);

  return (
    <>
      <DashboardCard>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell className="text-left">Company</TableHeaderCell>
              <TableHeaderCell className="text-left">Email</TableHeaderCell>
              <TableHeaderCell className="text-left">Purchases</TableHeaderCell>
              <TableHeaderCell className="text-center">Customer Since</TableHeaderCell>
              <TableHeaderCell className="text-right"></TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleCustomers.map(customer => (
              <CustomerRow key={customer.id} customer={customer} />
            ))}
          </TableBody>
        </Table>
      </DashboardCard>
      {!showAll && customers.length > (maxInitialRows || 0) && (
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