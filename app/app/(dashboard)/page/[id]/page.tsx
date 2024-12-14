import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

import PageEditor from "@/components/site/page-editor";
import PageHeading from "@/components/common/page-heading";
import DomainServices from "@/app/services/domain-service";
import FullScreenSwitcher from "@/components/site/fullscreen-switcher";
import FeatureService from "@/app/services/feature-service";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const id = (await params).id;

  // const data = await prisma.page.findUnique({
  // 	where: {
  // 		id: decodeURIComponent(params.id),
  // 	},
  // 	include: {
  // 		site: {
  // 			select: {
  // 				id: true,
  // 				name: true,
  // 				description: true,
  // 				subdomain: true,
  // 				homepageId: true,
  // 				user: {
  // 					select: {
  // 						name: true,
  // 						image: true,
  // 						projectName: true,
  // 						projectDescription: true,
  // 					}
  // 				}
  // 			},
  // 		},
  // 	},
  // });

  // const activeFeatures = await FeatureService.findActiveByCurrentUser();

  const [data, activeFeatures] = await Promise.all([
    prisma.page.findUnique({
      where: {
        id: decodeURIComponent(id),
      },
      include: {
        site: {
          select: {
            id: true,
            name: true,
            description: true,
            subdomain: true,
            homepageId: true,
            user: {
              select: {
                name: true,
                image: true,
                projectName: true,
                projectDescription: true,
              },
            },
          },
        },
      },
    }),
    FeatureService.findActiveByCurrentUser(),
  ]);

  if (!data || data.userId !== session.user.id) {
    notFound();
  }

  const siteUrl = DomainServices.getRootUrl(data?.site?.subdomain ?? "app");

  return (
    <FullScreenSwitcher>
      <div className="flex w-full justify-between">
        <div className="flex flex-row">
          <PageHeading
            title={"Edit Page" + (data?.title ? ": " + data.title : "")}
          />
        </div>
        <div className="flex flex-row"></div>
      </div>

      <PageEditor
        site={data?.site}
        page={data}
        siteUrl={siteUrl}
        homepageId={data.site?.homepageId || null}
        hasActiveFeatures={!!activeFeatures?.length}
      />
    </FullScreenSwitcher>
  );
}
