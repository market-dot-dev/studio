"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Badge,
  NumberInput,
  Callout,
  TextInput,
  Textarea,
  Select,
  SelectItem,
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from "@tremor/react";
import Tier, { newTier } from "@/app/models/Tier";
import { subscriberCount } from "@/app/services/SubscriptionService";
import {
  createTier,
  updateTier,
  getVersionsByTierId,
  TierVersionWithFeatures,
  TierWithFeatures,
  duplicateTier,
} from "@/app/services/TierService";
import TierCard from "./tier-card";
import { userHasStripeAccountIdById } from "@/app/services/StripeService";
import PageHeading from "../common/page-heading";
import TierFeaturePicker from "../features/tier-feature-picker";
import { attachMany } from "@/app/services/feature-service";
import Link from "next/link";
import { Card } from "@/components/ui/card"
import { Channel, Contract, Feature, User } from "@prisma/client";
import LoadingDots from "@/components/icons/loading-dots";
import useCurrentSession from "@/app/hooks/use-current-session";
import LinkButton from "../common/link-button";
import { Check, Copy } from "lucide-react";
import TierDeleteButton from "./tier-delete-button";
import { getRootUrl } from "@/lib/domain";
import CheckoutTypeSelectionInput from "./checkout-type-selection-input";
import ChannelsSelectionInput from "./channels-selection-input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface TierFormProps {
  tier?: Partial<Tier>;
  contracts: Contract[];
  hasActiveFeatures?: boolean;
  user: User;
}

const TierVersionCard = ({
  tierVersion,
}: {
  tierVersion: TierVersionWithFeatures;
}) => {
  const features = tierVersion.features || [];
  const [versionSubscribers, setVersionSubscribers] = useState(0);

  useEffect(() => {
    subscriberCount(tierVersion.tierId, tierVersion.revision).then(
      setVersionSubscribers,
    );
  }, [tierVersion.tierId, tierVersion.revision]);

  return (
    <TableRow>
      <TableCell className="m-0 p-1 ps-0">
        {tierVersion.createdAt.toDateString()}
      </TableCell>
      <TableCell className="m-0 p-1 ps-0">
        {features.length > 0 ? (
          <>
            <ul>
              {features.map((f) => (
                <li key={f.id}>· {f.name}</li>
              ))}
            </ul>
          </>
        ) : (
          <>&nbsp;none</>
        )}
      </TableCell>
      <TableCell className="m-0 p-1 ps-0 text-center">
        ${tierVersion.price}
      </TableCell>
      <TableCell className="m-0 p-1 ps-0 text-center">
        {versionSubscribers}
      </TableCell>
    </TableRow>
  );
};

interface NewVersionCalloutProps {
  versionedAttributesChanged: boolean;
  featuresChanged: boolean;
  tierHasSubscribers: boolean;
}

const NewVersionCallout: React.FC<NewVersionCalloutProps> = ({
  versionedAttributesChanged,
  featuresChanged,
  tierHasSubscribers,
}) => {
  if (tierHasSubscribers && (versionedAttributesChanged || featuresChanged)) {
    const reasons: string[] = [];
    if (versionedAttributesChanged) reasons.push("price");
    if (featuresChanged) reasons.push("features");

    const reasonsText = reasons.join(" and ");

    return (
      <Callout className="mb-5 mt-2" title="New Version" color="red">
        You&apos;re changing the <strong>{reasonsText}</strong> of a package
        with subscribers, which will result in a new version.
      </Callout>
    );
  } else {
    return <></>;
  }
};

const TierLinkCopier = ({ tier }: { tier: Tier }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const link = getRootUrl("app", `/checkout/${tier.id}`);

  const copyToClipboard = async () => {
    if (window.location.protocol !== "https:") {
      setErrorMessage("Copying to clipboard is only supported on HTTPS sites.");
      return;
    }

    try {
      await navigator.clipboard.writeText(link);
      setIsCopied(true);
      setErrorMessage("");
    } catch (err) {
      console.error("Failed to copy text: ", err);
      setErrorMessage("Failed to copy the link. Please try again.");
    }
  };

  if (!link) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-col rounded-lg border border-gray-400 bg-gray-100 px-2 py-4 text-gray-700">
      <strong>Checkout Link</strong>
      {tier.published ? (
        <>
          <p className="text-sm text-stone-500">
            You can send this link directly to any potential customers.
          </p>
          <div className="mt-4 flex flex-row items-center justify-center">
            <TextInput
              id="checkoutLink"
              className="rounded-r-none"
              readOnly
              value={link}
            />
            <Button
              icon={isCopied ? Check : Copy}
              onClick={copyToClipboard}
              disabled={isCopied}
              className={
                `rounded-l-none ` +
                `${isCopied ? "cursor-not-allowed opacity-50" : ""}`
              }
            >
              {isCopied ? "Copied!" : ""}
            </Button>
          </div>
        </>
      ) : (
        <p className="text-sm text-stone-500">
          To create a checkout link, this package needs to be marked as
          available for sale.
        </p>
      )}
      {errorMessage && (
        <p className="mt-2 text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};

const calcDiscount = (price: number, annualPrice: number) => {
  if (price === 0) return 0;
  if (annualPrice === 0) return 100;
  const twelveMonths = price * 12;
  return (
    Math.round(((twelveMonths - annualPrice) / twelveMonths) * 100 * 10) / 10
  );
};

const DuplicateTierButton = ({ tierId }: { tierId: string }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDuplicate = async () => {
    setIsLoading(true);
    const newTier = await duplicateTier(tierId);
    if (newTier) {
      toast.success("Package duplicated successfully");
      router.push(`/tiers/${newTier.id}`);
    } else {
      toast.error("Failed to duplicate package");
    }
    setIsLoading(false);
  };

  return (
    <Button
      variant="secondary"
      onClick={handleDuplicate}
      disabled={isLoading}
      loading={isLoading}
      icon={Copy}
    >
      Duplicate
    </Button>
  );
};

const StandardCheckoutForm = ({
  tier,
  contracts,
  handleTierDataChange,
}: {
  tier: Tier;
  contracts: Contract[];
  handleTierDataChange: (name: string, value: number | string | null) => void;
}) => {
  const [trialEnabled, setTrialEnabled] = useState(tier?.trialDays > 0);
  const [annualPlanEnabled, setAnnualPlanEnabled] = useState(
    tier?.priceAnnual ? tier.priceAnnual > 0 : false,
  );
  const [annualDiscountPercent, setAnnualDiscountPercent] = useState(
    calcDiscount(tier.price || 0, tier.priceAnnual || 0),
  );

  return (
    <div>
      {" "}
      <div className="mb-4">
        <label className="mb-0.5 block text-sm font-medium text-gray-900 dark:text-white">
          Contract
        </label>
        <Select
          id="contractId"
          placeholder="Choose contract"
          required
          name="contractId"
          value={tier.contractId || "standard-msa"}
          onValueChange={(v) => handleTierDataChange("contractId", v)}
        >
          {contracts.map((c, index) => (
            <SelectItem value={c.id} key={index}>
              {c.name}
            </SelectItem>
          ))}
        </Select>
      </div>
      <div className="mb-4">
        <div className="mb-4">
          <label className="mb-0.5 block text-sm font-medium text-gray-900 dark:text-white">
            Billing type
          </label>
          <Select
            id="cadence"
            placeholder="Billing type"
            required
            name="cadence"
            value={tier.cadence || "month"}
            onValueChange={(v) => handleTierDataChange("cadence", v)}
          >
            <SelectItem value="month">Recurring</SelectItem>
            {/*
                      <SelectItem value="year">year</SelectItem>
                      <SelectItem value="quarter">quarter</SelectItem>
                      */}
            <SelectItem value="once">One Time</SelectItem>
          </Select>
        </div>

        <div className="mb-4">
          <label className="mb-0.5 block text-sm font-medium text-gray-900 dark:text-white">
            Monthly Price (USD)
          </label>
          <div className="flex gap-2">
            <NumberInput
              value={tier.price || 0}
              name="price"
              placeholder="Enter price"
              enableStepper={false}
              onValueChange={(v) => {
                if (annualPlanEnabled) {
                  setAnnualDiscountPercent(
                    calcDiscount(v, tier.priceAnnual || 0),
                  );
                }

                handleTierDataChange("price", v);
              }}
            />
          </div>
        </div>

        {tier.cadence === "month" && (
          <>
            <div className="mb-4 flex gap-2">
              <input
                type="checkbox"
                className="rounded-md border-gray-600 p-3 accent-green-400"
                id="annualPlanEnabled"
                checked={annualPlanEnabled}
                onChange={(e) => {
                  setAnnualPlanEnabled(e.target.checked);

                  if (e.target.checked) {
                    handleTierDataChange(
                      "priceAnnual",
                      tier.priceAnnual || (tier.price || 0) * 12,
                    );
                    setAnnualDiscountPercent(0);
                  } else {
                    handleTierDataChange("priceAnnual", 0);
                    setAnnualDiscountPercent(0);
                  }
                }}
              />
              <label className="mb-0.5 flex items-center text-sm font-medium text-gray-900 dark:text-white">
                Offer Annual Plan
              </label>
            </div>

            {annualPlanEnabled && (
              <div className="mb-4">
                <label className="mb-0.5 block text-sm font-medium text-gray-900 dark:text-white">
                  Annual Price &nbsp;
                </label>
                <NumberInput
                  id="priceAnnual"
                  placeholder="Annual price (dollars)"
                  required
                  name="priceAnnual"
                  disabled={!annualPlanEnabled}
                  enableStepper={false}
                  error={
                    !!tier.priceAnnual &&
                    (tier.price || 0) * 12 < (tier.priceAnnual || 0)
                  }
                  errorMessage={`Your annual plan is equal to or more expensive than the Monthly Plan x 12 (${(tier.price || 0) * 12}). Please adjust.`}
                  value={tier.priceAnnual || undefined}
                  onValueChange={(v) => {
                    handleTierDataChange("priceAnnual", v);
                    setAnnualDiscountPercent(calcDiscount(tier.price || 0, v));
                  }}
                />
                <label className="my-1 block text-sm font-medium text-gray-600">
                  Effective Discount Rate:{" "}
                  {annualDiscountPercent ? annualDiscountPercent + "%" : "0%"}{" "}
                  (compared to annualized monthly{" "}
                  {<>${(tier.price || 0) * 12}</>})
                </label>
              </div>
            )}

            <div className="mb-4">
              {/* <NumberInput
                              id="annualDiscountPercent"
                              placeholder="Annual Discount (%)"
                              readOnly={true}
                              disabled={!annualPlanEnabled}
                              required
                              name="annualDiscountPercent"
                              value={annualDiscountPercent}
                          /> */}
            </div>

            <div className="mb-4 flex gap-2">
              <input
                type="checkbox"
                className="rounded-md border-gray-600 p-3 accent-green-400"
                id="trialEnabled"
                checked={trialEnabled}
                onChange={(e) => setTrialEnabled(e.target.checked)}
              />
              <label className="mb-0.5 flex items-center text-sm font-medium text-gray-900 dark:text-white">
                Offer Trial Period
              </label>
            </div>

            {trialEnabled && (
              <div className="mb-4">
                <label className="mb-0.5 block text-sm font-medium text-gray-900 dark:text-white">
                  Trial Length (Days)
                </label>
                <NumberInput
                  id="trialDays"
                  placeholder="Annual price (dollars)"
                  required
                  name="trialDays"
                  disabled={!trialEnabled}
                  value={tier.trialDays || 0}
                  onValueChange={(v) => handleTierDataChange("trialDays", v)}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default function TierForm({
  tier: tierObj,
  contracts,
  hasActiveFeatures = false,
  user,
}: TierFormProps) {
  const router = useRouter();
  const [tier, setTier] = useState<TierWithFeatures>(
    (tierObj ? tierObj : newTier()) as Tier,
  );

  const [selectedFeatureIds, setSelectedFeatureIds] = useState<Set<string>>(
    new Set<string>(),
  );
  const [versionedAttributesChanged, setVersionedAttributesChanged] =
    useState(false);
  const [tierSubscriberCount, setTierSubscriberCount] = useState(0);
  const [currentRevisionSubscriberCount, setCurrentRevisionSubscriberCount] =
    useState(0);
  const [versions, setVersions] = useState<TierVersionWithFeatures[]>([]);
  const [featuresChanged, setFeaturesChanged] = useState(false);
  const [featureObjs, setFeatureObjs] = useState<Feature[]>([]);

  const [isDeleting, setIsDeleting] = useState(false);
  const newRecord = !tier?.id;
  const tierHasSubscribers = currentRevisionSubscriberCount > 0;

  const formTitle = newRecord ? "Create New Package" : tier.name;
  const buttonLabel = newRecord ? "Create Package" : "Update Package";

  const [errors, setErrors] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  const { isAdmin } = useCurrentSession();

  const handleInputChange = (name: string, value: number | string | null) => {
    const updatedTier = { ...tier, [name]: value } as Tier;
    setTier(updatedTier);
  };

  const validateForm = () => {
    if (!tier.name) {
      setErrors({ ...errors, name: "Please enter a name for the package" });
      return false;
    }
    return true;
  };

  const onSubmit = async () => {
    if (!validateForm()) return;
    setIsSaving(true);

    try {
      let savedTier;
      if (newRecord) {
        savedTier = await createTier(tier);
        await attachMany(
          {
            referenceId: savedTier.id,
            featureIds: Array.from(selectedFeatureIds),
          },
          "tier",
        );
      } else {
        savedTier = await updateTier(
          tier.id as string,
          tier,
          Array.from(selectedFeatureIds),
        );
      }
      toast.success("Package updated successfully");
      router.push(`/tiers/${savedTier.id}`);
    } catch (error) {
      toast.error(`Failed to update package: ${(error as Error).message}`);
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  };

  const [canPublish, setCanPublish] = useState(false);
  const [canPublishLoading, setCanPublishLoading] = useState(true);

  useEffect(() => {
    if (tierObj) {
      // call the refreshOnboarding function if it exists
      if (window?.hasOwnProperty("refreshOnboarding")) {
        (window as any)["refreshOnboarding"]();
      }
    }

    if (tier.checkoutType === "gitwallet") {
      userHasStripeAccountIdById().then((value: boolean) => {
        setCanPublish(value);
        setCanPublishLoading(false);
      });
    } else {
      setCanPublish(true);
      setCanPublishLoading(false);
    }
  }, [tier.checkoutType]);

  useEffect(() => {
    if (tier.id) {
      getVersionsByTierId(tier.id).then(setVersions);
      subscriberCount(tier.id).then(setTierSubscriberCount);

      subscriberCount(tier.id, tier.revision).then(
        setCurrentRevisionSubscriberCount,
      );
    }
  }, [tier.id, tier.revision]);

  useEffect(() => {
    if (tier && tierObj) {
      if (
        tierObj.published === true &&
        Number(tierObj.price) !== Number(tier.price)
      ) {
        setVersionedAttributesChanged(true);
      }
      // shouldCreateNewVersion(tierObj as Tier, tier).then(ret => {
      // 	setVersionedAttributesChanged(ret);
      // });
    }
  }, [tier, tierObj]);

  const canPublishDisabled =
    tier.checkoutType === "gitwallet"
      ? !canPublish || canPublishLoading
      : false;

  return (
    <>
      {/* Grid layout for responsiveness */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Form Fields Section */}
        <div className="space-y-6 md:col-span-2">
          <div className="flex justify-between">
            <div>
              <Link href="/tiers" className="underline">
                ← All Packages
              </Link>
              <PageHeading title={formTitle} />
            </div>
          </div>
        </div>

        <div>&nbsp;</div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-8 pb-20 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <div className="mb-4">
            <label className="mb-0.5 block text-sm font-medium text-gray-900 dark:text-white">
              Checkout Type
            </label>
            <CheckoutTypeSelectionInput
              user={user}
              tier={tier}
              handleInputChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <NewVersionCallout
              tierHasSubscribers={tierHasSubscribers}
              versionedAttributesChanged={versionedAttributesChanged}
              featuresChanged={featuresChanged}
            />

            <label className="mb-0.5 block text-sm font-medium text-gray-900 dark:text-white">
              Package Name
            </label>
            <TextInput
              id="tierName"
              placeholder="Premium"
              required
              name="name"
              value={tier.name}
              onValueChange={(v) => handleInputChange("name", v)}
            />
            {errors["name"] ? <p className="text-sm text-stone-500">{errors["name"]}</p> : null}
          </div>
          <div className="mb-4">
            <label className="mb-0.5 block text-sm font-medium text-gray-900 dark:text-white">
              Package Tagline
            </label>
            <TextInput
              id="tierTagline"
              placeholder="Great for startups and smaller companies."
              required
              name="tagline"
              value={tier.tagline || ""}
              onValueChange={(v) => handleInputChange("tagline", v)}
            />
          </div>
          <div className="mb-4">
            <label className="mb-0.5 block text-sm font-medium text-gray-900 dark:text-white">
              Package Description
            </label>
            <Textarea
              id="tierDescription"
              rows={4}
              placeholder="Describe your package here. This is for your own use and will not be shown to any potential customers."
              name="description"
              value={tier.description || ""}
              onValueChange={(v) => handleInputChange("description", v)}
            />
          </div>
          <div className="mb-4">
            <label className="mb-0.5 block text-sm font-medium text-gray-900 dark:text-white">
              Channels
            </label>
            <ChannelsSelectionInput
              userIsMarketExpert={!!user.marketExpertId}
              selectedChannels={tier.channels}
              handleInputChange={(channel) => {
                let channels: Channel[] = tier.channels;
                if (channels.includes(channel)) {
                  channels = channels.filter((c) => c !== channel);
                } else {
                  channels = [...channels, channel];
                }

                setTier({
                  ...tier,
                  channels,
                });
              }}
            />
          </div>

          {tier.checkoutType === "gitwallet" && (
            <StandardCheckoutForm
              tier={tier}
              contracts={contracts}
              handleTierDataChange={handleInputChange}
            />
          )}
          <div className="mb-4">
            <label className="mb-0.5 block text-sm font-medium text-gray-900 dark:text-white">
              Package Status
            </label>
            <label className="mb-0.5 block text-sm font-medium text-gray-900 dark:text-white">
              <div className="flex gap-2">
                {canPublishLoading && (
                  <>
                    <LoadingDots />
                    <p className="text-sm text-stone-500">Checking Stripe Eligiblity</p>
                  </>
                )}
                {!canPublishLoading && (
                  <>
                    <input
                      type="checkbox"
                      checked={tier.published}
                      className="rounded-md border-gray-600 p-3 accent-green-400"
                      disabled={canPublishDisabled}
                      data-cy="available-for-sale"
                      onChange={(e) => {
                        setTier({
                          ...tier,
                          published: e.target.checked,
                        } as Tier);
                      }}
                    />
                    <span>
                      <label htmlFor="switch" className="text-sm text-gray-900">
                        Make this package{" "}
                        <span className="font-medium text-gray-700">
                          available for sale.
                        </span>
                      </label>
                    </span>
                  </>
                )}
              </div>
              {!canPublish && !canPublishLoading && (
                <>
                  <Callout
                    className="my-2"
                    title="Payment Setup Required"
                    color="red"
                  >
                    You need to connect your Stripe account to publish a
                    package. Visit{" "}
                    <a href="/settings/payment" className="underline">
                      Payment Settings
                    </a>{" "}
                    to get started.
                  </Callout>
                </>
              )}
            </label>
          </div>
          {hasActiveFeatures && (
            <div className="mb-4">
              <label className="mb-0.5 block text-sm font-medium text-gray-900 dark:text-white">
                Features
              </label>
              <Card className="p-2">
                {tier?.id ? (
                  <TierFeaturePicker
                    tierId={tier.id}
                    newTier={tier}
                    selectedFeatureIds={selectedFeatureIds}
                    setSelectedFeatureIds={setSelectedFeatureIds}
                    setFeaturesChanged={setFeaturesChanged}
                    setFeatureObjs={setFeatureObjs}
                  />
                ) : (
                  <TierFeaturePicker
                    newTier={tier}
                    selectedFeatureIds={selectedFeatureIds}
                    setSelectedFeatureIds={setSelectedFeatureIds}
                    setFeatureObjs={setFeatureObjs}
                  />
                )}
              </Card>
            </div>
          )}
          {isAdmin() && tier?.id && (
            <>
              <div className="mb-4">
                <label className="mb-0.5 block text-sm font-medium text-gray-900 dark:text-white">
                  Admin Panel
                </label>
                <Card className="p-2">
                  View admin-only options:{" "}
                  <LinkButton href={`/admin/tiers/${tier.id}`}>Go</LinkButton>
                </Card>
              </div>
            </>
          )}
          {tier.checkoutType === "gitwallet" && (
            <div className="mb-4">
              <label className="mb-0.5 block text-sm font-medium text-gray-900 dark:text-white">
                Package Version History
              </label>

              {!!versions && versions.length === 0 && (
                <p className="text-sm text-stone-500">
                  {tier.name} has{" "}
                  {currentRevisionSubscriberCount === 0
                    ? "no customers yet"
                    : currentRevisionSubscriberCount + " customers"}
                  . If you make any price or feature changes for a package that
                  has customers, your changes to the previous package will be
                  kept as a package version. Customers will be charged what they
                  originally purchased.
                </p>
              )}

              {!!versions && versions.length > 0 && (
                <>
                  <p className="text-sm text-stone-500 my-4">
                    {tier.name} has{" "}
                    {currentRevisionSubscriberCount === 0
                      ? "no customers yet"
                      : currentRevisionSubscriberCount + " customers"}{" "}
                    for the most recent version. There are {versions.length}{" "}
                    versions and {tierSubscriberCount} customers across
                    versions.
                  </p>
                  <Card>
                    <Table>
                      <TableHead>
                        <TableRow className="border-b-2 border-gray-400">
                          <TableHeaderCell className="m-0 p-1 ps-0 text-xs font-medium uppercase tracking-wider text-gray-500">
                            Created
                          </TableHeaderCell>
                          <TableHeaderCell className="m-0 p-1 ps-0 text-xs font-medium uppercase tracking-wider text-gray-500">
                            Features
                          </TableHeaderCell>
                          <TableHeaderCell className="m-0 p-1 ps-0 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                            Price
                          </TableHeaderCell>
                          <TableHeaderCell className="m-0 p-1 ps-0 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                            #Customers
                          </TableHeaderCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell className="m-0 p-1 ps-0">
                            {tier.createdAt.toDateString()}
                            <Badge
                              color="gray"
                              size="xs"
                              className="ms-1 text-xs font-medium uppercase"
                            >
                              Current
                            </Badge>
                          </TableCell>
                          <TableCell className="m-0 p-1 ps-0">
                            {tier.features && tier.features.length > 0 ? (
                              <>
                                <ul>
                                  {tier.features.map((f) => (
                                    <li key={f.id}>· {f.name}</li>
                                  ))}
                                </ul>
                              </>
                            ) : (
                              <>&nbsp;None</>
                            )}
                          </TableCell>
                          <TableCell className="m-0 p-1 ps-0 text-center">
                            ${tier.price}
                          </TableCell>
                          <TableCell className="m-0 p-1 ps-0 text-center">
                            {currentRevisionSubscriberCount}
                          </TableCell>
                        </TableRow>
                        {versions.map((version) => (
                          <TierVersionCard
                            tierVersion={version}
                            key={version.id}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </Card>

                  <p className="text-sm text-stone-500 my-4">
                    Please note that package versions are only recorded when you
                    make feature or price changes to a package where you have
                    existing customers. Customers will be charged what they
                    originally purchased.
                  </p>
                </>
              )}
            </div>
          )}
          <Button
            disabled={isSaving || isDeleting}
            loading={isSaving}
            onClick={onSubmit}
          >
            {buttonLabel}
          </Button>
        </div>

        {/* Preview Section */}
        <div className="mb-auto text-center md:w-[300px]">
          <label className="mb-0.5 block text-sm font-medium text-gray-900 dark:text-white">
            Preview
          </label>
          <TierCard
            tier={tier}
            features={featureObjs}
            buttonDisabled={newRecord}
            hasActiveFeatures={hasActiveFeatures}
          />
          {tier.id && tier.published ? (
            <p className="text-sm text-stone-500 mt-2">
              This package is currently published and available for sale.
            </p>
          ) : (
            <p className="text-sm text-stone-500 mt-2">
              This package is not published and is not available for sale.
            </p>
          )}
          <TierLinkCopier tier={tier} />
          {!newRecord && (
            <div className="mt-4 flex flex-col items-center rounded-lg border border-gray-400 bg-gray-100 px-2 py-4 text-gray-700">
              <strong>Admin Options</strong>

              <div className="my-2 flex justify-center gap-2">
                <DuplicateTierButton tierId={tier.id} />
                {!tier._count?.Charge && !tier._count?.subscriptions && (
                  <TierDeleteButton
                    tierId={tier.id}
                    onConfirm={() => setIsDeleting(true)}
                    onSuccess={() => {
                      setIsDeleting(false);
                      window.location.href = "/tiers";
                    }}
                    onError={(error: any) => {
                      setIsDeleting(false);
                    }}
                  />
                )}
              </div>
              {!tier._count?.Charge && !tier._count?.subscriptions && (
                <p className="text-sm text-stone-500 mt-2">
                  This package can be deleted as it has no active customers or
                  features.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
