"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CreatePageButton from "@/components/create-page-button";
import Pages from "./pages";
import PageHeader from "@/components/common/page-header";
import { formatDistanceToNow } from "date-fns";
import { getSiteAndPages } from "@/app/services/SiteService";
import { Page, Site } from "@prisma/client";
import { useEffect, useState } from "react";
import PreviewSection from "../preview-section";
import { getRootUrl } from "@/lib/domain";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import SettingsDialog from "./settings-dialog";

type SiteData = Partial<Site> & {
  pages: Page[];
};

export default function SiteAdmin({ id }: { id: string }) {
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  const refreshSiteData = async () => {
    try {
      const data = await getSiteAndPages(id);
      const url = data?.subdomain
        ? getRootUrl(data.subdomain ?? "app")
        : "";

      setSiteData(data);
      setUrl(url);
    } catch (e) {
      console.error('Error loading site data:', e);
    }
  };

  useEffect(() => {
    if (id) refreshSiteData();
    
    window.addEventListener("focus", () => refreshSiteData());
    
    return () => {
      window.removeEventListener("focus", () => refreshSiteData());
    };
  }, [id]);

  const homepage =
    siteData?.pages?.find((page: Page) => page.id === siteData.homepageId) ??
    null;

  if (!siteData) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-8 sm:gap-10">
      <PageHeader
        title="Landing Page"
        actions={[
          url ? (
            <Button
              key="view-site"
              variant="secondary"
              className="text-stone-600"
              asChild
            >
              <Link href={url} target="_blank" rel="noopener noreferrer">
                {url} ↗
              </Link>
            </Button>
          ) : null,
          <SettingsDialog
            key="settings-dialog"
            site={siteData}
            handleSiteUpdate={refreshSiteData}
          />,
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
                      addSuffix: true,
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
              You do not have any other pages yet. Create more pages to start
              building your store.
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 