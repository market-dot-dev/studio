import { getCurrentVendorCustomers } from "@/app/services/organization/vendor-organization-service";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { CustomerBarChart } from "./customer-bar-chart";
import { RevenueLineChart } from "./revenue-line-chart";

type Customers = Awaited<ReturnType<typeof getCurrentVendorCustomers>>;

export default function DashboardCharts({ customers }: { customers: Customers }) {
  const getLastSixMonths = () => {
    const today = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push(d);
    }
    return months;
  };

  const getRenewalMonth = (createdAt: Date, cadence: string) => {
    const creationDate = new Date(createdAt);
    let renewalDate;

    if (cadence === "month") {
      renewalDate = new Date(creationDate.setMonth(creationDate.getMonth() + 1));
    } else if (cadence === "year") {
      renewalDate = new Date(creationDate.setFullYear(creationDate.getFullYear() + 1));
    }

    return renewalDate;
  };

  const processCustomers = (customers: Customers) => {
    const lastSixMonths = getLastSixMonths();
    const subscriptionCounts = {} as any;

    lastSixMonths.forEach((date) => {
      subscriptionCounts[date.getTime()] = {
        date: date.toLocaleString("default", { month: "short", year: "numeric" }),
        "New Subscriptions": 0,
        Cancellations: 0,
        Renewals: 0,
        "One-time Charges": 0
      };
    });

    customers.forEach((customer) => {
      customer.subscriptions.forEach((subscription) => {
        const createdDate = new Date(subscription.createdAt);
        const monthKey = lastSixMonths.find(
          (date) =>
            date.getMonth() === createdDate.getMonth() &&
            date.getFullYear() === createdDate.getFullYear()
        );

        if (monthKey) {
          subscriptionCounts[monthKey.getTime()]["New Subscriptions"]++;
        }

        if (subscription.cancelledAt) {
          const cancelledDate = new Date(subscription.cancelledAt);
          const cancelMonthKey = lastSixMonths.find(
            (date) =>
              date.getMonth() === cancelledDate.getMonth() &&
              date.getFullYear() === cancelledDate.getFullYear()
          );

          if (cancelMonthKey) {
            subscriptionCounts[cancelMonthKey.getTime()]["Cancellations"]++;
          }
        }

        if (!subscription.cancelledAt) {
          let renewalDate = getRenewalMonth(subscription.createdAt, subscription.tier.cadence);

          while (renewalDate && renewalDate <= new Date()) {
            const renewalMonthKey = lastSixMonths.find(
              (date) =>
                date.getMonth() === renewalDate!.getMonth() &&
                date.getFullYear() === renewalDate!.getFullYear()
            );

            if (renewalMonthKey) {
              subscriptionCounts[renewalMonthKey.getTime()]["Renewals"]++;
            }
            renewalDate = getRenewalMonth(renewalDate, subscription.tier.cadence);
          }
        }
      });

      customer.charges.forEach((charge) => {
        const chargeDate = new Date(charge.createdAt);
        const monthKey = lastSixMonths.find(
          (date) =>
            date.getMonth() === chargeDate.getMonth() &&
            date.getFullYear() === chargeDate.getFullYear()
        );

        if (monthKey) {
          subscriptionCounts[monthKey.getTime()]["One-time Charges"]++;
        }
      });
    });

    return Object.values(subscriptionCounts);
  };

  const processRevenueData = (customers: Customers) => {
    const lastSixMonths = getLastSixMonths();
    const revenueData = {} as any;

    lastSixMonths.forEach((date) => {
      revenueData[date.getTime()] = {
        date: date.toLocaleString("default", { month: "short", year: "numeric" }),
        "New Subscriptions": 0,
        Renewals: 0,
        "One-time Charges": 0
      };
    });

    customers.forEach((customer) => {
      customer.subscriptions.forEach((subscription) => {
        const createdDate = new Date(subscription.createdAt);
        const monthKey = lastSixMonths.find(
          (date) =>
            date.getMonth() === createdDate.getMonth() &&
            date.getFullYear() === createdDate.getFullYear()
        );

        if (monthKey) {
          revenueData[monthKey.getTime()]["New Subscriptions"] += subscription.tier.price;
        }

        // Calculate renewals, but stop at cancellation/expiry date if subscription is cancelled
        const cutoffDate = subscription.activeUntil || subscription.cancelledAt || null;
        let renewalDate = getRenewalMonth(subscription.createdAt, subscription.tier.cadence);

        while (renewalDate && renewalDate <= new Date()) {
          // Stop counting renewals after the cutoff date (if subscription was cancelled)
          if (cutoffDate && renewalDate > cutoffDate) {
            break;
          }

          const renewalMonthKey = lastSixMonths.find(
            (date) =>
              date.getMonth() === renewalDate!.getMonth() &&
              date.getFullYear() === renewalDate!.getFullYear()
          );

          if (renewalMonthKey) {
            revenueData[renewalMonthKey.getTime()]["Renewals"] += subscription.tier.price;
          }
          renewalDate = getRenewalMonth(renewalDate, subscription.tier.cadence);
        }
      });

      customer.charges.forEach((charge) => {
        const chargeDate = new Date(charge.createdAt);
        const monthKey = lastSixMonths.find(
          (date) =>
            date.getMonth() === chargeDate.getMonth() &&
            date.getFullYear() === chargeDate.getFullYear()
        );

        if (monthKey) {
          revenueData[monthKey.getTime()]["One-time Charges"] += charge.tier.price;
        }
      });
    });

    return Object.values(revenueData);
  };

  const generateDummyData = () => {
    const lastSixMonths = getLastSixMonths();
    const dummyCustomerTotals = [];
    const dummyRevenueData = [];

    for (let i = 0; i < 6; i++) {
      const date = lastSixMonths[i].toLocaleString("default", { month: "short", year: "numeric" });

      dummyCustomerTotals.push({
        date,
        "New Subscriptions": Math.floor(Math.random() * 10) + 5,
        Cancellations: Math.floor(Math.random() * 3),
        Renewals: Math.floor(Math.random() * 8) + 3,
        "One-time Charges": Math.floor(Math.random() * 5) + 1
      });

      dummyRevenueData.push({
        date,
        "New Subscriptions": Math.round((1000 + i * 200 + Math.random() * 300) / 10) * 10,
        Renewals: Math.round((1500 + i * 250 + Math.random() * 400) / 10) * 10,
        "One-time Charges": Math.round((500 + i * 100 + Math.random() * 200) / 10) * 10
      });
    }

    return { dummyCustomerTotals, dummyRevenueData };
  };

  const { dummyCustomerTotals, dummyRevenueData } = generateDummyData();
  const customerTotals = customers.length > 0 ? processCustomers(customers) : dummyCustomerTotals;
  const revenueData = customers.length > 0 ? processRevenueData(customers) : dummyRevenueData;

  const totalNewCustomers = customerTotals.reduce(
    (acc, cur: any) => acc + cur["New Subscriptions"] + cur["One-time Charges"],
    0
  ) as number;
  const totalRevenue = revenueData.reduce(
    (acc, cur: any) => acc + cur["New Subscriptions"] + cur["Renewals"] + cur["One-time Charges"],
    0
  );

  const highestCustChangesInAMonth = Math.max(
    ...customerTotals
      .map((total: any) => [
        total["New Subscriptions"],
        total["Cancellations"],
        total["Renewals"],
        total["One-time Charges"]
      ])
      .flat()
  );
  const highestRevenueItemInMonth = Math.max(
    ...revenueData
      .map((total: any) => [
        total["New Subscriptions"],
        total["Renewals"],
        total["One-time Charges"]
      ])
      .flat()
  );

  const isUsingDummyData = customers.length === 0;

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div className="flex items-end gap-2">
          <div className="text-xl font-bold">Reports</div>
          {isUsingDummyData && (
            <Badge variant="secondary" size="sm" className="mb-1">
              Sample Data
            </Badge>
          )}
        </div>
        <Link
          href="/reports"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "group gap-0.5 pr-1")}
        >
          View All
          <ChevronRight
            size={8}
            strokeWidth={1.5}
            className="inline-block transition-transform group-hover:translate-x-px"
          />
        </Link>
      </div>
      <div className="flex max-w-screen-xl flex-col space-y-4">
        <div className="grid gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>
                <span className="mr-2">New Customers</span>
                <span className="text-sm font-normal text-stone-500">Last 6 months</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-start space-x-3 truncate">
                <h3 className="text-3xl font-semibold leading-none tracking-tight">
                  {totalNewCustomers}
                </h3>
              </div>
              <CustomerBarChart
                customerTotals={customerTotals}
                highestCustChangesInAMonth={highestCustChangesInAMonth}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle>
                <span className="mr-2">Revenue</span>
                <span className="text-sm font-normal text-stone-500">Last 6 months</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-start space-x-3 truncate">
                <h3 className="text-3xl font-semibold leading-none tracking-tight">
                  ${`${totalRevenue}`}
                </h3>
              </div>

              <RevenueLineChart
                revenueData={revenueData}
                highestRevenueItemInMonth={highestRevenueItemInMonth}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
