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
import SubscriptionService from "@/app/services/SubscriptionService";
import { SubscriptionWithUser } from "@/app/models/Subscription";
import { Card } from "@/components/ui/card";
import TierService from "@/app/services/TierService";
import PrimaryLinkButton from "../common/link-button";
import Link from "next/link";
import LinkButton from "../common/link-button";
import SessionService from "@/app/services/SessionService";

export default async function LatestCustomersList(props: { numRecords?: number, previewMode?: boolean }) {

  // Number of records to show (optional)
  const numRecords = props.numRecords || 3;

  // In preview mode, only a few columns are shown
  const previewMode = props.previewMode || true;

  // Number of days to look back for new customers
  const daysAgo = 30;

  const currentUserId = await SessionService.getCurrentUserId();
  const subscriptions: SubscriptionWithUser[] =
    await SubscriptionService.subscribedToUser(currentUserId!);

  // Sort subscriptions based on created date in descending order
  subscriptions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // Get the latest 5 subscriptions
  const latestSubscriptions = subscriptions.slice(0, numRecords);

  interface CustomerRow {
    name: string;
    company: string;
    tier: string;
  }

  // Example customer data could eventually come from a data source
  const exampleCustomers: CustomerRow[] = [
    { name: 'John Appleseed (Example Customer)', company: 'Acme Inc.', tier: 'Premium Tier' },
    { name: 'Joan Lisgar (Example Customer)', company: 'Megacorp Inc.', tier: 'Enterprise Tier' },
  ];

  return (
    <>
      <div className="flex max-w-screen-xl flex-col mt-4 space-y-4">

        <Card>
          {latestSubscriptions.length === 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableHeaderCell className="text-right">Company</TableHeaderCell>
                  <TableHeaderCell className="text-right">Tier</TableHeaderCell>
                  <TableHeaderCell className="text-right">Actions</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {exampleCustomers.map((customer, index) => (
                  <TableRow className="m-0 p-2" key={index}>
                    <TableCell className="m-0 p-2">{customer.name}</TableCell>
                    <TableCell className="m-0 p-2 text-right">{customer.company}</TableCell>
                    <TableCell className="m-0 p-2 text-right">{customer.tier}</TableCell>
                    <TableCell className="m-0 p-2 text-right">
                      <div className="flex flex-row justify-end gap-1">
                        <Button className="py-1" disabled>View</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>) :
            (<Table className="">
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
            </Table>)}
        </Card>

        <div className="grid justify-items-end">
          <Link href='/customers'>
            <Button size="xs" className="h-6" variant="secondary">
              All Customers →
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}