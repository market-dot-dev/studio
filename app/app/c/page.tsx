import TierService from "@/app/services/TierService";
import UserService from "@/app/services/UserService";
import PageHeading from "@/components/common/page-heading";
import Subscription, { SubscriptionStates } from "@/app/models/Subscription";
import ChargeService from "@/app/services/charge-service";
import SubscriptionService from "@/app/services/SubscriptionService";
import { Charge, Feature, Contract } from "@prisma/client";
import ContractService from "@/app/services/contract-service";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import CustomerPackageFeatures from "../../../components/customer/customer-package-features";
import Tier from "@/app/models/Tier";
import CancelSubscriptionButton from "./subscriptions/cancel-subscription-button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import FeatureService from "@/app/services/feature-service";
import { parseTierDescription } from "@/lib/utils";
import { getRootUrl } from "@/lib/domain";
import { Store } from "lucide-react";

type TierWithFeatures = (Tier & { features: Feature[] }) | null;

const ContractLink = ({ contract }: { contract?: Contract }) => {
  const baseUrl = getRootUrl("app", "/c/contracts");
  const url = contract
    ? `${baseUrl}/${contract.id}`
    : `${baseUrl}/standard-msa`;
  const contractName = contract?.name || "Standard MSA";

  return (
    <p className="text-sm font-medium">
      <a href={url} className="underline" target="_blank">
        {contractName}
      </a>
    </p>
  );
};

const ChargeCard = async ({ charge }: { charge: Charge }) => {
  if (!charge || !charge.tierId) return null;

  const tier = (await TierService.findTier(charge.tierId!)) as TierWithFeatures;
  if (!tier) return null;

  const [maintainer, hasActiveFeatures] = await Promise.all([
    UserService.findUser(tier.userId),
    FeatureService.hasActiveFeaturesForUser(tier.userId),
  ]);

  if (!maintainer) return null;

  const featuresFromDescription = tier?.description
    ? parseTierDescription(tier.description)
        .filter((section) => section.features)
        .map((section) => section.features)
        .flat()
        .map((feature: string, index: number) => ({
          id: `${index}`,
          name: feature,
          isEnabled: true,
        }))
    : [];

  let status = "paid";

  const contract =
    (await ContractService.getContractById(tier.contractId || "")) || undefined;

  return (
    <Card className="text-sm">
      <div className="flex flex-col gap-4 p-5 pr-4 pt-4">
        <div className="flex flex-col">
          <div className="flex justify-between gap-2">
            <h3 className="text-base font-semibold">
              {tier.name}
            </h3>
            <Badge variant="success" className="h-fit w-fit">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
          {tier.tagline && (
            <p className="line-clamp-2 text-sm text-stone-500">
              {tier.tagline}
            </p>
          )}
        </div>
        <p className="mb-1 text-xl font-semibold text-stone-800">USD ${tier.price}</p>
        <div className="flex flex-row flex-wrap gap-x-10 gap-y-4">
          <div className="flex flex-col gap-1">
            <span className="whitespace-nowrap text-xxs/4 font-medium uppercase tracking-wide text-stone-500">
              Purchased from
            </span>
            <div className="flex items-center gap-1.5">
              <Store size={16} />
              <span className="font-medium">{maintainer.projectName}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="whitespace-nowrap text-xxs/4 font-medium uppercase tracking-wide text-stone-500">
              Purchased On
            </span>
            <span className="font-medium">
              {charge.createdAt.toLocaleDateString()}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="whitespace-nowrap text-xxs/4 font-medium uppercase tracking-wide text-stone-500">
              Contract
            </span>
            <ContractLink contract={contract} />
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-between gap-2 rounded-b-md border-t bg-stone-50 px-5 py-3">
        <CustomerPackageFeatures
          features={hasActiveFeatures ? tier.features : featuresFromDescription}
          maintainerEmail={maintainer?.email}
        />
      </div>
    </Card>
  );
};
  
const SubscriptionCard = async ({
  subscription,
}: {
  subscription: Subscription;
}) => {
  if (!subscription || !subscription.tierId) return null;

  const tier = (await TierService.findTier(
    subscription.tierId!,
  )) as TierWithFeatures;
  if (!tier) return null;

  const [maintainer, hasActiveFeatures] = await Promise.all([
    UserService.findUser(tier.userId),
    FeatureService.hasActiveFeaturesForUser(tier.userId),
  ]);

  if (!maintainer) return null;

  const featuresFromDescription = tier?.description
    ? parseTierDescription(tier.description)
        .filter((section) => section.features)
        .map((section) => section.features)
        .flat()
        .map((feature: string, index: number) => ({
          id: `${index}`,
          name: feature,
          isEnabled: true,
        }))
    : [];

  const actualCadence = subscription.priceAnnual ? "year" : tier.cadence;
  const actualPrice = subscription.priceAnnual ? tier.priceAnnual : tier.price;
  const shortenedCadence = actualCadence === "month" ? "mo" : actualCadence === "year" ? "yr" : actualCadence;

  let status = "";
  if (subscription.state === SubscriptionStates.renewing) {
    status = "Subscribed";
  } else if (subscription.state === SubscriptionStates.cancelled) {
    if (subscription.activeUntil && subscription.activeUntil <= new Date()) {
      status = "Cancelled";
    } else if (subscription.activeUntil) {
      const daysRemaining = Math.ceil(
        (subscription.activeUntil.getTime() - new Date().getTime()) /
          (1000 * 3600 * 24),
      );
      status = `Cancelled -- usable for ${daysRemaining} more day${daysRemaining !== 1 ? "s" : ""}`;
    } else {
      status = "Cancelled";
    }
  }

  const contract =
    (await ContractService.getContractById(tier.contractId || "")) || undefined;

  return (
    <Card className="text-sm">
      <div className="flex flex-col gap-4 p-5 pr-4 pt-4">
        <div className="flex flex-col">
          <div className="flex justify-between gap-2">
            <h3 className="text-base font-semibold">
              {tier.name} {subscription.priceAnnual ? "(annual)" : ""}
            </h3>
            <Badge variant={"secondary"} className="h-fit w-fit">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
          {tier.tagline && (
            <p className="line-clamp-2 text-sm text-stone-500">
              {tier.tagline}
            </p>
          )}
        </div>
        <p className="mb-1 text-xl font-semibold text-stone-800">
          USD ${actualPrice}
          <span className="font-medium text-stone-500">
            /{shortenedCadence}
          </span>
        </p>
        <div className="flex flex-row flex-wrap gap-x-10 gap-y-4">
          <div className="flex flex-col gap-1">
            <span className="whitespace-nowrap text-xxs/4 font-medium uppercase tracking-wide text-stone-500">
              Purchased from
            </span>
            <div className="flex items-center gap-1.5">
              <Store size={16} />
              <span className="font-medium">{maintainer.projectName}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="whitespace-nowrap text-xxs/4 font-medium uppercase tracking-wide text-stone-500">
              Purchased On
            </span>
            <span className="font-medium">
              {subscription.createdAt.toLocaleDateString()}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="whitespace-nowrap text-xxs/4 font-medium uppercase tracking-wide text-stone-500">
              Contract
            </span>
            <ContractLink contract={contract} />
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-between gap-2 rounded-b-md border-t bg-stone-50 px-5 py-3">
        <CustomerPackageFeatures
          features={hasActiveFeatures ? tier.features : featuresFromDescription}
          maintainerEmail={maintainer?.email}
        />
        {subscription.state !== "cancelled" && (
          <CancelSubscriptionButton subscriptionId={subscription.id} />
        )}
      </div>
    </Card>
  );
};

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
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <div>
          <PageHeading title="Purchases" />
          <p className="text-sm text-stone-500">All your subscriptions and one time purchases from market.dev will appear here.</p>
        </div>
        
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
            {pastSubscriptions.map((element) => (
              <SubscriptionCard subscription={element} key={element.id} />
            ))}
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
