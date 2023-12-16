import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { Bold, Card, Divider } from "@tremor/react";

// import CreatePostButton from "@/components/create-post-button";
import CreatePageButton from "@/components/create-page-button";

import Pages from "@/components/pages";
import PageHeading from "@/components/common/page-heading";
import PrimaryButton from "@/components/common/primary-button";
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

  const linkToPreview = <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
    <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
      {/* <h1 className="w-60 truncate font-cal text-xl font-bold dark:text-white sm:w-auto sm:text-3xl">
  All Posts for {data.name}
</h1> */}
      <a
        href={process.env.NEXT_PUBLIC_VERCEL_ENV
          ? `https://${url}`
          : `http://${siteData.subdomain}.localhost:3000`}
        target="_blank"
        rel="noreferrer"
        className="truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
      >
        {url} ↗
      </a>
    </div>
  </div>;
  return (
    <>
      <div className="flex justify-between w-full">
        <div className="flex flex-row">
          <PageHeading title="Site Content" />
        </div>
        <div className="flex flex-row">
          {linkToPreview}
        </div>
      </div>
      <Bold>
        Your Home Page
      </Bold>

      <Card>
        <div className="flex justify-between w-full">
          <div className="flex-column">
            <div>
              {siteData.pages.find((page) => page.id === siteData.homepageId)?.title ?? "No Home Page Set"}
            </div>

            <div>
              Path: /
              {siteData.pages.find((page) => page.id === siteData.homepageId)?.slug ?? "No Home Page Set"}
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
