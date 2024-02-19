import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { Bold, Card, Badge, Text } from "@tremor/react";
import CreatePageButton from "@/components/create-page-button";
import Pages from "@/components/pages";
import PageHeading from "@/components/common/page-heading";
import PrimaryButton from "@/components/common/link-button";
import { ExternalLinkChip } from "@/components/common/external-link";
import DomainService from "@/app/services/domain-service";
import { formatDistanceToNow } from 'date-fns';

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

  // const url = `${siteData.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
  const url = DomainService.getRootUrl(siteData.subdomain ?? 'app');
  const homepage = siteData.pages.find((page) => page.id === siteData.homepageId);

  return (
    <>
      <div className="flex justify-between w-full">
        <div className="flex flex-row">
          <PageHeading title="Site Content" />
        </div>
        <div className="flex flex-row">
          <ExternalLinkChip href={url}>
            {url} ↗
          </ExternalLinkChip>
        </div>
      </div>

      <div className="my-2">&nbsp;</div>

      <Card>
        <div className="flex justify-between w-full">
          <div className="absolute bottom-0 left-4">
            <img src="https://www.gitwallet.co/site-preview.png" width={300} alt="Site Preview" />
          </div>
          <div className="flex-column ms-[300px]">

            <div className="mb-2">
            <Bold className="me-2">
              Site Homepage
            </Bold>

            {homepage?.draft ?
              <Badge color="gray" size="xs">Draft</Badge> :
              <Badge color="green" size="xs">Live</Badge>
            }
            </div>

            <div>
              <ExternalLinkChip href={url}>
                {url} ↗
              </ExternalLinkChip>
            </div>

            <Text className="mt-2">Title: {homepage?.title ?? "No Home Page Set"}</Text>
            <Text>Last Updated: {homepage?.updatedAt ? formatDistanceToNow(new Date(homepage.updatedAt), { addSuffix: true }) : 'Unknown'}</Text>
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
