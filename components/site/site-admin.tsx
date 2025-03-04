"use client";

import { Badge } from "@tremor/react";
import { Card } from "@/components/ui/card";
import CreatePageButton from "@/components/create-page-button";
import Pages from "@/components/pages";
import PageHeading from "@/components/common/page-heading";
import PrimaryButton from "@/components/common/link-button";
import { ExternalLinkChip } from "@/components/common/external-link";

import { formatDistanceToNow } from "date-fns";

import { getSiteAndPages } from "@/app/services/SiteService";
import { Page, Site } from "@prisma/client";
import { useEffect, useState } from "react";
import PreviewSection from "./preview-section";
import { getRootUrl } from "@/lib/domain";

type SiteData = Partial<Site> & {
  pages: Page[];
};

export default function SiteAdmin({ id }: { id: string }) {
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const getData = async () => {
        try {
          const data = await getSiteAndPages(id);
          const url = data?.subdomain
            ? getRootUrl(data.subdomain ?? "app")
            : "";

          setSiteData(data);
          setUrl(url);
        } catch (e) {
          console.error(e);
        }
      };
      getData();
    }
  }, []);

  const homepage =
    siteData?.pages?.find((page: Page) => page.id === siteData.homepageId) ??
    null;

  if (!siteData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <PageHeading title="Your Storefront" />

      <Card>
        <div className="flex w-full flex-col lg:flex-row lg:justify-between">
          <div className="absolute bottom-0 left-4 hidden lg:block">
            <PreviewSection
              content={homepage?.content ?? ""}
              width={280}
              height={220}
              screenWidth={1600}
              screenHeight={1250}
              className="rounded-t-lg border border-b-0"
            />
          </div>
          <div className="flex-column w-full lg:ms-[300px]">
            <div className="mb-4">
              <div className="mb-2 flex">
                <div className="flex items-center gap-2">
                  <strong className="me-2">Homepage</strong>
                  {homepage?.draft ? (
                    <Badge color="gray" size="xs">
                      Draft
                    </Badge>
                  ) : (
                    <Badge color="green" size="xs">
                      Live
                    </Badge>
                  )}
                </div>
              </div>
              <div className="mb-2 flex justify-start">
                {url ? <ExternalLinkChip href={url} label={url + " ↗"} /> : null}
              </div>

              <p className="text-sm text-stone-500 mt-2">
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
              <PrimaryButton label="Edit Homepage" href={`/page/${siteData.homepageId}`} />
            </div>
          </div>
        </div>
      </Card>
      
      <Card>
        <div className="flex w-full justify-between">
          <div className="flex flex-row">
            <strong>Other Pages</strong>
          </div>
          <div className="flex flex-row">
            <CreatePageButton />
          </div>
        </div>

        <div className="overflow-x-auto">
          {siteData.pages.length > 1 ? (
            <Pages
              pages={siteData.pages}
              url={url ?? ""}
              homepageId={siteData.homepageId ?? null}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full pt-6">
              <p className="text-lg text-stone-500">
                You do not have any other pages yet. Create more pages to start building your store.
              </p>
            </div>
          )}
        </div>
      </Card>
    </>
  );
}
