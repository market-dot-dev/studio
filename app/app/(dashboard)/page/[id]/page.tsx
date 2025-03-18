import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

import FullScreenSwitcher from "@/components/site/fullscreen-switcher";
import FeatureService from "@/app/services/feature-service";
import { getRootUrl } from "@/lib/domain";
import PageContainer from "@/components/site/page-container";

export default async function Page({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
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
        id: decodeURIComponent(params.id),
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

  const siteUrl = getRootUrl(data?.site?.subdomain ?? "app");
  const isHome = data.id === data.site?.homepageId;
  
  const getRelativeTimeString = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    
    // Less than a minute ago
    if (diffSecs < 60) {
      return "just now";
    }
    
    // Less than an hour ago
    if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? "min" : "mins"} ago`;
    }
    
    // Today but more than an hour ago
    if (
      now.getDate() === date.getDate() &&
      now.getMonth() === date.getMonth() &&
      now.getFullYear() === date.getFullYear()
    ) {
      return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
    }
    
    // Yesterday or beyond
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };
  
  const lastUpdateDate = getRelativeTimeString(new Date(data.updatedAt));

  return (
    <FullScreenSwitcher>
      <PageContainer
        site={data.site}
        page={data}
        siteUrl={siteUrl}
        homepageId={data.site?.homepageId || null}
        hasActiveFeatures={!!activeFeatures?.length}
        lastUpdateDate={lastUpdateDate}
      />
    </FullScreenSwitcher>
  );
}
