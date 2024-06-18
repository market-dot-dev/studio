"use client";

import LinkButton from "@/components/common/link-button";
import { User } from "@prisma/client";
import { Table, TableBody, TableCell, TableRow } from "@tremor/react";
import Link from "next/link";

const CustomerOverview = ({ customer }: { customer: User; }) => (
  <div className="p-1">
    <h2 className="text-xl font-semibold mb-4">Customer Overview</h2>
    <Table className="mb-8">
      <TableBody>
        <TableRow>
          <TableCell className="py-2"><strong>ID</strong></TableCell>
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
  </div>
);

export default CustomerOverview;
