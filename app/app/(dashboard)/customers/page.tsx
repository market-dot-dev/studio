import SubscriptionService from "@/app/services/SubscriptionService";
import LinkButton from "@/components/common/link-button";
import DashboardCard from "@/components/common/dashboard-card";
import PageHeading from "@/components/common/page-heading";
import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
} from "@tremor/react";
import SessionService from "@/app/services/SessionService";

export default async function CustomersList({
  params,
}: {
  params: { id: string };
}) {
  const currentUserId = await SessionService.getCurrentUserId();
  const subscriptions = await SubscriptionService.subscribedToUser(currentUserId!);

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12">
      <div className="flex w-full justify-between">
        <div className="flex flex-col">
          <PageHeading title="All Customers" />
          <Text>Manage your customers and their tiers here. </Text>
        </div>
      </div>

      <DashboardCard>
        <Table className="">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell className="text-right">Company</TableHeaderCell>
              <TableHeaderCell className="text-right">Tier</TableHeaderCell>
              <TableHeaderCell className="text-center">Status</TableHeaderCell>
              <TableHeaderCell className="text-center">
                Customer Since
              </TableHeaderCell>
              <TableHeaderCell className="text-right"></TableHeaderCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {subscriptions.map((subscription) => {
              const user = subscription.user;
              return (
                <>
                  <TableRow className="m-0 p-2" key={subscription.id}>
                    <TableCell className="m-0 p-2">{user.name}</TableCell>
                    <TableCell className="m-0 p-2 text-right">
                      {user.company}
                    </TableCell>
                    <TableCell className="m-0 p-2 text-right">
                      {subscription.tier!.name}
                    </TableCell>
                    <TableCell className="m-0 p-2 text-center">
                      {subscription.state === "renewing" ? 
                        <Badge color="green">Active</Badge> :
                        subscription.state === "cancelled" && subscription.activeUntil ?
                        <>
                          <Badge color="yellow">Cancelled</Badge>
                          <Text className="text-xs">Active Until {subscription.activeUntil?.toLocaleDateString()}</Text>
                        </>
                         : 
                        subscription.state === "cancelled" && !subscription.activeUntil ?
                        <Badge color="red">Cancelled</Badge> : ""
                      }
                    </TableCell>
                    <TableCell className="m-0 p-2 text-center">
                      {new Date(subscription.createdAt).toLocaleDateString()}
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
