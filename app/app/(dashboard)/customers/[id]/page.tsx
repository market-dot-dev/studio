// CustomerDetailPage.tsx
"use server";

import PageHeader from "@/components/common/page-header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import UserService from "@/app/services/UserService";
import { Send, User, Building, Github, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import SubscriptionCard from "@/components/customer/subscription-card";
import ChargeCard from "@/components/customer/charge-card";
import Subscription from "@/app/models/Subscription";

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

  // Convert raw subscription data to Subscription instances
  const subscriptions = customer.subscriptions.map(sub => new Subscription(sub));

  return (
    <div className="flex max-w-screen-xl flex-col space-y-9">
      <div className="flex flex-col gap-7">
        <PageHeader
          title={customer.name || "Customer Details"}
          description={customer.id}
          backLink={{
            href: "/customers",
            title: "Customers",
          }}
          actions={[
            <Button key="contact" variant="outline" asChild>
              <Link href={`mailto:${customer.email}`}>
                <Send />
                Contact
              </Link>
            </Button>,
          ]}
        />

        <div className="flex flex-row flex-wrap gap-x-10 gap-y-4 text-sm">
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 whitespace-nowrap text-xxs/4 font-semibold uppercase tracking-wide text-stone-500">
              <Building size={12} strokeWidth={2.5} />
              Company
            </span>
            <div className="flex items-center">
              <span className="font-medium">
                {customer.company || "(Unknown)"}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 whitespace-nowrap text-xxs/4 font-semibold uppercase tracking-wide text-stone-500">
              <Github size={12} strokeWidth={2.5} />
              Github
            </span>
            <div className="flex items-center">
              <a
                href={`https://www.github.com/${customer.gh_username}`}
                className="font-medium hover:underline"
              >
                {customer.gh_username}
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 whitespace-nowrap text-xxs/4 font-semibold uppercase tracking-wide text-stone-500">
              <Mail size={12} strokeWidth={2.5} />
              Email
            </span>
            <div className="flex items-center">
              <Link
                href={`mailto:${customer.email}`}
                className="font-medium hover:underline"
              >
                {customer.email}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="flex w-full flex-col gap-4">
          <h2 className="text-xl font-semibold">Subscriptions</h2>
          {subscriptions.map((subscription) => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
              isCustomerView={false}
            />
          ))}
          {subscriptions.length === 0 && (
            <p className="text-stone-500">No subscriptions found.</p>
          )}
        </div>

        <div className="flex w-full flex-col gap-4">
          <h2 className="text-xl font-semibold">Charges</h2>
          {customer.charges.map((charge) => (
            <ChargeCard
              key={charge.id}
              charge={charge}
              isCustomerView={false}
            />
          ))}
          {customer.charges.length === 0 && (
            <p className="text-stone-500">No charges found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailPage;
