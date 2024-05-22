"use client";
import { useState, useEffect } from 'react';
import { User, Subscription, Charge } from '@prisma/client';
import { customersOfMaintainer } from '@/app/services/UserService';
import React from 'react';
import Tier from '@/app/models/Tier';
import useCurrentSession from '@/app/hooks/use-current-session';

const formatDate = (date: Date | string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return new Date(date).toLocaleDateString('en-US', options);
};

const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  };
  return amount.toLocaleString('en-US', options);
};

type CustomerWithChargesAndSubscriptions = User & {
  charges: (Charge & { tier: Tier })[];
  subscriptions: (Subscription & { tier: Tier })[];
};

type SubscriptionRowProps = {
  user: User;
  subscription: Subscription & { tier: Tier };
};

const SubscriptionRow = ({ user, subscription }: SubscriptionRowProps) => {
  const handleCancelSubscription = async () => {
    // Implement the logic to cancel the subscription
    console.log('Canceling subscription:', subscription.id);
  };

  const handleUpdateSubscription = async () => {
    // Implement the logic to update the subscription
    console.log('Updating subscription:', subscription.id);
  };

  return (
    <tr>
      <td>{user.name}</td>
      <td>{user.company || '-'}</td>
      <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
      <td>{subscription.tier.name}</td>
      <td>{subscription.state}</td>
      <td>{formatDate(subscription.createdAt)}</td>
      <td>
        <button onClick={() => { window.location.href = `/customers/${user.id}` }}>View</button>
      </td>
    </tr>
  );
};

type ChargeRowProps = {
  user: User;
  charge: Charge & { tier: Tier };
};

const ChargeRow = ({ user, charge }: ChargeRowProps) => {
  const handleRefundCharge = async () => {
    // Implement the logic to refund the charge
    console.log('Refunding charge:', charge.id);
  };

  return (
    <tr>
      <td>{user.name}</td>
      <td>{user.company || '-'}</td>
      <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
      <td>{charge.tier.name}</td>
      <td>Purchased</td>
      <td>{formatDate(charge.createdAt)}</td>
      <td>
        <button onClick={() => { window.location.href = `/customers/${user.id}` }}>View</button>
      </td>
    </tr>
  );
};

const CustomersPage = async () => {
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
    <div>
      <h1>Customers</h1>
      <table>
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Company</th>
            <th>Email</th>
            <th>Tier (Subscription or Purchase)</th>
            <th>Status</th>
            <th>Customer Since</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
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
        </tbody>
      </table>
    </div>
  );
};

export default CustomersPage;