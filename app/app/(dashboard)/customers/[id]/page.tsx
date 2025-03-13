// CustomerDetailPage.tsx
"use server";

import PageHeading from "@/components/common/page-heading";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import SubscriptionStatusBadge from "../subscription-state";
import UserService from "@/app/services/UserService";
import { formatCurrency, formatDate } from "@/lib/utils";
import CancelSubscriptionButton from "@/app/app/c/subscriptions/cancel-subscription-button";
import { 
  KeyValuePair, 
  customerOverviewColumns,
  subscriptionColumns,
  chargeColumns 
} from "./columns";
import { DataTable } from "@/components/ui/data-table";

const CustomerDetailPage = async ({ params }: { params: { id: string } }) => {
  const userId = params.id;
  const maintainerUserId = (await UserService.getCurrentSessionUser())?.id;

  if (!maintainerUserId || !userId) {
    return <div>Customer not found</div>;
  }

  const customer = await UserService.customerOfMaintainer(
    maintainerUserId,
    userId,
  );

  if (!customer) {
    return <div>Customer not found</div>;
  }

  // Prepare data for customer overview table
  const customerOverviewData = [
    { field: "ID", value: <pre>{customer.id}</pre> },
    { field: "Name", value: customer.name },
    { field: "Company", value: customer.company ? customer.company : "(Unknown)" },
    { field: "Github", value: (
      <a href={`https://www.github.com/${customer.gh_username}`} className="underline">
        {customer.gh_username}
      </a>
    )},
    { field: "Email", value: (
      <div className="flex items-center gap-4">
        <Link href={`mailto:${customer.email}`} className="underline">
          {customer.email}
        </Link>
        <Link
          href={`mailto:${customer.email}`}
          className={`ms-4 ${buttonVariants({ variant: "outline" })}`}
        >
          Contact
        </Link>
      </div>
    )}
  ];

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12">
      <div className="flex w-full justify-between">
        <div className="flex flex-col">
          <Link href="/customers" className="underline">
            ← All Customers
          </Link>
          <PageHeading
            title={customer.company || customer.name || "Customer Details"}
          />
        </div>
      </div>

      <Card className="p-6">
        <h2 className="mb-4 text-xl font-semibold">Customer Overview</h2>
        <DataTable columns={customerOverviewColumns} data={customerOverviewData} />

        <h2 className="mb-4 mt-8 text-xl font-semibold">Subscriptions</h2>
        {customer.subscriptions.map((subscription) => {
          // Prepare data for subscription table
          const subscriptionData = [
            { field: "Tier Name", value: `${subscription.tier.name}${subscription.tierVersionId ? ` (${subscription.tierVersionId})` : ""}` },
            { field: "Tier Price", value: `${formatCurrency(subscription.tier.price!)} (Monthly)` },
            { field: "Subscription Status", value: <SubscriptionStatusBadge subscription={subscription} /> },
            { field: "Subscription Date", value: formatDate(subscription.createdAt) },
            subscription.cancelledAt 
              ? { field: "Cancellation Date", value: formatDate(subscription.cancelledAt) }
              : { field: "Actions", value: <CancelSubscriptionButton subscriptionId={subscription.id} /> }
          ];

          return (
            <div key={subscription.id} className="mb-8">
              <DataTable columns={subscriptionColumns} data={subscriptionData} />
            </div>
          );
        })}

        <h2 className="mb-4 mt-8 text-xl font-semibold">Charges</h2>
        {customer.charges.map((charge) => {
          // Prepare data for charge table
          const chargeData = [
            { field: "Tier Name", value: charge.tier.name },
            { field: "Amount", value: formatCurrency(charge.tier.price!) },
            { field: "Charge Date", value: formatDate(charge.createdAt) }
          ];

          return (
            <div key={charge.id} className="mb-8">
              <DataTable columns={chargeColumns} data={chargeData} />
            </div>
          );
        })}
      </Card>
    </div>
  );
};

export default CustomerDetailPage;
