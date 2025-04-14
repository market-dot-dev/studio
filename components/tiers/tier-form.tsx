"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Check, Copy, LinkIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import Spinner from "../ui/spinner";
import { Switch } from "../ui/switch";

import PageHeader from "../common/page-header";
import TierFeaturePicker from "../features/tier-feature-picker";
import ChannelsSelectionInput from "./channels-selection-input";
import CheckoutTypeSelectionInput from "./checkout-type-selection-input";
import TierCard from "./tier-card";
import TierDeleteButton from "./tier-delete-button";

import Tier, { newTier } from "@/app/models/Tier";
import { userHasStripeAccountIdById } from "@/app/services/StripeService";
import { subscriberCount } from "@/app/services/SubscriptionService";
import {
  createTier,
  duplicateTier,
  getVersionsByTierId,
  TierVersionWithFeatures,
  TierWithFeatures,
  updateTier
} from "@/app/services/TierService";
import { attachMany } from "@/app/services/feature-service";
import { getRootUrl } from "@/lib/domain";
import { toast } from "sonner";

import useCurrentSession from "@/app/hooks/use-current-session";

import { Channel, Contract, Feature, User } from "@prisma/client";

interface TierFormProps {
  tier?: Partial<Tier>;
  contracts: Contract[];
  hasActiveFeatures?: boolean;
  user: User;
}

const TierVersionRow = ({ tierVersion }: { tierVersion: TierVersionWithFeatures }) => {
  const features = tierVersion.features || [];
  const [versionSubscribers, setVersionSubscribers] = useState(0);

  useEffect(() => {
    subscriberCount(tierVersion.tierId, tierVersion.revision).then(setVersionSubscribers);
  }, [tierVersion.tierId, tierVersion.revision]);

  return (
    <TableRow>
      <TableCell>{tierVersion.createdAt.toDateString()}</TableCell>
      <TableCell>${tierVersion.price}</TableCell>
      <TableCell>
        ${tierVersion.price}
        {tierVersion.cadence ? `/${tierVersion.cadence}` : ""}
      </TableCell>
      <TableCell>{versionSubscribers}</TableCell>
      <TableCell>
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
  tierHasSubscribers
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
          You&apos;re changing the <strong>{reasonsText}</strong> of a package with subscribers,
          which will result in a new version.
        </AlertDescription>
      </Alert>
    );
  } else {
    return <></>;
  }
};

const TierLinkCopier = ({
  tier,
  savedPublishedState
}: {
  tier: Tier;
  savedPublishedState: boolean;
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [shouldCopy, setShouldCopy] = useState(false);
  const link = getRootUrl("app", `/checkout/${tier.id}`);

  useEffect(() => {
    if (!shouldCopy) return;

    const copyToClipboard = async () => {
      try {
        console.log("Link to copy:", link);

        // Check if the Clipboard API is available
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(link);
        } else {
          // Fallback for browsers without clipboard API
          const textarea = document.createElement("textarea");
          textarea.value = link;
          textarea.style.position = "fixed"; // Prevent scrolling to bottom
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();

          // Try the execCommand as fallback (works in more browsers)
          const successful = document.execCommand("copy");
          if (!successful) {
            throw new Error("Fallback clipboard copy failed");
          }

          document.body.removeChild(textarea);
        }

        setIsCopied(true);

        const timer = setTimeout(() => {
          setIsCopied(false);
          setShouldCopy(false);
        }, 2000);

        return () => clearTimeout(timer);
      } catch (err) {
        console.error("Failed to copy text: ", err);
        toast.error("Failed to copy the link. Please try again.");
        setShouldCopy(false);
      }
    };

    copyToClipboard();
  }, [shouldCopy, link]);

  const handleCopy = () => {
    setShouldCopy(true);
  };

  if (!link || !savedPublishedState) {
    return null;
  }

  return (
    <div className="flex flex-row items-center justify-center rounded shadow-border-sm">
      <Input
        id="checkoutLink"
        className="min-w-none w-fit truncate rounded-r-none shadow-none active:shadow-none"
        readOnly
        value={link}
        onClick={(e) => (e.target as HTMLInputElement).select()}
      />
      <span className="h-full w-0 border-l border-stone-300"></span>
      <Button
        variant="outline"
        onClick={handleCopy}
        disabled={isCopied}
        tooltip={isCopied ? "Copied!" : "Copy checkout link"}
        className="z-1 size-9 rounded-l-none text-stone-900 shadow-none active:shadow-none md:size-8"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isCopied ? (
            <motion.div
              key="check"
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
              transition={{ duration: 0.1, type: "easeInOut" }}
            >
              <Check className="size-4 text-stone-900" />
            </motion.div>
          ) : (
            <motion.div
              key="link"
              initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: -10 }}
              transition={{ duration: 0.1, type: "easeInOut" }}
            >
              <LinkIcon className="size-4 text-stone-900" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </div>
  );
};

const calcDiscount = (price: number, annualPrice: number) => {
  if (price === 0) return 0;
  if (annualPrice === 0) return 100;
  const twelveMonths = price * 12;
  return Math.round(((twelveMonths - annualPrice) / twelveMonths) * 100 * 10) / 10;
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
    <Button variant="outline" onClick={handleDuplicate} loading={isLoading}>
      <Copy />
      Duplicate
    </Button>
  );
};

const StandardCheckoutForm = ({
  tier,
  contracts,
  handleTierDataChange,
  idPrefix = ""
}: {
  tier: Tier;
  contracts: Contract[];
  handleTierDataChange: (name: string, value: number | string | null) => void;
  idPrefix?: string;
}) => {
  const [trialEnabled, setTrialEnabled] = useState(tier?.trialDays > 0);
  const [annualPlanEnabled, setAnnualPlanEnabled] = useState(
    tier?.priceAnnual ? tier.priceAnnual > 0 : false
  );
  const [annualDiscountPercent, setAnnualDiscountPercent] = useState(
    calcDiscount(tier.price || 0, tier.priceAnnual || 0)
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Label htmlFor={`${idPrefix}contractId`} className="mb-2 block">
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
          <Label htmlFor={`${idPrefix}cadence`} className="mb-2 block">
            Billing Type
          </Label>
          <Select
            value={tier.cadence || "month"}
            onValueChange={(v) => handleTierDataChange("cadence", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Billing Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Recurring (Monthly)</SelectItem>
              {/*
              <SelectItem value="year">year</SelectItem>
              <SelectItem value="quarter">quarter</SelectItem>
              */}
              <SelectItem value="once">One Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor={`${idPrefix}price`} className="mb-2 block">
            {tier.cadence === "month" ? "Monthly Price (USD)" : "Price (USD)"}
          </Label>
          <div className="flex gap-2">
            <Input
              id={`${idPrefix}price`}
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
                  setAnnualDiscountPercent(calcDiscount(v, tier.priceAnnual || 0));
                }

                handleTierDataChange("price", v);
              }}
            />
          </div>
        </div>

        {tier.cadence === "month" && (
          <div className="space-y-6">
            <div className="flex flex-col gap-6">
              <Checkbox
                id={`${idPrefix}annualPlanEnabled`}
                checked={annualPlanEnabled}
                onCheckedChange={(checked) => {
                  const isChecked = checked === true;
                  setAnnualPlanEnabled(isChecked);

                  if (isChecked) {
                    handleTierDataChange("priceAnnual", tier.priceAnnual || (tier.price || 0) * 12);
                    setAnnualDiscountPercent(0);
                  } else {
                    handleTierDataChange("priceAnnual", 0);
                    setAnnualDiscountPercent(0);
                  }
                }}
                label="Offer annual plan"
              />

              {annualPlanEnabled && (
                <div className="mb-4">
                  <Label htmlFor={`${idPrefix}priceAnnual`} className="mb-2 block">
                    Annual Price (USD)
                  </Label>
                  <Input
                    id={`${idPrefix}priceAnnual`}
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
                      !!tier.priceAnnual && (tier.price || 0) * 12 < (tier.priceAnnual || 0)
                        ? "border-rose-500"
                        : ""
                    }
                  />
                  {!!tier.priceAnnual && (tier.price || 0) * 12 < (tier.priceAnnual || 0) && (
                    <p className="mt-2 text-xs text-rose-600">
                      Your annual plan is equal to or more expensive than the Monthly Plan x 12 ($
                      {(tier.price || 0) * 12}). Please adjust.
                    </p>
                  )}
                  <p className="font-regular mt-3 block text-xs text-stone-500">
                    <strong className="font-semibold">Effective Discount Rate</strong>:{" "}
                    {annualDiscountPercent ? annualDiscountPercent + "%" : "0%"} (compared to
                    annualized monthly {<>${(tier.price || 0) * 12}</>})
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
            </div>

            <div className="flex flex-col gap-6">
              <Checkbox
                id={`${idPrefix}trialEnabled`}
                checked={trialEnabled}
                onCheckedChange={(checked) => setTrialEnabled(checked === true)}
                label="Offer trial period"
              />

              {trialEnabled && (
                <div>
                  <Label htmlFor={`${idPrefix}trialDays`} className="mb-2 block">
                    Trial Length (Days)
                  </Label>
                  <Input
                    id={`${idPrefix}trialDays`}
                    name="trialDays"
                    type="number"
                    placeholder="Trial length in days"
                    required
                    disabled={!trialEnabled}
                    value={tier.trialDays || 0}
                    min={0}
                    onChange={(e) => handleTierDataChange("trialDays", Number(e.target.value))}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function TierForm({
  tier: tierObj,
  contracts,
  hasActiveFeatures = false,
  user
}: TierFormProps) {
  const router = useRouter();
  const [tier, setTier] = useState<TierWithFeatures>((tierObj ? tierObj : newTier()) as Tier);

  // Add savedPublishedState to track the persisted published status
  const [savedPublishedState, setSavedPublishedState] = useState<boolean>(
    tierObj?.published || false
  );

  const [selectedFeatureIds, setSelectedFeatureIds] = useState<Set<string>>(new Set<string>());
  const [versionedAttributesChanged, setVersionedAttributesChanged] = useState(false);
  const [tierSubscriberCount, setTierSubscriberCount] = useState(0);
  const [currentRevisionSubscriberCount, setCurrentRevisionSubscriberCount] = useState(0);
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
            featureIds: Array.from(selectedFeatureIds)
          },
          "tier"
        );
      } else {
        savedTier = await updateTier(tier.id as string, tier, Array.from(selectedFeatureIds));
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

      subscriberCount(tier.id, tier.revision).then(setCurrentRevisionSubscriberCount);
    }
  }, [tier.id, tier.revision]);

  useEffect(() => {
    if (tier && tierObj) {
      if (tierObj.published === true && Number(tierObj.price) !== Number(tier.price)) {
        setVersionedAttributesChanged(true);
      }
      // shouldCreateNewVersion(tierObj as Tier, tier).then(ret => {
      // 	setVersionedAttributesChanged(ret);
      // });
    }
  }, [tier, tierObj]);

  const canPublishDisabled =
    tier.checkoutType === "gitwallet" ? !canPublish || canPublishLoading : false;

  return (
    <>
      <div className="flex flex-col gap-6 md:col-span-2">
        <div className="flex w-full justify-between">
          <PageHeader
            title={formTitle}
            backLink={{
              href: "/tiers",
              title: "Packages"
            }}
            status={{
              title: tier.id && savedPublishedState ? "Published" : "Draft",
              variant: tier.id && savedPublishedState ? "success" : "secondary"
            }}
            actions={[
              <TierLinkCopier
                key="copy-tier-link"
                tier={tier}
                savedPublishedState={savedPublishedState}
              />
            ]}
          />
        </div>
      </div>

      <Separator className="mb-2 mt-6 hidden lg:block" />

      {!canPublish && !canPublishLoading && (
        <Alert variant="warning" className="my-4">
          <AlertTriangle size={18} className="mr-2.5" />
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div>
              <AlertTitle>Payment Setup Required</AlertTitle>
              <AlertDescription>
                You need to connect your Stripe account to publish a package. Once connected,
                you&apos;ll be able to publish packages and start accepting payments from customers.
              </AlertDescription>
            </div>
            <Button variant="outline" className="w-fit" asChild>
              <Link href="/settings/payment">Connect Stripe</Link>
            </Button>
          </div>
        </Alert>
      )}
      <div className="mt-6 flex flex-col gap-10 pb-20 lg:flex-row">
        {/* Mobile Tabs - Only visible on screens smaller than lg breakpoint */}
        <div className="mb-6 w-full lg:hidden">
          <Tabs defaultValue="details">
            <TabsList variant="background" className="w-full">
              <TabsTrigger variant="background" value="details" className="flex-1">
                Details
              </TabsTrigger>
              <TabsTrigger variant="background" value="preview" className="flex-1">
                Preview
              </TabsTrigger>
            </TabsList>

            {/* Details Tab Content - Form Fields */}
            <TabsContent value="details" className="mt-8">
              <div className="flex w-full flex-col gap-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-x-4 gap-y-3">
                    <Switch
                      id="mobile-published"
                      checked={tier.published}
                      disabled={canPublishLoading || !canPublish || canPublishDisabled}
                      data-cy="available-for-sale"
                      onCheckedChange={(checked) => {
                        setTier({
                          ...tier,
                          published: checked === true
                        } as Tier);
                      }}
                      label="This package is available for sale"
                    />
                    {canPublishLoading && (
                      <div className="flex items-center gap-1.5 text-xxs font-semibold text-stone-500">
                        <Spinner />
                        Checking Stripe connection...
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-stone-500">
                    {tier.published ? (
                      <>
                        This package will be visible and purchasable by customers. Changes will
                        create a new version.
                      </>
                    ) : (
                      "This package will remain hidden from customers on all channels."
                    )}
                  </p>
                </div>

                <Separator className="my-2" />

                <div>
                  <NewVersionCallout
                    tierHasSubscribers={tierHasSubscribers}
                    versionedAttributesChanged={versionedAttributesChanged}
                    featuresChanged={featuresChanged}
                  />
                  <Label htmlFor="mobile-tierName" className="mb-2">
                    Name
                  </Label>
                  <Input
                    id="mobile-tierName"
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
                  <Label htmlFor="mobile-tierTagline" className="mb-2 block">
                    Tagline
                  </Label>
                  <Input
                    id="mobile-tierTagline"
                    placeholder="Great for startups and smaller companies."
                    required
                    name="tagline"
                    value={tier.tagline || ""}
                    onChange={(e) => handleInputChange("tagline", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="mobile-tierDescription" className="mb-2 block">
                    Description
                  </Label>
                  <Textarea
                    id="mobile-tierDescription"
                    rows={4}
                    placeholder="Describe your package here. This is for your own use and will not be shown to any potential customers."
                    name="description"
                    value={tier.description || ""}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                </div>
                {hasActiveFeatures && (
                  <div>
                    <Label htmlFor="mobile-features" className="mb-3 block">
                      Features
                    </Label>
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
                  </div>
                )}

                <Separator className="my-2" />

                <div>
                  <Label htmlFor="mobile-checkoutType" className="mb-3">
                    Checkout Type
                  </Label>
                  <CheckoutTypeSelectionInput
                    user={user}
                    tier={tier}
                    handleInputChange={handleInputChange}
                    idPrefix="mobile-"
                  />
                </div>
                {tier.checkoutType === "gitwallet" && (
                  <StandardCheckoutForm
                    tier={tier}
                    contracts={contracts}
                    handleTierDataChange={handleInputChange}
                    idPrefix="mobile-"
                  />
                )}

                <Separator className="my-2" />

                <div>
                  <Label htmlFor="channels" className="mb-3 block">
                    Channels
                  </Label>
                  <ChannelsSelectionInput
                    userIsMarketExpert={!!user.marketExpertId}
                    selectedChannels={tier.channels}
                    idPrefix="mobile-"
                    handleInputChange={(channel) => {
                      let channels: Channel[] = tier.channels;
                      if (channels.includes(channel)) {
                        channels = channels.filter((c) => c !== channel);
                      } else {
                        channels = [...channels, channel];
                      }

                      setTier({
                        ...tier,
                        channels
                      });
                    }}
                  />
                </div>

                <Separator className="my-2" />

                {tier.checkoutType === "gitwallet" && (
                  <div>
                    <Label htmlFor="mobile-versionHistory" className="mb-2">
                      Package Version History
                    </Label>

                    {!!versions && versions.length === 0 && (
                      <p className="text-xs text-stone-500">
                        {tier.name} has{" "}
                        {currentRevisionSubscriberCount === 0
                          ? "no customers yet"
                          : currentRevisionSubscriberCount + " customers"}
                        . If you make any price or feature changes for a package that has customers,
                        your changes to the previous package will be kept as a package version.
                        Customers will be charged what they originally purchased.
                      </p>
                    )}

                    {!!versions && versions.length > 0 && (
                      <>
                        <Card>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Created</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Customers</TableHead>
                                <TableHead>Features</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell>
                                  {tier.createdAt.toDateString()}
                                  <Badge variant="success" size="sm" className="ml-1">
                                    Current
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  ${tier.price}
                                  {tier.cadence ? `/${tier.cadence}` : ""}
                                </TableCell>
                                <TableCell>{currentRevisionSubscriberCount}</TableCell>
                                <TableCell>
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
                              </TableRow>
                              {versions.map((version) => (
                                <TierVersionRow tierVersion={version} key={version.id} />
                              ))}
                            </TableBody>
                          </Table>
                        </Card>

                        <p className="my-6 text-xs text-stone-500">
                          Please note that package versions are only recorded when you make feature
                          or price changes to a package where you have existing customers. Customers
                          will be charged what they originally purchased.
                        </p>
                      </>
                    )}
                  </div>
                )}
                <Button disabled={isSaving || isDeleting} loading={isSaving} onClick={onSubmit}>
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
                          This package can be deleted as it has no active customers or features.
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
              <TierCard
                tier={{ ...tier, published: savedPublishedState }}
                features={featureObjs}
                buttonDisabled={newRecord}
                hasActiveFeatures={hasActiveFeatures}
                className="shadow-border-md mx-auto w-full max-w-[300px]"
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="hidden w-full flex-col gap-6 lg:flex lg:max-w-xl">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-x-4 gap-y-3">
              <Switch
                id="mobile-published"
                checked={tier.published}
                disabled={canPublishLoading || !canPublish || canPublishDisabled}
                data-cy="available-for-sale"
                onCheckedChange={(checked) => {
                  setTier({
                    ...tier,
                    published: checked === true
                  } as Tier);
                }}
                label="This package is available for sale"
              />
              {canPublishLoading && (
                <div className="flex items-center gap-1.5 text-xxs font-semibold text-stone-500">
                  <Spinner />
                  Checking Stripe connection...
                </div>
              )}
            </div>
            <p className="text-xs text-stone-500">
              {tier.published ? (
                <>
                  This package will be visible and purchasable by customers. Changes will create a
                  new version. <br />
                </>
              ) : (
                "This package will remain hidden from customers on all channels."
              )}
            </p>
          </div>

          <Separator className="my-2" />

          <div>
            <NewVersionCallout
              tierHasSubscribers={tierHasSubscribers}
              versionedAttributesChanged={versionedAttributesChanged}
              featuresChanged={featuresChanged}
            />
            <Label htmlFor="tierName" className="mb-2">
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
            {errors["name"] ? <p className="text-sm text-stone-500">{errors["name"]}</p> : null}
          </div>
          <div>
            <Label htmlFor="tierTagline" className="mb-2 block">
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
            <Label htmlFor="tierDescription" className="mb-2 block">
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
              <Label htmlFor="features" className="mb-3 block">
                Features
              </Label>
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
            </div>
          )}

          <Separator className="my-2" />

          <div>
            <Label htmlFor="checkoutType" className="mb-3">
              Checkout Type
            </Label>
            <CheckoutTypeSelectionInput
              user={user}
              tier={tier}
              handleInputChange={handleInputChange}
              idPrefix=""
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
            <Label htmlFor="channels" className="mb-3 block">
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
                  channels
                });
              }}
            />
          </div>

          <Separator className="my-2" />

          {tier.checkoutType === "gitwallet" && (
            <div>
              <Label htmlFor="versionHistory" className="mb-2 block md:mb-1">
                Package Version History
              </Label>

              {!!versions && versions.length === 0 && (
                <p className="text-xs text-stone-500">
                  {tier.name} has{" "}
                  {currentRevisionSubscriberCount === 0
                    ? "no customers yet"
                    : currentRevisionSubscriberCount + " customers"}
                  . If you make any price or feature changes for a package that has customers, your
                  changes to the previous package will be kept as a package version. Customers will
                  be charged what they originally purchased.
                </p>
              )}

              {!!versions && versions.length > 0 && (
                <>
                  <p className="my-6 text-xs text-stone-500">
                    {tier.name} has{" "}
                    {currentRevisionSubscriberCount === 0
                      ? "no customers yet"
                      : currentRevisionSubscriberCount + " customers"}{" "}
                    for the most recent version. There are {versions.length} versions and{" "}
                    {tierSubscriberCount} customers across versions.
                  </p>
                  <Card className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Created</TableHead>
                          <TableHead>Features</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>#Customers</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            {tier.createdAt.toDateString()}
                            <Badge variant="success" size="sm" className="ms-1">
                              Current
                            </Badge>
                          </TableCell>
                          <TableCell>
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
                          <TableCell>${tier.price}</TableCell>
                          <TableCell>{currentRevisionSubscriberCount}</TableCell>
                        </TableRow>
                        {versions.map((version) => (
                          <TierVersionRow tierVersion={version} key={version.id} />
                        ))}
                      </TableBody>
                    </Table>
                  </Card>

                  <p className="my-6 text-xs text-stone-500">
                    Please note that package versions are only recorded when you make feature or
                    price changes to a package where you have existing customers. Customers will be
                    charged what they originally purchased.
                  </p>
                </>
              )}
            </div>
          )}

          <Button disabled={isSaving || isDeleting} loading={isSaving} onClick={onSubmit}>
            {buttonLabel}
          </Button>
        </div>

        <div className="sticky top-20 mx-auto mb-auto hidden max-w-[300px] text-center lg:block">
          <TierCard
            tier={{ ...tier, published: savedPublishedState }}
            features={featureObjs}
            buttonDisabled={newRecord}
            hasActiveFeatures={hasActiveFeatures}
            className="w-[300px] shadow-border"
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
                    This package can be deleted as it has no active customers or features.
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
