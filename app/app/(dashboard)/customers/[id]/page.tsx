"use server";

import { getCurrentOrganizationId } from "@/app/services/user-context-service";
import { getCustomerOfVendor } from "@/app/services/vendor-organization-service";
import PageHeader from "@/components/common/page-header";
import ChargeCard from "@/components/customer/charge-card";
import SubscriptionCard from "@/components/customer/subscription-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { Building, Mail, Send, Users } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CustomerDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const organizationId = params.id;
  const currentOrgId = await getCurrentOrganizationId();

  if (!currentOrgId || !organizationId) {
    return notFound();
  }

  const customerOrg = await getCustomerOfVendor(currentOrgId, organizationId);

  if (!customerOrg) {
    return notFound();
  }

  // Access owner information from the organization
  const owner = customerOrg.owner;

  return (
    <div className="flex max-w-screen-xl flex-col space-y-9">
      <div className="flex flex-col gap-7">
        <PageHeader
          title={customerOrg.name || "Customer Organization"}
          description={customerOrg.id}
          backLink={{
            href: "/customers",
            title: "Customers"
          }}
          actions={[
            <Button key="contact" variant="outline" asChild>
              <Link href={`mailto:${owner.email}`}>
                <Send />
                Contact
              </Link>
            </Button>
          ]}
        />

        <div className="flex flex-row flex-wrap gap-x-12 gap-y-4 text-sm">
          {/* Organization Owner */}
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 whitespace-nowrap text-xxs/4 font-semibold uppercase tracking-wide text-stone-500">
              <Users size={12} strokeWidth={2.5} />
              Owner
            </span>
            <div className="flex items-center">
              <span className="font-medium">{owner.name || "—"}</span>
            </div>
          </div>

          {/* Organization Name */}
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 whitespace-nowrap text-xxs/4 font-semibold uppercase tracking-wide text-stone-500">
              <Building size={12} strokeWidth={2.5} />
              Organization
            </span>
            <div className="flex items-center">
              <span className="font-medium">{customerOrg.name || "—"}</span>
            </div>
          </div>

          {/* GitHub (Now from owner) */}
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 whitespace-nowrap text-xxs/4 font-semibold uppercase tracking-wide text-stone-500">
              <SiGithub size={12} strokeWidth={2.5} />
              Github
            </span>
            <div className="flex items-center">
              {owner.gh_username ? (
                <Link
                  href={`https://www.github.com/${owner.gh_username}`}
                  className="font-medium hover:underline"
                  target="_blank"
                >
                  {owner.gh_username}
                </Link>
              ) : (
                <span>—</span>
              )}
            </div>
          </div>

          {/* Email (Now from owner) */}
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 whitespace-nowrap text-xxs/4 font-semibold uppercase tracking-wide text-stone-500">
              <Mail size={12} strokeWidth={2.5} />
              Email
            </span>
            <div className="flex items-center">
              {owner.email ? (
                <Link href={`mailto:${owner.email}`} className="font-medium hover:underline">
                  {owner.email}
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
          {customerOrg.subscriptions.map((subscription) => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
              isCustomerView={false}
            />
          ))}
          {customerOrg.subscriptions.length === 0 && (
            <p className="text-stone-500">No subscriptions found.</p>
          )}
        </div>

        <div className="flex w-full flex-col gap-4">
          <h2 className="text-xl font-bold">Charges</h2>
          {customerOrg.charges.map((charge) => (
            <ChargeCard key={charge.id} charge={charge} isCustomerView={false} />
          ))}
          {customerOrg.charges.length === 0 && <p className="text-stone-500">No charges found.</p>}
        </div>
      </div>
    </div>
  );
}
