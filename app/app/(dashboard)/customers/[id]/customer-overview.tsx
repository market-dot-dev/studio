"use client";

import { DataTable } from "@/components/ui/data-table";
import { User } from "@prisma/client";
import { columns } from "./columns";

const CustomerOverview = ({ customer }: { customer: User }) => (
  <div className="p-1">
    <h2 className="mb-4 text-xl font-semibold">Customer Overview</h2>
    <DataTable columns={columns} data={[customer]} />
  </div>
);

export default CustomerOverview;
