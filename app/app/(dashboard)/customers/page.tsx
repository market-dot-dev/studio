"use client";
import { useState, useEffect } from 'react';
import { User, Subscription, Charge } from '@prisma/client';
import { customersOfMaintainer } from '@/app/services/UserService';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
} from '@tremor/react';
import React from 'react';
import Tier from '@/app/models/Tier';
import useCurrentSession from '@/app/hooks/use-current-session';
import PageHeading from '@/components/common/page-heading';
import LinkButton from '@/components/common/link-button';
import DashboardCard from '@/components/common/dashboard-card';
import SubscriptionStatusBadge from './subscription-state';
import PurchaseStatusBadge from './purchase-state';
import { formatDate } from '@/lib/utils';

type CustomerWithChargesAndSubscriptions = User & {
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
      <TableCell className="m-0 p-2 text-center"><SubscriptionStatusBadge subscription={subscription}/></TableCell>
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
      <TableCell className="m-0 p-2 text-center"><PurchaseStatusBadge charge={charge}/></TableCell>
      <TableCell className="m-0 p-2 text-center">{formatDate(charge.createdAt)}</TableCell>
      <TableCell className="m-0 p-2 text-right">
        <div className="flex flex-row justify-end gap-1">
          <LinkButton label="View" href={`/customers/${user.id}`} />
        </div>
      </TableCell>
    </TableRow>
  );
};

export const CustomersTable = async ({ maxInitialRows }: { maxInitialRows?: number }) => {
  const { currentUser } = useCurrentSession();
  const userId = currentUser?.id;
  const [customers, setCustomers] = useState<CustomerWithChargesAndSubscriptions[]>([]);

  const fetchCustomers = async () => {
    if (typeof userId === 'string') {
      const fetchedCustomers = await customersOfMaintainer(userId);
      setCustomers(fetchedCustomers);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [userId]);

  return (
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
          {customers.map((customer) => (
            <React.Fragment key={customer.id}>
              {customer.subscriptions.map((subscription) => (
                <SubscriptionRow key={subscription.id} user={customer} subscription={subscription} />
              ))}
              {customer.charges.map((charge) => (
                <ChargeRow key={charge.id} user={customer} charge={charge} />
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </DashboardCard>
  );
}

const CustomersPage = async () => {
  return (
    <div className="flex max-w-screen-xl flex-col space-y-12">
      <div className="flex w-full justify-between">
        <div className="flex flex-col">
          <PageHeading title="All Customers" />
          <Text>Manage your customers and their tiers here.</Text>
        </div>
      </div>
      <CustomersTable />
    </div>
  );
};

export default CustomersPage;