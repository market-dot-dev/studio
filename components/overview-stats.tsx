import { Card, Text, LineChart } from "@tremor/react";
import { CustomerWithChargesAndSubscriptions } from "@/app/app/(dashboard)/customers/customer-table";


const labels = {
  newSubscriptions: 'Subscriptions',
  cancellations: 'Cancellations',
  renewals: 'Renewals',
  oneTimeCharges: 'Charges',
  activeSubscriptions: 'Subscriptions',
  newSubscriptionsRevenue: 'Revenue',
  renewedSubscriptionsRevenue: 'Revenue',
  oneTimeChargesRevenue: 'Revenue',
  monthlyRecurringRevenue: 'Revenue',
  orders: 'Orders',
  averageOrderValue: 'Average Order Value',
  
} as any;

export default function DashboardCharts({ customers }: { customers: CustomerWithChargesAndSubscriptions[] }) {

  const getRenewalMonth = (createdAt: Date, cadence: string) => {
    const creationDate = new Date(createdAt);
    let renewalDate;

    if (cadence === 'month') {
      renewalDate = new Date(creationDate.setMonth(creationDate.getMonth() + 1));
    } else if (cadence === 'year') {
      renewalDate = new Date(creationDate.setFullYear(creationDate.getFullYear() + 1));
    }

    return renewalDate?.getMonth();
  };

  const processCustomers = (customers: CustomerWithChargesAndSubscriptions[]) => {
    const currentYear = new Date().getFullYear();
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
      averageOrderValue: [] as any[],
    };
  
    for (let i = 0; i < 12; i++) {
      const monthLabel = new Date(currentYear, i).toLocaleString('default', { month: 'short', year: 'numeric' });
      data.newSubscriptions.push({ date: monthLabel, [labels['newSubscriptions']]: 0 });
      data.cancellations.push({ date: monthLabel, [labels['cancellations']]: 0 });
      data.renewals.push({ date: monthLabel, [labels['renewals']]: 0 });
      data.oneTimeCharges.push({ date: monthLabel, [labels['oneTimeCharges']]: 0 });
      data.activeSubscriptions.push({ date: monthLabel, [labels['activeSubscriptions']]: 0 });
      data.newSubscriptionsRevenue.push({ date: monthLabel, [labels['newSubscriptionsRevenue']]: 0 });
      data.renewedSubscriptionsRevenue.push({ date: monthLabel, [labels['renewedSubscriptionsRevenue']]: 0 });
      data.oneTimeChargesRevenue.push({ date: monthLabel, [labels['oneTimeChargesRevenue']]: 0 });
      data.monthlyRecurringRevenue.push({ date: monthLabel, [labels['monthlyRecurringRevenue']]: 0 });
      data.orders.push({ date: monthLabel, [labels['orders']]: 0 });
      data.averageOrderValue.push({ date: monthLabel, [labels['averageOrderValue']]: 0 });
    }
  
    customers.forEach(customer => {
      customer.subscriptions.forEach(subscription => {
        const createdMonth = new Date(subscription.createdAt).getMonth();
        const price = subscription.tier.price;
  
        data.newSubscriptions[createdMonth][labels['newSubscriptions']]++;
        data.newSubscriptionsRevenue[createdMonth][labels['newSubscriptionsRevenue']] += price;
  
        if (subscription.cancelledAt) {
          const cancelledMonth = new Date(subscription.cancelledAt).getMonth();
          data.cancellations[cancelledMonth][labels['cancellations']]++;
        } else {
          let renewalMonth = getRenewalMonth(subscription.createdAt, subscription.tier.cadence);
          
          while (renewalMonth !== undefined && renewalMonth <= new Date().getMonth()) {
            data.renewals[renewalMonth][labels['renewals']]++;
            data.renewedSubscriptionsRevenue[renewalMonth][labels['renewedSubscriptionsRevenue']] += price;
            data.monthlyRecurringRevenue[renewalMonth][labels['monthlyRecurringRevenue']] += price;
            const renewalDate = new Date(subscription.createdAt);
            renewalDate.setMonth(renewalMonth);
            renewalMonth = getRenewalMonth(renewalDate, subscription.tier.cadence);
          }
  
          data.activeSubscriptions[createdMonth][labels['activeSubscriptions']]++;
        }
      });
  
      customer.charges.forEach(charge => {
        const month = new Date(charge.createdAt).getMonth();
        const price = charge.tier.price;
  
        data.oneTimeCharges[month][labels['oneTimeCharges']]++;
        data.oneTimeChargesRevenue[month][labels['oneTimeChargesRevenue']] += price;
        data.orders[month][labels['orders']]++;
  
        // Calculate average order value for the specific month
        if (data.orders[month][labels['orders']] > 0) {
          data.averageOrderValue[month][labels['averageOrderValue']] =
            data.oneTimeChargesRevenue[month][labels['oneTimeChargesRevenue']] /
            data.orders[month][labels['orders']];
        }
      });
    });
  
    return data;
  };
  
  

  const data = processCustomers(customers);

  const renderChart = (title: string, data: any[], category: string, color: string) => {
    
    return (
    <Card>
      <div className="flex flex-row justify-between">
        <Text>{title}</Text>
      </div>
      <LineChart
        className="h-72 mt-4"
        data={data}
        index="date"
        categories={[labels[category]]}
        colors={[color]}
        yAxisWidth={80}
        connectNulls={true}
      />
    </Card>
    )
  };

  return (
    <>
      <div className="flex max-w-screen-xl flex-col mt-4 space-y-4">
        <div className="grid gap-6 sm:grid-cols-2">
          {renderChart('New Subscriptions', data.newSubscriptions, 'newSubscriptions', 'gray-500')}
          {renderChart('New Subscriptions Revenue', data.newSubscriptionsRevenue, 'newSubscriptionsRevenue', 'blue-500')}
          {renderChart('Renewed Subscriptions', data.renewals, 'renewals', 'green-500')}
          {renderChart('Renewed Subscriptions Revenue', data.renewedSubscriptionsRevenue, 'renewedSubscriptionsRevenue', 'yellow-500')}
          {renderChart('Active Subscriptions', data.activeSubscriptions, 'activeSubscriptions', 'purple-500')}
          {renderChart('Monthly Recurring Revenue', data.monthlyRecurringRevenue, 'monthlyRecurringRevenue', 'red-500')}
          {renderChart('One-time Charges', data.oneTimeCharges, 'oneTimeCharges', 'orange-500')}
          {renderChart('One-time Charges Revenue', data.oneTimeChargesRevenue, 'oneTimeChargesRevenue', 'cyan-500')}
          {renderChart('Orders', data.orders, 'orders', 'green-500')}
          {renderChart('Average Order Value', data.averageOrderValue, 'averageOrderValue', 'teal-500')}
          {renderChart('Cancellations', data.cancellations, 'cancellations', 'pink-500')}
        </div>
      </div>
    </>
  );
}
