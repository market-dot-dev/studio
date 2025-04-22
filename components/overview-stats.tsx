"use client";
import { type CustomerWithChargesAndSubscriptions } from "@/app/app/(dashboard)/customers/customer-table";
import { LineChartCard } from "./charts/LineChartCard";

const labels = {
  newSubscriptions: "Subscriptions",
  cancellations: "Cancellations",
  renewals: "Renewals",
  oneTimeCharges: "Charges",
  activeSubscriptions: "Subscriptions",
  newSubscriptionsRevenue: "Revenue",
  renewedSubscriptionsRevenue: "Revenue",
  oneTimeChargesRevenue: "Revenue",
  monthlyRecurringRevenue: "Revenue",
  orders: "Orders",
  averageOrderValue: "Average Order Value"
} as any;

const categoryColorMap = {
  newSubscriptions: "hsl(var(--chart-1))",
  newSubscriptionsRevenue: "hsl(var(--chart-2))",
  renewals: "hsl(var(--chart-3))",
  renewedSubscriptionsRevenue: "hsl(var(--chart-4))",
  activeSubscriptions: "hsl(var(--chart-5))",
  monthlyRecurringRevenue: "hsl(var(--chart-1))",
  oneTimeCharges: "hsl(var(--chart-2))",
  oneTimeChargesRevenue: "hsl(var(--chart-3))",
  orders: "hsl(var(--chart-4))",
  averageOrderValue: "hsl(var(--chart-5))",
  cancellations: "hsl(var(--chart-1))"
};

export function DashboardCharts({
  customers
}: {
  customers: CustomerWithChargesAndSubscriptions[];
}) {
  const getLastSixMonths = () => {
    const today = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push(d);
    }
    return months;
  };

  const getRenewalDate = (createdAt: Date, cadence: string) => {
    const creationDate = new Date(createdAt);
    let renewalDate;

    if (cadence === "month") {
      renewalDate = new Date(creationDate.setMonth(creationDate.getMonth() + 1));
    } else if (cadence === "year") {
      renewalDate = new Date(creationDate.setFullYear(creationDate.getFullYear() + 1));
    }

    return renewalDate;
  };

  const processCustomers = (customers: CustomerWithChargesAndSubscriptions[]) => {
    const lastSixMonths = getLastSixMonths();
    const data = {
      newSubscriptions: [] as any[],
      cancellations: [] as any[],
      renewals: [] as any[],
      oneTimeCharges: [] as any[],
      activeSubscriptions: [] as any[],
      newSubscriptionsRevenue: [] as any[],
      renewedSubscriptionsRevenue: [] as any[],
      oneTimeChargesRevenue: [] as any[],
      monthlyRecurringRevenue: [] as any[],
      orders: [] as any[],
      averageOrderValue: [] as any[]
    } as any;

    lastSixMonths.forEach((date) => {
      const monthLabel = date.toLocaleString("default", { month: "short", year: "numeric" });
      Object.keys(data).forEach((key) => {
        data[key].push({ date: monthLabel, [labels[key]]: 0 });
      });
    });

    customers.forEach((customer) => {
      customer.subscriptions.forEach((subscription) => {
        const createdDate = new Date(subscription.createdAt);
        const price = subscription.tier.price;

        const createdMonthIndex = lastSixMonths.findIndex(
          (date) =>
            date.getMonth() === createdDate.getMonth() &&
            date.getFullYear() === createdDate.getFullYear()
        );

        if (createdMonthIndex !== -1) {
          data.newSubscriptions[createdMonthIndex][labels["newSubscriptions"]]++;
          data.newSubscriptionsRevenue[createdMonthIndex][labels["newSubscriptionsRevenue"]] +=
            price;
          data.activeSubscriptions[createdMonthIndex][labels["activeSubscriptions"]]++;
        }

        if (subscription.cancelledAt) {
          const cancelledDate = new Date(subscription.cancelledAt);
          const cancelledMonthIndex = lastSixMonths.findIndex(
            (date) =>
              date.getMonth() === cancelledDate.getMonth() &&
              date.getFullYear() === cancelledDate.getFullYear()
          );

          if (cancelledMonthIndex !== -1) {
            data.cancellations[cancelledMonthIndex][labels["cancellations"]]++;
          }
        } else {
          let renewalDate = getRenewalDate(subscription.createdAt, subscription.tier.cadence);

          while (renewalDate && renewalDate <= new Date()) {
            const renewalMonthIndex = lastSixMonths.findIndex(
              (date) =>
                date.getMonth() === renewalDate!.getMonth() &&
                date.getFullYear() === renewalDate!.getFullYear()
            );

            if (renewalMonthIndex !== -1) {
              data.renewals[renewalMonthIndex][labels["renewals"]]++;
              data.renewedSubscriptionsRevenue[renewalMonthIndex][
                labels["renewedSubscriptionsRevenue"]
              ] += price;
              data.monthlyRecurringRevenue[renewalMonthIndex][labels["monthlyRecurringRevenue"]] +=
                price;
            }
            renewalDate = getRenewalDate(renewalDate, subscription.tier.cadence);
          }
        }
      });

      customer.charges.forEach((charge) => {
        const chargeDate = new Date(charge.createdAt);
        const price = charge.tier.price;

        const chargeMonthIndex = lastSixMonths.findIndex(
          (date) =>
            date.getMonth() === chargeDate.getMonth() &&
            date.getFullYear() === chargeDate.getFullYear()
        );

        if (chargeMonthIndex !== -1) {
          data.oneTimeCharges[chargeMonthIndex][labels["oneTimeCharges"]]++;
          data.oneTimeChargesRevenue[chargeMonthIndex][labels["oneTimeChargesRevenue"]] += price;
          data.orders[chargeMonthIndex][labels["orders"]]++;

          // Calculate average order value for the specific month
          if (data.orders[chargeMonthIndex][labels["orders"]] > 0) {
            data.averageOrderValue[chargeMonthIndex][labels["averageOrderValue"]] =
              data.oneTimeChargesRevenue[chargeMonthIndex][labels["oneTimeChargesRevenue"]] /
              data.orders[chargeMonthIndex][labels["orders"]];
          }
        }
      });
    });

    return data;
  };

  const data = processCustomers(customers);

  // Custom value formatter for currency values
  const currencyFormatter = (value: number) =>
    `$${value.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })}`;

  return (
    <>
      <div className="mt-4 flex max-w-screen-xl flex-col space-y-4">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <LineChartCard
            title="New Subscriptions"
            data={data.newSubscriptions}
            categories={[labels.newSubscriptions]}
            colors={[categoryColorMap.newSubscriptions]}
          />

          <LineChartCard
            title="New Subscriptions Revenue"
            data={data.newSubscriptionsRevenue}
            categories={[labels.newSubscriptionsRevenue]}
            colors={[categoryColorMap.newSubscriptionsRevenue]}
            valueFormatter={currencyFormatter}
          />

          <LineChartCard
            title="Renewed Subscriptions"
            data={data.renewals}
            categories={[labels.renewals]}
            colors={[categoryColorMap.renewals]}
          />

          <LineChartCard
            title="Renewed Subscriptions Revenue"
            data={data.renewedSubscriptionsRevenue}
            categories={[labels.renewedSubscriptionsRevenue]}
            colors={[categoryColorMap.renewedSubscriptionsRevenue]}
            valueFormatter={currencyFormatter}
          />

          <LineChartCard
            title="Active Subscriptions"
            data={data.activeSubscriptions}
            categories={[labels.activeSubscriptions]}
            colors={[categoryColorMap.activeSubscriptions]}
          />

          <LineChartCard
            title="Monthly Recurring Revenue"
            data={data.monthlyRecurringRevenue}
            categories={[labels.monthlyRecurringRevenue]}
            colors={[categoryColorMap.monthlyRecurringRevenue]}
            valueFormatter={currencyFormatter}
          />

          <LineChartCard
            title="One-time Charges"
            data={data.oneTimeCharges}
            categories={[labels.oneTimeCharges]}
            colors={[categoryColorMap.oneTimeCharges]}
          />

          <LineChartCard
            title="One-time Charges Revenue"
            data={data.oneTimeChargesRevenue}
            categories={[labels.oneTimeChargesRevenue]}
            colors={[categoryColorMap.oneTimeChargesRevenue]}
            valueFormatter={currencyFormatter}
          />

          <LineChartCard
            title="Orders"
            data={data.orders}
            categories={[labels.orders]}
            colors={[categoryColorMap.orders]}
          />

          <LineChartCard
            title="Average Order Value"
            data={data.averageOrderValue}
            categories={[labels.averageOrderValue]}
            colors={[categoryColorMap.averageOrderValue]}
            valueFormatter={currencyFormatter}
          />

          <LineChartCard
            title="Cancellations"
            data={data.cancellations}
            categories={[labels.cancellations]}
            colors={[categoryColorMap.cancellations]}
          />
        </div>
      </div>
    </>
  );
}
