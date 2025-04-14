import { DataTable } from "@/components/ui/data-table";
import { useMemo, useState } from "react";
import { createColumns, Subscription as SubscriptionType } from "./columns";

export default function Subscriptions({ subscriptions }: { subscriptions: any[] }) {
  const [subscriptionsList, setSubscriptionsList] = useState(subscriptions);

  // When a subscription is deleted, we need to update the UI
  const handleSubscriptionDeleted = (id: string) => {
    setSubscriptionsList((prev) => prev.filter((sub) => sub.id !== id));
  };

  // Create columns with the delete handler
  const columns = useMemo(
    () => createColumns(handleSubscriptionDeleted),
    [
      /* No dependencies needed as handleSubscriptionDeleted is stable */
    ]
  );

  return (
    <div className="flex flex-col bg-slate-100 p-6">
      <h2 className="text-xl font-bold">My Subscriptions</h2>
      <div className="mt-5">
        <DataTable columns={columns} data={subscriptionsList as SubscriptionType[]} />
      </div>
    </div>
  );
}
