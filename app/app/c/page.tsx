import ChargeService from "@/app/services/charge-service";
import { getUserSubscriptions } from "@/app/services/subscription-service";
import PageHeader from "@/components/common/page-header";
import ChargeCard from "@/components/customer/charge-card";
import SubscriptionCard from "@/components/customer/subscription-card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { pluralize } from "@/lib/utils";
import { isActive } from "@/types/subscription";
import { Charge, Subscription } from "@prisma/client";

export default async function SubscriptionsAndChargesList() {
  const charges: Charge[] = (await ChargeService.findCharges()) || [];
  const subscriptions: Subscription[] = (await getUserSubscriptions()) || [];

  const activeSubscriptions = subscriptions.filter((sub) => isActive(sub));
  const pastSubscriptions = subscriptions.filter((sub) => !isActive(sub));

  const anyCharges = charges.length > 0;
  const anyActive = activeSubscriptions.length > 0;
  const anyPast = pastSubscriptions.length > 0;

  return (
    <div className="flex max-w-screen-xl flex-col space-y-10 p-6 sm:p-10">
      <div className="flex flex-col space-y-6">
        <PageHeader
          title="Purchases"
          description="All your subscriptions and one-time purchases from market.dev will appear here."
        />

        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger
              value="active"
              className="gap-2"
              children={
                <>
                  {anyActive && (
                    <Badge
                      size="sm"
                      variant="secondary"
                      className="inline-flex min-w-[18px] items-center justify-center group-hover:text-foreground group-focus:text-foreground"
                    >
                      {activeSubscriptions.length}
                    </Badge>
                  )}
                  {pluralize("Active Subscription", activeSubscriptions.length)}
                </>
              }
            />
            <TabsTrigger value="onetime" className="gap-2">
              <>
                {anyCharges && (
                  <Badge
                    size="sm"
                    variant="secondary"
                    className="inline-flex min-w-[18px] items-center justify-center group-hover:text-foreground group-focus:text-foreground"
                  >
                    {charges.length}
                  </Badge>
                )}
                {pluralize("One-Time Purchase", charges.length)}
              </>
            </TabsTrigger>
            <TabsTrigger value="past" className="group gap-2">
              <>
                {anyPast && (
                  <Badge
                    size="sm"
                    variant="secondary"
                    className="inline-flex min-w-[18px] items-center justify-center group-hover:text-foreground group-focus:text-foreground"
                  >
                    {pastSubscriptions.length}
                  </Badge>
                )}
                {pluralize("Past Subscription", pastSubscriptions.length)}
              </>
            </TabsTrigger>
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
