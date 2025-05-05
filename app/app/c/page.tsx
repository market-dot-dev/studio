import ChargeService from "@/app/services/charge-service";
import { findSubscriptions } from "@/app/services/subscription-service";
import PageHeader from "@/components/common/page-header";
import ChargeCard from "@/components/customer/charge-card";
import SubscriptionCard from "@/components/customer/subscription-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isActive } from "@/types/subscription";

export default async function SubscriptionsAndChargesList() {
  const charges = (await ChargeService.findCharges()) || [];
  const subscriptions = (await findSubscriptions()) || [];

  const activeSubscriptions = subscriptions.filter((sub) => isActive(sub));
  const pastSubscriptions = subscriptions.filter((sub) => !isActive(sub));

  const anyCharges = charges.length > 0;
  const anyActive = activeSubscriptions.length > 0;
  const anyPast = pastSubscriptions.length > 0;

  return (
    <div className="flex max-w-screen-xl flex-col space-y-10 p-10">
      <div className="flex flex-col space-y-6">
        <PageHeader
          title="Purchases"
          description="All your subscriptions and one time purchases from market.dev will appear here."
        />

        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active Subscriptions</TabsTrigger>
            <TabsTrigger value="onetime">One Time Purchases</TabsTrigger>
            <TabsTrigger value="past">Past Subscriptions</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {activeSubscriptions.map((sub) => (
                <SubscriptionCard subscription={sub} key={sub.id} />
              ))}
            </div>
            {!anyActive && (
              <div className="flex flex-col space-y-2">
                <h2>No active subscriptions</h2>
              </div>
            )}
          </TabsContent>

          <TabsContent value="onetime">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {charges.map((charge) => (
                <ChargeCard charge={charge} key={charge.id} />
              ))}
            </div>
            {!anyCharges && (
              <div className="flex flex-col space-y-2">
                <h2>No purchases</h2>
              </div>
            )}
          </TabsContent>

          <TabsContent value="past">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {pastSubscriptions.map((sub) => (
                <SubscriptionCard subscription={sub} key={sub.id} />
              ))}
            </div>
            {!anyPast && (
              <div className="flex flex-col space-y-2">
                <h2>No past subscriptions</h2>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
