import { User, Subscription, Charge } from '@prisma/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Button,
  Badge,
} from '@tremor/react';
import React from 'react';
import Tier from '@/app/models/Tier';
import LinkButton from '@/components/common/link-button';
import DashboardCard from '@/components/common/dashboard-card';
import { formatDate, formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import SubscriptionStatusBadge from './subscription-state';

type SubscriptionWithTier = Subscription & { tier: Tier };
type ChargeWithTier = Charge & { tier: Tier };

export type CustomerWithChargesAndSubscriptions = User & {
  charges: (Charge & { tier: Tier })[];
  subscriptions: (SubscriptionWithTier)[];
};

const renderSubscriptionDetails = (subscriptions: SubscriptionWithTier[], customerId: string) => {
  const displayedSubscriptions = subscriptions.slice(0, 2);
  const hiddenSubscriptionsCount = subscriptions.length - displayedSubscriptions.length;

  return (
    <>
      {displayedSubscriptions.map(subscription => (
        <div key={subscription.id} className="mb-2 indent-4">
          <p>{subscription.tier.name} {formatCurrency(subscription.tier.price)}/{subscription.tier.cadence} <SubscriptionStatusBadge subscription={subscription} /></p>
          <span className="text-xs block">Started on {formatDate(new Date(subscription.createdAt))}</span>
        </div>
      ))}
      {hiddenSubscriptionsCount > 0 && (
        <div className="text-sm text-green-500 indent-4">
          <Link href={`/customers/${customerId}`}>
            ... {`${hiddenSubscriptionsCount} more subscription${hiddenSubscriptionsCount > 1 ? 's' : ''}`}
          </Link>
        </div>
      )}
    </>
  );
};

const renderChargeDetails = (charges: ChargeWithTier[], customerId: string) => {
  const displayedCharges = charges.slice(0, 2);
  const hiddenChargesCount = charges.length - displayedCharges.length;

  return (
    <>
      {displayedCharges.map(charge => (
        <div key={charge.id} className="mb-2 indent-4">
          <p>{charge.tier.name} {formatCurrency(charge.tier.price)}</p>
          <span className="text-xs block">Purchased on {formatDate(new Date(charge.createdAt))}</span>
        </div>
      ))}
      {hiddenChargesCount > 0 && (
        <div className="text-sm text-green-500 indent-4">
          <Link href={`/customers/${customerId}`}>
            ... {`${hiddenChargesCount} more charge${hiddenChargesCount > 1 ? 's' : ''}`}
          </Link>
        </div>
      )}
    </>
  );
};

const CustomerRow = ({ customer }: { customer: CustomerWithChargesAndSubscriptions }) => {
  const customerSince = formatDate(
    new Date(Math.min(
      ...customer.subscriptions.map(s => s.createdAt.getTime()),
      ...customer.charges.map(c => c.createdAt.getTime())
    ))
  );

  return (
    <TableRow key={customer.id}>
      <TableCell className="align-top">{customer.name}</TableCell>
      <TableCell className="text-left align-top">{customer.company || '(unknown)'}</TableCell>
      <TableCell className="text-left align-top"><a href={`mailto:${customer.email}`}>{customer.email}</a></TableCell>
      <TableCell className="text-left align-top flex flex-col gap-3">
        
          <div className="flex flex-col gap-3">
            <h4 className="font-bold">Subscriptions</h4>
            {renderSubscriptionDetails(customer.subscriptions, customer.id)}
          </div>
        
        
          <div className="flex flex-col gap-3">
            <h4 className="font-bold">Charges</h4>
            {renderChargeDetails(customer.charges, customer.id)}
          </div>
        
      </TableCell>
      <TableCell className="text-center align-top">{customerSince}</TableCell>
      <TableCell className="text-right align-top">
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
