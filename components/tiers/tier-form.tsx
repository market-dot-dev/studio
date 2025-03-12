"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from "@tremor/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import { Channel, Contract, Feature, User } from "@prisma/client";
import LoadingDots from "@/components/icons/loading-dots";
import useCurrentSession from "@/app/hooks/use-current-session";
import { Check, Copy, ChevronLeft } from "lucide-react";
import TierDeleteButton from "./tier-delete-button";
import { getRootUrl } from "@/lib/domain";
import CheckoutTypeSelectionInput from "./checkout-type-selection-input";
import ChannelsSelectionInput from "./channels-selection-input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Switch } from "../ui/switch";

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
      <Alert variant="destructive" className="mb-5 mt-2">
        <AlertTitle>New Version</AlertTitle>
        <AlertDescription>
          You&apos;re changing the <strong>{reasonsText}</strong> of a package
          with subscribers, which will result in a new version.
        </AlertDescription>
      </Alert>
    );
  } else {
    return <></>;
  }
};

const TierLinkCopier = ({ tier, savedPublishedState }: { tier: Tier, savedPublishedState: boolean }) => {
  const [isCopied, setIsCopied] = useState(false);
  const link = getRootUrl("app", `/checkout/${tier.id}`);

  const copyToClipboard = async () => {
    if (window.location.protocol !== "https:") {
      toast.error("Copying to clipboard is only supported on HTTPS sites.");
      return;
    }

    try {
      await navigator.clipboard.writeText(link);
      setIsCopied(true);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast.error("Failed to copy the link. Please try again.");
    }
  };

  if (!link || !savedPublishedState) {
    return null;
  }

  return (
    <div className="flex flex-row items-center justify-center w-[280px]">
      <Input
        id="checkoutLink"
        className="rounded-r-none truncate pr-2"
        readOnly
        value={link}
        onClick={(e) => (e.target as HTMLInputElement).select()}
      />
      <Button
        variant="outline"
        onClick={copyToClipboard}
        disabled={isCopied}
        className={
          `h-9 rounded-l-none ` +
          `${isCopied ? "cursor-not-allowed opacity-50" : ""}`
        }
      >
        {isCopied ? <Check /> : <Copy />}
        {isCopied ? "Copied!" : ""}
      </Button>
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
      variant="outline"
      onClick={handleDuplicate}
      loading={isLoading}
    >
      <Copy />
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
    <div className="flex flex-col gap-6">
      <div>
        <Label htmlFor="contractId" className="mb-1 block">
          Contract
        </Label>
        <Select
          value={tier.contractId || "standard-msa"}
          onValueChange={(v) => handleTierDataChange("contractId", v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose contract" />
          </SelectTrigger>
          <SelectContent>
            {contracts.map((c, index) => (
              <SelectItem value={c.id} key={index}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-6">
        <div>
          <Label htmlFor="cadence" className="mb-2 md:mb-1.5 block">
            Billing type
          </Label>
          <Select
            value={tier.cadence || "month"}
            onValueChange={(v) => handleTierDataChange("cadence", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Billing type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Recurring</SelectItem>
              {/*
              <SelectItem value="year">year</SelectItem>
              <SelectItem value="quarter">quarter</SelectItem>
              */}
              <SelectItem value="once">One Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="price" className="mb-2 md:mb-1.5 block">
            Monthly Price (USD)
          </Label>
          <div className="flex gap-2">
            <Input
              id="price"
              name="price"
              type="number"
              value={tier.price || 0}
              placeholder="0"
              min={0}
              required
              onChange={(e) => {
                console.log("price", e.target.value);
                console.log("pricetype", typeof e.target.value);
                console.log("price", Number(e.target.value));
                console.log("pricetype", typeof Number(e.target.value));
                const v = Number(e.target.value);
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
            <div>
              <Checkbox
                id="annualPlanEnabled"
                checked={annualPlanEnabled}
                onCheckedChange={(checked) => {
                  const isChecked = checked === true;
                  setAnnualPlanEnabled(isChecked);

                  if (isChecked) {
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
                label="Offer annual plan"
              />
            </div>

            {annualPlanEnabled && (
              <div>
                <Label htmlFor="priceAnnual" className="mb-2 md:mb-1.5 block">
                  Annual Price (USD)
                </Label>
                <Input
                  id="priceAnnual"
                  name="priceAnnual"
                  type="number"
                  placeholder="0"
                  required
                  disabled={!annualPlanEnabled}
                  value={tier.priceAnnual || 0}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setAnnualDiscountPercent(calcDiscount(tier.price || 0, v));
                    handleTierDataChange("priceAnnual", v);
                  }}
                  className={
                    !!tier.priceAnnual &&
                    (tier.price || 0) * 12 < (tier.priceAnnual || 0)
                      ? "border-rose-500"
                      : ""
                  }
                />
                {!!tier.priceAnnual &&
                  (tier.price || 0) * 12 < (tier.priceAnnual || 0) && (
                    <p className="mt-2 text-xs text-rose-600">
                      Your annual plan is equal to or more expensive than the
                      Monthly Plan x 12 (${(tier.price || 0) * 12}). Please
                      adjust.
                    </p>
                  )}
                <p className="font-regular mt-2 block text-xs text-stone-500">
                  <strong className="font-bold">Effective Discount Rate</strong>
                  : {annualDiscountPercent ? annualDiscountPercent + "%" : "0%"}{" "}
                  (compared to annualized monthly{" "}
                  {<>${(tier.price || 0) * 12}</>})
                </p>
              </div>
            )}

            {/* <div className="mb-4">
              <Input
                id="annualDiscountPercent"
                placeholder="Annual Discount (%)"
                readOnly={true}
                disabled={!annualPlanEnabled}
                required
                type="number"
                min={0}
                max={100}
                name="annualDiscountPercent"
                value={annualDiscountPercent}
              />
            </div> */}

            <div>
              <Checkbox
                id="trialEnabled"
                checked={trialEnabled}
                onCheckedChange={(checked) => setTrialEnabled(checked === true)}
                label="Offer trial period"
              />
            </div>

            {trialEnabled && (
              <div>
                <Label htmlFor="trialDays" className="mb-2 block">
                  Trial Length (Days)
                </Label>
                <Input
                  id="trialDays"
                  name="trialDays"
                  type="number"
                  placeholder="Trial length in days"
                  required
                  disabled={!trialEnabled}
                  value={tier.trialDays || 0}
                  min={0}
                  onChange={(e) =>
                    handleTierDataChange("trialDays", Number(e.target.value))
                  }
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
  
  // Add savedPublishedState to track the persisted published status
  const [savedPublishedState, setSavedPublishedState] = useState<boolean>(
    tierObj?.published || false
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
      // Update the saved published state when the tier is successfully saved
      setSavedPublishedState(savedTier.published);
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
      <div className="flex flex-col gap-6 md:col-span-2">
        <div className="flex w-full justify-between">
          <div className="flex w-full flex-col gap-4">
            <Link
              href="/tiers"
              className="flex w-fit -translate-x-0.5 items-center gap-1 text-sm font-semibold tracking-tightish text-stone-500 transition-colors hover:text-stone-800"
            >
              <ChevronLeft size={16} className="shrink-0" />
              All Packages
            </Link>
            <div className="flex w-full flex-wrap items-center justify-between gap-1">
              <div className="flex items-center gap-3">
                <PageHeading title={formTitle} />
                <Badge
                  variant={
                    tier.id && savedPublishedState ? "success" : "secondary"
                  }
                  className="mb-1 w-fit"
                >
                  {tier.id && savedPublishedState ? "Published" : "Draft"}
                </Badge>
              </div>
              <TierLinkCopier
                tier={tier}
                savedPublishedState={savedPublishedState}
              />
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-3" />

      <div className="mt-4 flex flex-col gap-10 pb-20 lg:flex-row">
        {/* Mobile Tabs - Only visible on screens smaller than lg breakpoint */}
        <div className="lg:hidden w-full mb-6">
          <Tabs defaultValue="details">
            <TabsList variant="background" className="w-full">
              <TabsTrigger variant="background" value="details" className="flex-1">Details</TabsTrigger>
              <TabsTrigger variant="background" value="preview" className="flex-1">Preview</TabsTrigger>
            </TabsList>
            
            {/* Details Tab Content - Form Fields */}
            <TabsContent value="details">
              <div className="flex w-full flex-col gap-6">
                <div>
                  <div className="space-y-2">
                    <Switch
                      id="published"
                      checked={tier.published}
                      disabled={!canPublish || canPublishDisabled}
                      data-cy="available-for-sale"
                      onCheckedChange={(checked) => {
                        setTier({
                          ...tier,
                          published: checked === true,
                        } as Tier);
                      }}
                      label="This package is available for sale"
                    />
                    <p className="text-xs text-stone-500">
                      {tier.published ? (
                        <>
                          This package will be visible and purchasable by customers.
                          Changes will create a new version.{" "}
                          <a href="#channels" className="underline">
                            Pick this package&apos;s channels
                          </a>
                        </>
                      ) : (
                        "This package will remain hidden from customers on all channels."
                      )}
                    </p>
                  </div>
                  {!canPublish && !canPublishLoading && (
                    <>
                      <Alert variant="destructive" className="my-2">
                        <AlertTitle>Payment Setup Required</AlertTitle>
                        <AlertDescription>
                          You need to connect your Stripe account to publish a
                          package. Visit{" "}
                          <a href="/settings/payment" className="underline">
                            Payment Settings
                          </a>{" "}
                          to get started.
                        </AlertDescription>
                      </Alert>
                      <p className="mt-2 text-sm text-stone-500">
                        Once connected, you&apos;ll be able to publish packages and
                        start accepting payments from customers.
                      </p>
                    </>
                  )}
                </div>
                <div>
                  <NewVersionCallout
                    tierHasSubscribers={tierHasSubscribers}
                    versionedAttributesChanged={versionedAttributesChanged}
                    featuresChanged={featuresChanged}
                  />
                  <Label htmlFor="tierName" className="mb-2 md:mb-1.5">
                    Name
                  </Label>
                  <Input
                    id="tierName"
                    placeholder="Premium"
                    required
                    name="name"
                    value={tier.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                  {errors["name"] ? (
                    <p className="text-sm text-stone-500">{errors["name"]}</p>
                  ) : null}
                </div>
                <div>
                  <Label htmlFor="tierTagline" className="mb-2 md:mb-1.5 block">
                    Tagline
                  </Label>
                  <Input
                    id="tierTagline"
                    placeholder="Great for startups and smaller companies."
                    required
                    name="tagline"
                    value={tier.tagline || ""}
                    onChange={(e) => handleInputChange("tagline", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="tierDescription" className="mb-2 md:mb-1.5 block">
                    Description
                  </Label>
                  <Textarea
                    id="tierDescription"
                    rows={4}
                    placeholder="Describe your package here. This is for your own use and will not be shown to any potential customers."
                    name="description"
                    value={tier.description || ""}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                </div>
                {hasActiveFeatures && (
                  <div>
                    <Label htmlFor="features" className="mb-2 md:mb-1.5 block">
                      Features
                    </Label>
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

                <Separator className="my-2" />

                <div>
                  <Label htmlFor="checkoutType" className="mb-2.5">
                    Checkout Type
                  </Label>
                  <CheckoutTypeSelectionInput
                    user={user}
                    tier={tier}
                    handleInputChange={handleInputChange}
                  />
                </div>
                {tier.checkoutType === "gitwallet" && (
                  <StandardCheckoutForm
                    tier={tier}
                    contracts={contracts}
                    handleTierDataChange={handleInputChange}
                  />
                )}

                <Separator className="my-2" />

                <div id="channels">
                  <Label htmlFor="channels" className="mb-2.5 block">
                    Channels
                  </Label>
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
                  <div>
                    <Label htmlFor="versionHistory" className="mb-2 md:mb-1.5 block">
                      Package Version History
                    </Label>

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
                        <p className="my-6 text-sm text-stone-500">
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
                                  <Badge variant="success" size="sm" className="ms-1">
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

                        <p className="my-6 text-sm text-stone-500">
                          Please note that package versions are only recorded when you
                          make feature or price changes to a package where you have
                          existing customers. Customers will be charged what they
                          originally purchased.
                        </p>
                      </>
                    )}
                  </div>
                )}

                <Separator className="my-2" />

                <Button
                  disabled={isSaving || isDeleting}
                  loading={isSaving}
                  onClick={onSubmit}
                >
                  {buttonLabel}
                </Button>

                {!newRecord && (
                  <div className="mt-6 flex flex-col items-center gap-4 rounded border border-stone-200 bg-stone-100 p-4 text-stone-500">
                    <strong className="text-stone-800">Admin Options</strong>
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-center gap-2">
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
                        <p className="text-sm text-stone-500">
                          This package can be deleted as it has no active customers or
                          features.
                        </p>
                      )}
                    </div>
                    <Separator />
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/admin/tiers/${tier.id}`}>Go to Admin Panel</Link>
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="preview">
              <div className="mx-auto w-full max-w-[300px]">
                <TierCard
                  tier={{ ...tier, published: savedPublishedState }}
                  features={featureObjs}
                  buttonDisabled={newRecord}
                  hasActiveFeatures={hasActiveFeatures}
                  className="w-full"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="hidden lg:flex w-full lg:max-w-lg flex-col gap-6">
          <div>
            <div className="space-y-2">
              <Switch
                id="published"
                checked={tier.published}
                disabled={!canPublish || canPublishDisabled}
                data-cy="available-for-sale"
                onCheckedChange={(checked) => {
                  setTier({
                    ...tier,
                    published: checked === true,
                  } as Tier);
                }}
                label="This package is available for sale"
              />
              <p className="text-xs text-stone-500">
                {tier.published ? (
                  <>
                    This package will be visible and purchasable by customers.
                    Changes will create a new version.{" "}
                    <a href="#channels" className="underline">
                      Pick this package&apos;s channels
                    </a>
                  </>
                ) : (
                  "This package will remain hidden from customers on all channels."
                )}
              </p>
            </div>
            {!canPublish && !canPublishLoading && (
              <>
                <Alert variant="destructive" className="my-2">
                  <AlertTitle>Payment Setup Required</AlertTitle>
                  <AlertDescription>
                    You need to connect your Stripe account to publish a
                    package. Visit{" "}
                    <a href="/settings/payment" className="underline">
                      Payment Settings
                    </a>{" "}
                    to get started.
                  </AlertDescription>
                </Alert>
                <p className="mt-2 text-sm text-stone-500">
                  Once connected, you&apos;ll be able to publish packages and
                  start accepting payments from customers.
                </p>
              </>
            )}
          </div>
          <div>
            <NewVersionCallout
              tierHasSubscribers={tierHasSubscribers}
              versionedAttributesChanged={versionedAttributesChanged}
              featuresChanged={featuresChanged}
            />
            <Label htmlFor="tierName" className="mb-2 md:mb-1.5">
              Name
            </Label>
            <Input
              id="tierName"
              placeholder="Premium"
              required
              name="name"
              value={tier.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
            {errors["name"] ? (
              <p className="text-sm text-stone-500">{errors["name"]}</p>
            ) : null}
          </div>
          <div>
            <Label htmlFor="tierTagline" className="mb-2 md:mb-1.5 block">
              Tagline
            </Label>
            <Input
              id="tierTagline"
              placeholder="Great for startups and smaller companies."
              required
              name="tagline"
              value={tier.tagline || ""}
              onChange={(e) => handleInputChange("tagline", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="tierDescription" className="mb-2 md:mb-1.5 block">
              Description
            </Label>
            <Textarea
              id="tierDescription"
              rows={4}
              placeholder="Describe your package here. This is for your own use and will not be shown to any potential customers."
              name="description"
              value={tier.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>
          {hasActiveFeatures && (
            <div>
              <Label htmlFor="features" className="mb-2 md:mb-1.5 block">
                Features
              </Label>
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

          <Separator className="my-2" />

          <div>
            <Label htmlFor="checkoutType" className="mb-2.5">
              Checkout Type
            </Label>
            <CheckoutTypeSelectionInput
              user={user}
              tier={tier}
              handleInputChange={handleInputChange}
            />
          </div>
          {tier.checkoutType === "gitwallet" && (
            <StandardCheckoutForm
              tier={tier}
              contracts={contracts}
              handleTierDataChange={handleInputChange}
            />
          )}

          <Separator className="my-2" />

          <div id="channels">
            <Label htmlFor="channels" className="mb-2.5 block">
              Channels
            </Label>
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
            <div>
              <Label htmlFor="versionHistory" className="mb-2 md:mb-1.5 block">
                Package Version History
              </Label>

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
                  <p className="my-6 text-sm text-stone-500">
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
                            <Badge variant="success" size="sm" className="ms-1">
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

                  <p className="my-6 text-sm text-stone-500">
                    Please note that package versions are only recorded when you
                    make feature or price changes to a package where you have
                    existing customers. Customers will be charged what they
                    originally purchased.
                  </p>
                </>
              )}
            </div>
          )}

          <Separator className="my-2" />

          <Button
            disabled={isSaving || isDeleting}
            loading={isSaving}
            onClick={onSubmit}
          >
            {buttonLabel}
          </Button>
        </div>

        <div className="hidden lg:block sticky top-20 mx-auto mb-auto w-full text-center md:w-[300px]">
          <TierCard
            tier={{ ...tier, published: savedPublishedState }}
            features={featureObjs}
            buttonDisabled={newRecord}
            hasActiveFeatures={hasActiveFeatures}
            className="w-full"
          />
          {!newRecord && (
            <div className="mt-4 flex flex-col items-center gap-4 rounded border border-stone-200 bg-stone-100 p-4 text-stone-500">
              <strong className="text-stone-800">Admin Options</strong>
              <div className="flex flex-col gap-2">
                <div className="flex justify-center gap-2">
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
                  <p className="text-sm text-stone-500">
                    This package can be deleted as it has no active customers or
                    features.
                  </p>
                )}
              </div>
              <Separator />
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/admin/tiers/${tier.id}`}>Go to Admin Panel</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
