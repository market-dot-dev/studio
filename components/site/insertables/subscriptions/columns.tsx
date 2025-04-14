"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

// This type is used to define the shape of our data.
export type Subscription = {
  id: string;
  tierVersion: {
    tier: {
      name: string;
    };
  };
};

// Proper React component for the action cell
const ActionCell = ({
  subscription,
  onDelete
}: {
  subscription: Subscription;
  onDelete?: (id: string) => void;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await fetch("/api/subscription", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          subscriptionId: subscription.id
        })
      });

      // Call the onDelete callback if provided
      if (onDelete) {
        onDelete(subscription.id);
      }
    } catch (error) {
      console.error("Error deleting subscription:", error);
    }
    setIsDeleting(false);
  };

  return (
    <Button onClick={handleDelete} disabled={isDeleting}>
      {isDeleting ? "Cancelling..." : "Cancel"}
    </Button>
  );
};

// Factory function to create columns with an onDelete callback
export const createColumns = (onDelete?: (id: string) => void): ColumnDef<Subscription>[] => [
  {
    accessorKey: "tierVersion.tier.name",
    header: "Tier"
  },
  {
    id: "actions",
    header: "Action",
    cell: function Cell({ row }) {
      const subscription = row.original;
      return <ActionCell subscription={subscription} onDelete={onDelete} />;
    }
  }
];

// Default columns without the onDelete handler
export const columns = createColumns();
