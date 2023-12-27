import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { Bold, Card, Badge, Grid } from "@tremor/react";


// import CreatePostButton from "@/components/create-post-button";
import CreatePageButton from "@/components/create-page-button";

import Pages from "@/components/pages";
import PageHeading from "@/components/common/page-heading";
import PrimaryButton from "@/components/common/primary-button";
import ExternalLink, { ExternalLinkChip } from "@/components/common/external-link";

export default async function SitePosts({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const siteData = await prisma.site.findUnique({
    where: {
      id: decodeURIComponent(params.id),
    },
    include: {
      pages: true
    },
  });


  if (!siteData || siteData.userId !== session.user.id) {
    notFound();
  }

  const url = `${siteData.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
  const homepage = siteData.pages.find((page) => page.id === siteData.homepageId);

  return (
    <>
      <div className="flex justify-between w-full">
        <div className="flex flex-row">
          <PageHeading title="Site Content" />
        </div>
        <div className="flex flex-row">
          <ExternalLink subdomain={siteData.subdomain ?? ''} url={url} />
        </div>
      </div>
      
      <Bold>
        Your Home Page
      </Bold>

      <Card>
        <div className="flex justify-between w-full">
          <div className="flex-column">
            <div>
              Title: {homepage?.title ?? "No Home Page Set"}
            </div>

            <div>
              Status: 
            {homepage?.draft ? 
								<Badge color="gray" size="xs">Draft</Badge> :
								<Badge color="green" size="xs">Live</Badge>
                }
            </div>

            <div>
              Path: 
            {homepage?.slug}
            </div>

            <div>
              Preview:
              <ExternalLinkChip href={`/${url}/index`}>
                localhost
              </ExternalLinkChip>
              <ExternalLink subdomain={siteData.subdomain ?? ''}  url={url} />
            </div>

          </div>
          <div className="flex flex-row">
            <PrimaryButton label="Edit" href={`/page/${siteData.homepageId}`} />
          </div>
        </div>
      </Card>

      <div className="flex justify-between w-full">
        <div className="flex flex-row">
          <Bold>All Pages</Bold>
        </div>
        <div className="flex flex-row">
          <CreatePageButton />
        </div>
      </div>

      <Pages pages={siteData.pages} subdomain={siteData.subdomain} homepageId={siteData.homepageId ?? null} />
    </>
  );
}
