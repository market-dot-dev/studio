// CustomerDetailPage.tsx
"use server";

import PageHeading from "@/components/common/page-heading";
import { Button, Table, TableBody, TableCell, TableRow, Textarea } from "@tremor/react";
import Link from "next/link";
import DashboardCard from "@/components/common/dashboard-card";
import LinkButton from "@/components/common/link-button";
import SubscriptionStatusBadge from "../subscription-state";
import UserService from "@/app/services/UserService";
import { formatCurrency, formatDate } from "@/lib/utils";
import CancelSubscriptionButton from "@/app/app/c/subscriptions/cancel-subscription-button";

const CustomerDetailPage = async ({ params }: { params: { id: string } }) => {
  const userId = params.id;
  const maintainerUserId = (await UserService.getCurrentSessionUser())?.id;

  if(!maintainerUserId || !userId) {
    return <div>Customer not found</div>;
  }

  const customer = await UserService.customerOfMaintainer(maintainerUserId, userId);

  if (!customer) {
    return <div>Customer not found</div>;
  }

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12">
      <div className="flex justify-between w-full">
        <div className="flex flex-col">
          <Link href="/customers" className="underline">← All Customers</Link>
          <PageHeading title={customer.company || customer.name || "Customer Details"} />
        </div>
      </div>

      <DashboardCard>
        <div className="p-1">
          <h2 className="text-xl font-semibold mb-4">Customer Overview</h2>
          <Table className="mb-8">
            <TableBody>
              <TableRow>
                <TableCell className="py-2 w-1/2 md:w-1/3"><strong>ID</strong></TableCell>
                <TableCell className="py-2"><pre>{customer.id}</pre></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-2"><strong>Name</strong></TableCell>
                <TableCell className="py-2">{customer.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-2"><strong>Company</strong></TableCell>
                <TableCell className="py-2">{customer.company ? customer.company : "(Unknown)"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-2"><strong>Github</strong></TableCell>
                <TableCell className="py-2">
                  <a href={`https://www.github.com/${customer.gh_username}`} className="underline">{customer.gh_username}</a>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-2"><strong>Email</strong></TableCell>
                <TableCell className="py-2">
                  <Link href={`mailto:${customer.email}`} className="underline">
                    {customer.email}
                  </Link>
                  <LinkButton href={`mailto:${customer.email}`} label="Contact" className="ms-4" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <h2 className="text-xl font-semibold mb-4 mt-8">Subscriptions</h2>
          {customer.subscriptions.map((subscription) => (
            <div key={subscription.id} className="mb-8">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="py-2 w-1/2 md:w-1/3"><strong>Tier Name</strong></TableCell>
                    <TableCell className="py-2">
                      {subscription.tier.name}
                      {subscription.tierVersionId ? ` (${subscription.tierVersionId})` : ""}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-2"><strong>Tier Price</strong></TableCell>
                    <TableCell className="py-2">
                      {formatCurrency(subscription.tier.price)} (Monthly)
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-2"><strong>Subscription Status</strong></TableCell>
                    <TableCell className="py-2"><SubscriptionStatusBadge subscription={subscription} /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-2"><strong>Subscription Date</strong></TableCell>
                    <TableCell className="py-2">{formatDate(subscription.createdAt)}</TableCell>
                  </TableRow>
                  {subscription.cancelledAt ? (
                    <TableRow>
                      <TableCell className="py-2"><strong>Cancellation Date</strong></TableCell>
                      <TableCell className="py-2">{formatDate(subscription.cancelledAt)}</TableCell>
                    </TableRow>
                  ) : (
                    <TableRow>
                      <TableCell className="py-2"><strong>Actions</strong></TableCell>
                      <TableCell className="py-2">
                        <CancelSubscriptionButton subscriptionId={subscription.id} />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          ))}

          <h2 className="text-xl font-semibold mb-4 mt-8">Charges</h2>
          {customer.charges.map((charge) => (
            <div key={charge.id} className="mb-8">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="py-2 w-1/2 md:w-1/3" ><strong>Tier Name</strong></TableCell>
                    <TableCell className="py-2">{charge.tier.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-2"><strong>Amount</strong></TableCell>
                    <TableCell className="py-2">{formatCurrency(charge.tier.price)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-2"><strong>Charge Date</strong></TableCell>
                    <TableCell className="py-2">{formatDate(charge.createdAt)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
};

export default CustomerDetailPage;