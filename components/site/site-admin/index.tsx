"use client";

import { Page, Site } from "@/app/generated/prisma";
import { getSiteAndPages, updateCurrentSite } from "@/app/services/site/site-crud-service";
import PageHeader from "@/components/common/page-header";
import CreatePageButton from "@/components/create-page-button";
import Uploader from "@/components/form/uploader";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getRootUrl } from "@/lib/domain";
import { isGitWalletError } from "@/lib/errors";
import * as Sentry from "@sentry/nextjs";
import { formatDistanceToNow } from "date-fns";
import { Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PreviewSection from "../preview-section";
import Pages from "./pages";

type SiteData = Partial<Site> & {
  pages: Page[];
};

export default function SiteAdmin({ id }: { id: string }) {
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [changed, setChanged] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const router = useRouter();

  // Function to refresh site data
  const refreshSiteData = async () => {
    try {
      const data = await getSiteAndPages(id);
      const url = data?.subdomain ? getRootUrl(data.subdomain ?? "app") : "";

      setSiteData(data);
      setUrl(url);
    } catch (e) {
      console.error("Error loading site data:", e);
    }
  };

  // Load site data on mount and when router changes
  useEffect(() => {
    if (id) {
      refreshSiteData();
    }

    // Set up event listener for focus to refresh data
    const handleFocus = () => {
      refreshSiteData();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [id]);

  const handleSubmitSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    // if not changed, remove the logo from the form data
    if (!changed) {
      formData.delete("logo");
    }
    try {
      await updateCurrentSite(formData);
      setChanged(false);
      toast.success("Store updated");
      setSettingsOpen(false);
      refreshSiteData();
    } catch (error) {
      if (isGitWalletError(error)) {
        toast.error(error.message);
      } else {
        console.error(error);
        Sentry.captureException(error);
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const homepage = siteData?.pages?.find((page: Page) => page.id === siteData.homepageId) ?? null;

  if (!siteData) {
    return <div>Loading...</div>;
  }

  const siteURL = `https://` + siteData.subdomain + `.market.dev`;

  return (
    <div className="flex flex-col gap-8 sm:gap-10">
      <PageHeader
        title="Landing Pages"
        actions={[
          url ? (
            <Button key="view-site" variant="secondary" className="text-stone-600" asChild>
              <Link href={url} target="_blank" rel="noopener noreferrer">
                {url} ↗
              </Link>
            </Button>
          ) : null,
          <Dialog key="settings-dialog" open={settingsOpen} onOpenChange={setSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="size-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="p-0">
              <DialogHeader className="px-6 pt-6">
                <DialogTitle>Storefront Settings</DialogTitle>
              </DialogHeader>
              <ScrollArea>
                <form
                  id="site-settings-form"
                  onSubmit={handleSubmitSettings}
                  className="space-y-6 px-6 pb-3 pt-2"
                >
                  <div className="flex w-full flex-col items-start gap-2">
                    <div>
                      <Label htmlFor="subdomain" className="mb-1">
                        Subdomain
                      </Label>
                      <p className="text-xs text-stone-500">
                        Your store will appear at{" "}
                        <Link className="underline" href={siteURL}>
                          {siteURL}.
                        </Link>
                      </p>
                    </div>
                    <Input
                      placeholder="Your subdomain"
                      name="subdomain"
                      id="subdomain"
                      defaultValue={siteData.subdomain ?? ""}
                    />
                  </div>
                  <div className="flex w-full flex-col items-start gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      placeholder="Your store title"
                      name="name"
                      id="name"
                      defaultValue={siteData.name ?? ""}
                    />
                  </div>
                  <div className="flex w-full flex-col items-start gap-2">
                    <div>
                      <Label htmlFor="logo" className="mb-1">
                        Logo
                      </Label>
                      <p className="text-xs text-stone-500">
                        Your store logo is used in your web storefront, for favicons and Open Graph
                        images.
                      </p>
                    </div>
                    <Uploader
                      defaultValue={siteData.logo ?? null}
                      name="logo"
                      setChanged={setChanged}
                    />
                  </div>
                </form>
              </ScrollArea>
              <DialogFooter className="px-6 pb-6">
                <Button
                  type="submit"
                  form="site-settings-form"
                  loading={isSaving}
                  loadingText="Saving"
                >
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ].filter(Boolean)}
      />

      <Card className="relative p-6 pt-5 lg:mt-9">
        <div className="flex w-full flex-col lg:flex-row lg:justify-between">
          <div className="absolute bottom-0 left-4 hidden lg:block">
            <PreviewSection
              content={homepage?.content ?? ""}
              width={250}
              height={200}
              screenWidth={1600}
              screenHeight={1280}
              className="rounded-t-md border border-b-0"
            />
          </div>
          <div className="flex-column w-full lg:ms-[calc(250px+16px+8px)]">
            <div className="mb-4">
              <div className="mb-2 flex">
                <div className="flex items-center gap-2">
                  <strong>Homepage</strong>
                  {homepage?.draft ? (
                    <Badge variant="secondary" size="sm">
                      Draft
                    </Badge>
                  ) : (
                    <Badge variant="success" size="sm">
                      Live
                    </Badge>
                  )}
                </div>
              </div>

              <p className="mt-2 text-sm text-stone-500">
                Title: {homepage?.title ?? "No Home Page Set"}
              </p>
              <p className="text-sm text-stone-500">
                Last Updated:{" "}
                {homepage?.updatedAt
                  ? formatDistanceToNow(new Date(homepage.updatedAt), {
                      addSuffix: true
                    })
                  : "Unknown"}
              </p>
            </div>
            <div className="mt-auto">
              <Link
                href={`/page/${siteData.homepageId}`}
                className={buttonVariants({ variant: "outline" })}
              >
                Edit Homepage
              </Link>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex flex-col gap-4">
        <div className="flex w-full items-center justify-between">
          <h3 className="text-xl font-bold text-stone-800">Pages</h3>
          <CreatePageButton />
        </div>

        <div>
          {siteData.pages.length > 1 ? (
            <Pages
              pages={siteData.pages}
              url={url ?? ""}
              homepageId={siteData.homepageId ?? null}
            />
          ) : (
            <p className="text-sm text-stone-500">
              You do not have any other pages yet. Create more pages to start building your store.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
