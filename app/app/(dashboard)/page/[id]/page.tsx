import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

import PageEditor from "@/components/page-editor";
import PageHeading from "@/components/common/page-heading";
import ExternalLink from "@/components/common/external-link";

export default async function PagePage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const data = await prisma.page.findUnique({
    where: {
      id: decodeURIComponent(params.id),
    },
    include: {
      site: {
        select: {
          id: true,
          subdomain: true,
          homepageId: true
        },
      },
    },
  });


    if (!data || data.userId !== session.user.id) {
    notFound();
  }
  
  return (
    <>
     <div className="flex justify-between w-full">
        <div className="flex flex-row">
          <PageHeading title="Edit Page" />
        </div>
        <div className="flex flex-row">
        </div>
      </div>


    <PageEditor siteId={data?.site?.id ?? ''} page={data} subdomain={data?.site?.subdomain ?? null} homepageId={ data.site?.homepageId || null} />
    </>
  )
}
