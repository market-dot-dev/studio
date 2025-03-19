import PageHeader from "@/components/common/page-header";
import ChargeService from "@/app/services/charge-service";
import SubscriptionService from "@/app/services/SubscriptionService";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SubscriptionCard from "@/components/customer/subscription-card";
import ChargeCard from "@/components/customer/charge-card";

export default async function SubscriptionsAndChargesList({
  params,
}: {
  params: { id: string };
}) {
  const charges = (await ChargeService.findCharges()) || [];
  const subscriptions = (await SubscriptionService.findSubscriptions()) || [];

  const activeSubscriptions = subscriptions.filter((sub) => sub.isActive());
  const pastSubscriptions = subscriptions.filter((sub) => !sub.isActive());

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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeSubscriptions.map((element) => (
                <SubscriptionCard subscription={element} key={element.id} />
              ))}
            </div>
            {!anyActive && (
              <div className="flex flex-col space-y-2">
                <h2>No active subscriptions</h2>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="onetime">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {charges.map((element) => (
                <ChargeCard charge={element} key={element.id} />
              ))}
            </div>
            {!anyCharges && (
              <div className="flex flex-col space-y-2">
                <h2>No purchases</h2>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pastSubscriptions.map((element) => (
                <SubscriptionCard subscription={element} key={element.id} />
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
