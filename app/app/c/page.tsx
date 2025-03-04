import TierService from "@/app/services/TierService";
import UserService from "@/app/services/UserService";
import PageHeading from "@/components/common/page-heading";
import Subscription, { SubscriptionStates } from "@/app/models/Subscription";
import ChargeService from "@/app/services/charge-service";
import SubscriptionService from "@/app/services/SubscriptionService";
import { Charge, Feature, Contract } from "@prisma/client";
import ContractService from "@/app/services/contract-service";

import { Bold, Badge } from "@tremor/react";
import { Card } from "@/components/ui/card";
import CustomerPackageFeatures from "../../../components/customer/customer-package-features";
import Tier from "@/app/models/Tier";
import CancelSubscriptionButton from "./subscriptions/cancel-subscription-button";
import Tabs from "../../../components/common/tabs";
import FeatureService from "@/app/services/feature-service";
import { parseTierDescription } from "@/lib/utils";
import { getRootUrl } from "@/lib/domain";

type TierWithFeatures = (Tier & { features: Feature[] }) | null;

const ContractLink = ({ contract }: { contract?: Contract }) => {
  const baseUrl = getRootUrl("app", "/c/contracts");
  const url = contract
    ? `${baseUrl}/${contract.id}`
    : `${baseUrl}/standard-msa`;
  const contractName = contract?.name || "Standard MSA";

  return (
    <Text>
      <a href={url} className="underline" target="_blank">
        {contractName}
      </a>
    </Text>
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
    <Card className="mb-4">
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row items-center space-x-2">
            {/* Add content here if needed */}
          </div>
        </div>

        <Bold>Package Name: {tier.name}</Bold>
        <Bold>Purchased From: {maintainer.projectName}</Bold>
        <div className="flex flex-col">
          <Bold>Description:</Bold>
          <Text>{tier.tagline}</Text>
        </div>

        <div className="flex flex-col">
          <Bold>Pricing:</Bold>
          <Text>
            ${tier.price} / {tier.cadence}
          </Text>
        </div>

        <div className="mb-4 flex flex-col">
          <Bold>Status:</Bold>
          <Text>
            <Badge className="me-2">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
            (On {charge.createdAt.toDateString()})
          </Text>
        </div>
        <div className="flex flex-col">
          <Bold>Contract:</Bold>
          <ContractLink contract={contract} />
        </div>
        <div className="flex gap-4">
          <CustomerPackageFeatures
            features={
              hasActiveFeatures ? tier.features : featuresFromDescription
            }
            maintainerEmail={maintainer?.email}
          />
        </div>

        {/* Commenting out Tier Version ID */}
        {/* <Text>{charge.tierVersionId}</Text> */}

        {/* <div className="flex flex-row space-x-2">
          <Link href={`/charges/${charge.id}`}>
            <Button>Package Details</Button>
          </Link>
        </div> */}
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
    <Card className="mb-4">
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row items-center space-x-2"></div>
        </div>

        <Bold>Package Name: {tier.name}</Bold>
        <Bold>Purchased From: {maintainer.projectName}</Bold>

        <div className="flex flex-col">
          <Bold>Status:</Bold>
          <Text>
            <Badge className="me-2">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
            (On {subscription.createdAt.toDateString()})
          </Text>
        </div>

        <div className="flex flex-col">
          <Bold>Description:</Bold>
          <Text>{tier.tagline}</Text>
        </div>

        <div className="flex flex-col">
          <Bold>Pricing:</Bold>
          <Text>
            ${actualPrice} / {actualCadence}
          </Text>
        </div>

        <div className="flex flex-col">
          <Bold>Terms:</Bold>
          <ContractLink contract={contract} />
        </div>

        <div className="flex flex-row justify-between space-x-2">
          <CustomerPackageFeatures
            features={
              hasActiveFeatures ? tier.features : featuresFromDescription
            }
            maintainerEmail={maintainer?.email}
          />
          {subscription.state !== "cancelled" && (
            <CancelSubscriptionButton subscriptionId={subscription.id} />
          )}
          {/* <Link href={`/subscriptions/${subscription.id}`}>
          <Button>Tier Details</Button>
        </Link> */}
        </div>
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

  const tabOneTimePurchases = (
    <>
      {charges.map((element) => (
        <ChargeCard charge={element} key={element.id} />
      ))}
      {!anyCharges && (
        <div className="flex flex-col space-y-2">
          <h2>No purchases</h2>
        </div>
      )}
    </>
  );

  const tabActiveSubscriptions = (
    <>
      {activeSubscriptions.map((element) => (
        <SubscriptionCard subscription={element} key={element.id} />
      ))}
      {!anyActive && (
        <div className="flex flex-col space-y-2">
          <h2>No active subscriptions</h2>
        </div>
      )}
    </>
  );

  const tabPastSubscriptions = (
    <>
      {pastSubscriptions.map((element) => (
        <SubscriptionCard subscription={element} key={element.id} />
      ))}
      {!anyPast && (
        <div className="flex flex-col space-y-2">
          <h2>No past subscriptions</h2>
        </div>
      )}
    </>
  );

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <PageHeading title="Purchases" />
        <Text>All your subscriptions and one time purchases from market.dev will appear here.</Text>

        <Tabs
          tabs={[
            {
              title: <span>Active Subscriptions</span>,
              content: tabActiveSubscriptions,
            },
            {
              title: <span>One Time Purchases</span>,
              content: tabOneTimePurchases,
            },
            {
              title: <span>Past Subscriptions</span>,
              content: tabPastSubscriptions,
            },
          ]}
        />
      </div>
    </div>
  );
}
