
"use server";

import PageHeading from "@/components/common/page-heading";
import {
  Button,
  Table, TableBody, TableCell, TableRow, 
  Textarea,
} from "@tremor/react";

import DashboardCard from "@/components/common/dashboard-card";
import SubscriptionService from "@/app/services/SubscriptionService";
import LinkButton from "@/components/common/link-button";

const CustomerDetailPage = async ({ params }: { params: { id: string } }) => {
  const subscription = await SubscriptionService.findSubscription(params.id);
  const customer = subscription?.user;
  const tier = subscription?.tier;

  if(!subscription || !customer || !tier) {
    return <div>Customer not found</div>;
  }

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12">
      <div className="flex justify-between w-full">
        <div className="flex flex-row">
          <PageHeading title={customer.company || customer.name || "Customer Details"} />
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
                    <TableCell className="py-2"><a href={"https://www.github.com/"+customer.gh_username} className="underline">{customer.gh_username}</a></TableCell>
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
                    <TableCell className="py-2">
                      {tier.name}
                      { subscription.tierVersionId ? `(${subscription.tierVersionId})` : "" }
                    <LinkButton href={`/tiers/${tier.id}`} label="Edit Package" className="ms-8" />
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="py-2"><strong>Status</strong></TableCell>
                    <TableCell className="py-2">{/*customer.status*/}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="py-2"><strong>Customer Since</strong></TableCell>
                    <TableCell className="py-2">{/*customer.dateSince*/}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="py-2"><strong>Next Renewal Date</strong></TableCell>
                    <TableCell className="py-2">{/*customer.nextRenewal*/}</TableCell>
                </TableRow>
            </TableBody>
        </Table>

          <h2 className="text-xl font-semibold mb-4 mt-8">Notes</h2>
          <Textarea value={'' /*customer.notes*/} className="mb-4" />
          <Button variant="primary" size="xs">Save</Button>
        </div>
      </DashboardCard>

    </div>
  );
}

export default CustomerDetailPage;