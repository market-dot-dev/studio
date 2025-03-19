"use client";

import { User } from "@prisma/client";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

const CustomerOverview = ({ customer }: { customer: User; }) => (
  <div className="p-1">
    <h2 className="text-xl font-semibold mb-4">Customer Overview</h2>
    <DataTable columns={columns} data={[customer]} />
  </div>
);

export default CustomerOverview;
