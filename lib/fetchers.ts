import prisma from "@/lib/prisma";

// @TODO: Perhaps these fn's should be in lib/site/fetchers.ts instead?
export async function getSiteData(domain: string) {
  const isDomain = domain.match(/\./);

  const site = await prisma.site.findUnique({
    where: isDomain ? { customDomain: domain } : { subdomain: domain },
    include: { 
      user: {
        select: {
          name: true,
          image: true,
          projectName: true,
          projectDescription: true,
        }
      },
    }
  });

  if (!site) {
    return null; // or handle the case where the site doesn't exist
  }

  // Now, get the homepage using the homepageId
  let homepage = null;
  if (site.homepageId) {
    homepage = await prisma.page.findUnique({
      where: { id: site.homepageId }
    });
  } else {
    homepage = await prisma.page.findFirst({
      where: {
        siteId: site.id,
      },
    });
  }
  return {
    ...site,
    homepage: homepage,
  };
}

export async function getSitePage(domain: string, slug: string | undefined) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

    const site = await prisma.site.findUnique({
      where: subdomain ? { subdomain } : { customDomain: domain },
      include: { 
        user: true,
        pages: {
          where: {
            slug: slug,
            draft: false,
          },
          take: 1
        }
      }
    });

    return {
      ...site
    };
}