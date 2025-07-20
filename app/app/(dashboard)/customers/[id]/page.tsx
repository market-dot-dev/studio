"use server";

import { getCustomerOfVendor } from "@/app/services/organization/vendor-organization-service";
import { getCurrentOrganizationId } from "@/app/services/user-context-service";
import PageHeader from "@/components/common/page-header";
import ChargeCard from "@/components/customer/charge-card";
import SubscriptionCard from "@/components/customer/subscription-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail, Send, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CustomerDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const customerId = params.id;
  const currentOrgId = await getCurrentOrganizationId();

  if (!currentOrgId || !customerId) {
    return notFound();
  }

  const customerProfile = await getCustomerOfVendor(customerId, currentOrgId);

  if (!customerProfile) {
    return notFound();
  }

  // Access user information from the customer profile
  const user = customerProfile.user;

  return (
    <div className="flex max-w-screen-xl flex-col space-y-9">
      <div className="flex flex-col gap-7">
        <PageHeader
          title={user.name || "Customer"}
          description={user.email || customerId}
          backLink={{
            href: "/customers",
            title: "Customers"
          }}
          actions={[
            user.email && (
              <Button key="contact" variant="outline" asChild>
                <Link href={`mailto:${user.email}`}>
                  <Send />
                  Contact
                </Link>
              </Button>
            )
          ].filter(Boolean)}
        />

        <div className="flex flex-row flex-wrap gap-x-12 gap-y-4 text-sm">
          {/* Customer Name */}
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 whitespace-nowrap text-xxs/4 font-semibold uppercase tracking-wide text-stone-500">
              <User size={12} strokeWidth={2.5} />
              Customer
            </span>
            <div className="flex items-center">
              <span className="font-medium">{user.name || "—"}</span>
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 whitespace-nowrap text-xxs/4 font-semibold uppercase tracking-wide text-stone-500">
              <Mail size={12} strokeWidth={2.5} />
              Email
            </span>
            <div className="flex items-center">
              {user.email ? (
                <Link href={`mailto:${user.email}`} className="font-medium hover:underline">
                  {user.email}
                </Link>
              ) : (
                <span>—</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-10 xl:grid-cols-2">
        <div className="flex w-full flex-col gap-4">
          <h2 className="text-xl font-bold">Subscriptions</h2>
          {customerProfile.subscriptions.map((subscription) => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
              isCustomerView={false}
            />
          ))}
          {customerProfile.subscriptions.length === 0 && (
            <p className="text-stone-500">No subscriptions found.</p>
          )}
        </div>

        <div className="flex w-full flex-col gap-4">
          <h2 className="text-xl font-bold">Charges</h2>
          {customerProfile.charges.map((charge) => (
            <ChargeCard key={charge.id} charge={charge} isCustomerView={false} />
          ))}
          {customerProfile.charges.length === 0 && (
            <p className="text-stone-500">No charges found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
