import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

import PageEditor from "@/components/page-editor";

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
          subdomain: true,
          homepageId: true
        },
      },
    },
  });

  console.log('page', data);

    if (!data || data.userId !== session.user.id) {
    notFound();
  }
  
  return (
    <PageEditor siteId={params.id} page={data} isHome={ data.site?.homepageId === data.id} />
  )
}
