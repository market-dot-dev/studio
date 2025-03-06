import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableBody,
} from "@tremor/react";
import { Button, buttonVariants } from "@/components/ui/button";
import SubscriptionService from "@/app/services/SubscriptionService";
import { SubscriptionWithUser } from "@/app/models/Subscription";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import SessionService from "@/app/services/SessionService";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

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
      <div className="mt-4 flex max-w-screen-xl flex-col space-y-4">
        <Card>
          {latestSubscriptions.length === 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableHeaderCell className="text-right">
                    Company
                  </TableHeaderCell>
                  <TableHeaderCell className="text-right">Tier</TableHeaderCell>
                  <TableHeaderCell className="text-right">
                    Actions
                  </TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {exampleCustomers.map((customer, index) => (
                  <TableRow className="m-0 p-2" key={index}>
                    <TableCell className="m-0 p-2">{customer.name}</TableCell>
                    <TableCell className="m-0 p-2 text-right">
                      {customer.company}
                    </TableCell>
                    <TableCell className="m-0 p-2 text-right">
                      {customer.tier}
                    </TableCell>
                    <TableCell className="m-0 p-2 text-right">
                      <div className="flex flex-row justify-end gap-1">
                        <Button size="sm" variant="outline" disabled>
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Table className="">
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableHeaderCell className="text-right">
                    Company
                  </TableHeaderCell>
                  <TableHeaderCell className="text-right">Tier</TableHeaderCell>
                  <TableHeaderCell className="text-right">
                    Actions
                  </TableHeaderCell>
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
                            <Link
                              href={`/customers/${subscription.id}`}
                              className={buttonVariants({
                                variant: "default",
                                size: "sm",
                              })}
                            >
                              View
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    </>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </Card>

        <div className="grid justify-items-end">
          <Link
            href="/customers"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "group gap-0.5 pr-1",
            )}
          >
            All customers
            <ChevronRight
              size={10}
              className="inline-block transition-transform group-hover:translate-x-px"
            />
          </Link>
        </div>
      </div>
    </>
  );
}