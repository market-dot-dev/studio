import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

import { requireUserSession } from "@/app/services/user-context-service";
import FullScreenSwitcher from "@/components/site/fullscreen-switcher";
import PageContainer from "@/components/site/page-container";
import { getRootUrl } from "@/lib/domain";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await requireUserSession();

  const data = await prisma.page.findUnique({
    where: {
      id: decodeURIComponent(params.id)
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
              projectDescription: true
            }
          }
        }
      }
    }
  });

  if (!data || data.userId !== user.id) {
    notFound();
  }

  const siteUrl = getRootUrl(data?.site?.subdomain ?? "app");

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

    // Check if it was yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (
      yesterday.getDate() === date.getDate() &&
      yesterday.getMonth() === date.getMonth() &&
      yesterday.getFullYear() === date.getFullYear()
    ) {
      return "yesterday";
    }

    // Beyond yesterday
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
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
        lastUpdateDate={lastUpdateDate}
      />
    </FullScreenSwitcher>
  );
}
