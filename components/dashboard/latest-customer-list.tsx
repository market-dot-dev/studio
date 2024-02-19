import PageHeading from "@/components/common/page-heading";
import {
  Button,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableBody,
  BadgeDelta,
  Bold,
  Badge,
} from "@tremor/react";
import SubscriptionService, {
  SubscriptionWithUser,
} from "@/app/services/SubscriptionService";
import UserService from "@/app/services/UserService";
import DashboardCard from "@/components/common/dashboard-card";
import TierService from "@/app/services/TierService";
import PrimaryLinkButton from "../common/link-button";
import Link from "next/link";
import LinkButton from "../common/link-button";

export default async function LatestCustomersList(props: { numRecords?: number, previewMode?: boolean }) {

  // Number of records to show (optional)
  const numRecords = props.numRecords || 3;

  // In preview mode, only a few columns are shown
  const previewMode = props.previewMode || true;

  // Number of days to look back for new customers
  const daysAgo = 30;

  const currentUserId = await UserService.getCurrentUserId();
  const subscriptions: SubscriptionWithUser[] =
    await SubscriptionService.subscribedToUser(currentUserId!);

  // Sort subscriptions based on created date in descending order
  subscriptions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // Get the latest 5 subscriptions
  const latestSubscriptions = subscriptions.slice(0, numRecords);

    

  return (
    <>
      <DashboardCard>
        <Table className="">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell className="text-right">Company</TableHeaderCell>
              <TableHeaderCell className="text-right">Tier</TableHeaderCell>
              <TableHeaderCell className="text-right">Actions</TableHeaderCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {latestSubscriptions.map((subscription) => {
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

      <div className="grid justify-items-end">
        <Link href='/customers'>
          <Button size="xs" className="h-6" variant="secondary">
            All Customers →
          </Button>
        </Link>
      </div>
    </>
  );
}