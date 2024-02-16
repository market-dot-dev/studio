import SubscriptionService, {
  SubscriptionWithUser,
} from "@/app/services/SubscriptionService";
import LinkButton from "@/components/common/link-button";
import UserService from "@/app/services/UserService";
import DashboardCard from "@/components/common/dashboard-card";
import PageHeading from "@/components/common/page-heading";
import {
  BadgeDelta,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
} from "@tremor/react";

export default async function CustomersList({
  params,
}: {
  params: { id: string };
}) {
  const currentUserId = await UserService.getCurrentUserId();
  const subscriptions: SubscriptionWithUser[] =
    await SubscriptionService.subscribedToUser(currentUserId!);

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12">
      <div className="flex w-full justify-between">
        <div className="flex flex-col">
          <PageHeading title="All Customers" />
          <Text>Manage your customers and their tiers here. </Text>
        </div>
        {/* <div className="flex flex-row gap-1">
            <LinkButton href="/customers/new" label="New Customer" />
          </div> */}
      </div>

      <DashboardCard>
        <Table className="">
          <TableHead>
            <TableRow>
              <TableHeaderCell>ID</TableHeaderCell>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell className="text-right">Company</TableHeaderCell>
              <TableHeaderCell className="text-right">Tier</TableHeaderCell>
              <TableHeaderCell className="text-right">Status</TableHeaderCell>
              <TableHeaderCell className="text-right">
                Customer Since
              </TableHeaderCell>
              <TableHeaderCell className="text-right">
                Next Renewal
              </TableHeaderCell>
              <TableHeaderCell className="text-right">Location</TableHeaderCell>
              <TableHeaderCell className="text-right">Actions</TableHeaderCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {subscriptions.map((subscription) => {
              const user = subscription.user;
              return (
                <>
                  <TableRow className="m-0 p-2" key={subscription.id}>
                    <TableCell className="m-0 p-2">{user.id}</TableCell>
                    <TableCell className="m-0 p-2">{user.name}</TableCell>
                    <TableCell className="m-0 p-2 text-right">
                      {user.company}
                    </TableCell>
                    <TableCell className="m-0 p-2 text-right">
                      {subscription.tier!.name}
                    </TableCell>
                    <TableCell className="m-0 p-2 text-right">
                      <BadgeDelta size="xs"></BadgeDelta>
                    </TableCell>
                    <TableCell className="m-0 p-2 text-right">
                      {new Date(subscription.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="m-0 p-2 text-right">
                      {/* Next Renewal */}
                    </TableCell>
                    <TableCell className="m-0 p-2 text-right">
                      {/* Location */}
                    </TableCell>
                    <TableCell className="m-0 p-2 text-right">
                      <div className="flex flex-row justify-end gap-1">
                        <LinkButton
                          label="View"
                          href={`/customers/${subscription.id}`}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                </>
              );
            })}
          </TableBody>
        </Table>
      </DashboardCard>
    </div>
  );
}
