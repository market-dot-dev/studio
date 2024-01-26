import TierService from "@/app/services/TierService";
import UserService from "@/app/services/UserService";
import PageHeading from "@/components/common/page-heading";
import { Subscription } from "@prisma/client";
import { Card, Button } from "@tremor/react";
import { Github } from "lucide-react";
import DashboardCard from "@/components/common/dashboard-card";
import LinkButton from "@/components/common/link-button";

export default async function SubscriptionsList({ params }: { params: { id: string } }) {

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <PageHeading title="Details" />


        <DashboardCard>
            Contact
        </DashboardCard>

        <DashboardCard>
            Package Details
        </DashboardCard>

        <DashboardCard>
            Manage
        </DashboardCard>

      </div>
    </div>
  );
}