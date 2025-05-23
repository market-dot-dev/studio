"use client";

import { AlertTriangle, Info, MoreVertical, ShieldBan } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import ChannelsSelectionInput from "./channels-selection-input";
import CheckoutTypeSelectionInput from "./checkout-type-selection-input";
import TierCard from "./tier-card";

import Tier, { newTier } from "@/app/models/Tier";
import { getSubscriberCount } from "@/app/services/subscription-service";
import { createTier, TierWithCount, updateTier } from "@/app/services/tier-service";
import { toast } from "sonner";

import { hasVendorStripeAccount } from "@/app/services/stripe-vendor-service";
import { getVersionsByTierId } from "@/app/services/tier-version-service";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Channel, Contract, TierVersion, User } from "@prisma/client";
import StandardCheckoutForm from "./standard-checkout-form";
import { TierDeleteMenuItem } from "./tier-delete-menu-item";
import { TierDuplicateMenuItem } from "./tier-duplicate-menu-item";
import TierLinkCopier from "./tier-link-copier";
import TierVersionNotice from "./tier-version-notice";
import TierVersionRow from "./tier-version-row";

interface TierFormProps {
  tier?: Partial<Tier>;
  contracts: Contract[];
  user: User;
}

export default function TierForm({ tier: tierObj, contracts, user }: TierFormProps) {
  const router = useRouter();
  const [tier, setTier] = useState<TierWithCount>((tierObj ? tierObj : newTier()) as Tier);

  const [savedPublishedState, setSavedPublishedState] = useState<boolean>(
    tierObj?.published || false
  );

  const [versionedAttributesChanged, setVersionedAttributesChanged] = useState(false);
  const [tierSubscriberCount, setTierSubscriberCount] = useState(0);
  const [currentRevisionSubscriberCount, setCurrentRevisionSubscriberCount] = useState(0);
  const [versions, setVersions] = useState<TierVersion[]>([]);

  const newRecord = !tier?.id;

  const formTitle = newRecord ? "Create New Package" : tier.name;
  const buttonLabel = newRecord ? "Create Package" : "Save Changes";

  const [errors, setErrors] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
      } else {
        savedTier = await updateTier(tier.id as string, tier);
      }
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
      if (window && Object.prototype.hasOwnProperty.call(window, "refreshOnboarding")) {
        (window as any).refreshOnboarding();
      }
    }

    if (tier.checkoutType === "gitwallet") {
      hasVendorStripeAccount().then((value: boolean) => {
        setCanPublish(value);
        setCanPublishLoading(false);
      });
    } else {
      setCanPublish(true);
      setCanPublishLoading(false);
    }
  }, [tier.checkoutType, tierObj]);

  useEffect(() => {
    if (tier.id) {
      getVersionsByTierId(tier.id).then(setVersions);
      getSubscriberCount(tier.id).then(setTierSubscriberCount);
      getSubscriberCount(tier.id, tier.revision).then(setCurrentRevisionSubscriberCount);
    }
  }, [tier.id, tier.revision]);

  useEffect(() => {
    if (tier && tierObj) {
      if (tierObj.published === true && Number(tierObj.price) !== Number(tier.price)) {
        setVersionedAttributesChanged(true);
      }
    }
  }, [tier, tierObj]);

  const canPublishDisabled =
    tier.checkoutType === "gitwallet" ? !canPublish || canPublishLoading : false;

  return (
    <div className="flex flex-col gap-6 md:col-span-2">
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
          />,
          !newRecord && (
            <DropdownMenu key="tier-actions-dropdown">
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" data-cy="tier-actions-dropdown-trigger">
                  <MoreVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <TierDuplicateMenuItem tierId={tier.id as string} />
                <TierDeleteMenuItem
                  tierId={tier.id as string}
                  canDelete={
                    (tier._count?.Charge || 0) === 0 && (tier._count?.subscriptions || 0) === 0
                  }
                  onConfirm={() => setIsDeleting(true)}
                  onSuccess={() => {
                    setIsDeleting(false);
                    toast.success(`"${tier.name}" deleted`);
                    router.push("/tiers");
                  }}
                  onError={(error: Error) => {
                    setIsDeleting(false);
                    toast.error(`Failed to delete package: ${error.message}`);
                    console.error("Error deleting tier:", error);
                  }}
                />
                <div className="-mx-2 -mb-2 mt-1 flex items-start gap-2.5 bg-stone-50 py-3 pl-[17px] pr-4 text-xs text-muted-foreground">
                  {(tier._count?.Charge || 0) === 0 && (tier._count?.subscriptions || 0) === 0 ? (
                    <>
                      <Info size={14} strokeWidth={2.25} className="my-px shrink-0" />
                      Once this package has customers, you won't be able to delete it.
                    </>
                  ) : (
                    <>
                      <ShieldBan size={14} strokeWidth={2.25} className="my-px shrink-0" />
                      This package already has customers, so it can't be deleted.
                    </>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        ].filter(Boolean)}
      />

      <Separator className="hidden lg:block" />

      {!canPublish && !canPublishLoading && (
        <Alert variant="destructive">
          <AlertTriangle size={18} className="mr-2.5" />
          <div className="flex w-full flex-col gap-4 md:flex-row md:items-center">
            <div className="w-full">
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

      <div className="flex flex-col gap-10 pb-20 lg:mt-2 lg:flex-row ">
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
            <TabsContent value="details" className="mt-7 lg:mt-8">
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
                  <TierVersionNotice
                    tierHasSubscribers={currentRevisionSubscriberCount > 0}
                    versionedAttributesChanged={versionedAttributesChanged}
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
                        . If you make any price changes for a package that has customers, your
                        changes to the previous package will be kept as a package version. Customers
                        will be charged what they originally purchased.
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
                              </TableRow>
                              {versions.map((version) => (
                                <TierVersionRow tierVersion={version} key={version.id} />
                              ))}
                            </TableBody>
                          </Table>
                        </Card>

                        <p className="my-6 text-xs text-stone-500">
                          Please note that package versions are only recorded when you make price
                          changes to a package where you have existing customers. Customers will be
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
            </TabsContent>

            <TabsContent value="preview">
              <TierCard
                tier={{ ...tier, published: savedPublishedState }}
                buttonDisabled={newRecord}
                className="mx-auto w-full max-w-[300px] shadow-border-md"
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="hidden w-full flex-col gap-6 lg:flex lg:max-w-xl">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-x-4 gap-y-3">
              <Switch
                id="desktop-published"
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
            <TierVersionNotice
              tierHasSubscribers={currentRevisionSubscriberCount > 0}
              versionedAttributesChanged={versionedAttributesChanged}
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
                  . If you make any price changes for a package that has customers, your changes to
                  the previous package will be kept as a package version. Customers will be charged
                  what they originally purchased.
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
                          <TableHead>Price</TableHead>
                          <TableHead>Customers</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            {tier.createdAt ? new Date(tier.createdAt).toDateString() : "Current"}
                            <Badge variant="success" size="sm" className="ml-1">
                              Current
                            </Badge>
                          </TableCell>
                          <TableCell>
                            ${tier.price}
                            {tier.cadence ? `/${tier.cadence}` : ""}
                          </TableCell>
                          <TableCell>{currentRevisionSubscriberCount}</TableCell>
                        </TableRow>
                        {versions.map((version) => (
                          <TierVersionRow tierVersion={version} key={version.id} />
                        ))}
                      </TableBody>
                    </Table>
                  </Card>

                  <p className="my-6 text-xs text-stone-500">
                    Please note that package versions are only recorded when you make price changes
                    to a package where you have existing customers. Customers will be charged what
                    they originally purchased.
                  </p>

                  <Separator className="my-2" />
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
            buttonDisabled={newRecord}
            className="w-[300px] shadow-border"
          />
        </div>
      </div>
    </div>
  );
}
