import PageHeading from "@/components/common/page-heading";
import {
  Button,
  Grid,
  Text,
  Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, 
  Textarea,
} from "@tremor/react";

import DashboardCard from "@/components/common/dashboard-card";
import LinkButton from "@/components/common/link-button";

const customerDetails = [
    {
      id: "ID-1",
      name: "Peter Doe",
      email: "peter.doe@acme.inc",
      tier: "Premium",
      github: "peterdoecodes",
      tierVersion: "v1",
      status: "Active",
      dateSince: "01/15/2023",
      nextRenewal: "02/15/2024",
      location: "New York",
      company: "Acme Inc.",
      notes: "Building a really cool AI assistant product, using our web framework for their dashboard.",
    },
  ];

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
    const customer = customerDetails[0];

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex justify-between w-full">
        <div className="flex flex-row">
          <PageHeading title="Acme Inc." />
        </div>
      </div>



      <DashboardCard>
        <div className="p-1">
          <h2 className="text-xl font-semibold mb-4">Customer Overview</h2>
        <Table className="mb-8">
            <TableBody>
                <TableRow>
                    <TableCell className="py-2"><strong>ID</strong></TableCell>
                    <TableCell className="py-2">{customer.id}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="py-2"><strong>Name</strong></TableCell>
                    <TableCell className="py-2">{customer.name}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="py-2"><strong>Company</strong></TableCell>
                    <TableCell className="py-2">{customer.company}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="py-2"><strong>Github</strong></TableCell>
                    <TableCell className="py-2"><a href={"https://www.github.com/"+customer.github} className="underline">{customer.github}</a></TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="py-2"><strong>Email</strong></TableCell>
                    <TableCell className="py-2">{customer.email} <Button variant="secondary" size="xs" className="ms-8">Contact Customer</Button></TableCell>
                </TableRow>
            </TableBody>
        </Table>

        <h2 className="text-xl font-semibold mb-4 mt-8">Current Package</h2>
        <Table className="mb-8">
            <TableBody>
                <TableRow>
                    <TableCell className="py-2"><strong>Current Tier</strong></TableCell>
                    <TableCell className="py-2">{customer.tier} ({customer.tierVersion})
                    <Button variant="secondary" size="xs" className="ms-8">Edit Package</Button>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="py-2"><strong>Status</strong></TableCell>
                    <TableCell className="py-2">{customer.status}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="py-2"><strong>Customer Since</strong></TableCell>
                    <TableCell className="py-2">{customer.dateSince}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="py-2"><strong>Next Renewal Date</strong></TableCell>
                    <TableCell className="py-2">{customer.nextRenewal}</TableCell>
                </TableRow>
            </TableBody>
        </Table>

          <h2 className="text-xl font-semibold mb-4 mt-8">Notes</h2>
          <Textarea value={customer.notes} className="mb-4" />
          <Button variant="primary" size="xs">Save</Button>
        </div>
      </DashboardCard>

    </div>
  );
}