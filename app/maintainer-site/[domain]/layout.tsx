import { getHomepage } from "@/app/services/page-service";
import { getRootUrl } from "@/lib/domain";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ReactNode } from "react";

export async function generateMetadata(props: {
  params: Promise<{ domain: string }>;
}): Promise<Metadata | null> {
  const params = await props.params;
  const domain = decodeURIComponent(params.domain);
  const { site, page } = await getHomepage(domain);

  if (!site) {
    return null;
  }

  const image = getRootUrl(site.subdomain ?? "app", `/api/og/${site.id}`);

  const { logo } = site;
  const { name, projectName, projectDescription } = site.organization || {};

  const title = projectName || name || "Site";
  const description = projectDescription || "";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@vercel"
    },
    ...[logo ? { icons: [logo] } : {}],
    metadataBase: new URL(`https://${domain}`)
    // Optional: Set canonical URL to custom domain if it exists
    // ...(params.domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
    //   site.customDomain && {
    //     alternates: {
    //       canonical: `https://${site.customDomain}`,
    //     },
    //   }),
  };
}

export default async function SiteLayout(props: {
  params: Promise<{ domain: string }>;
  children: ReactNode;
}) {
  const params = await props.params;
  const { children } = props;

  const domain = decodeURIComponent(params.domain);
  const { site, page } = await getHomepage(domain);

  if (!site) {
    notFound();
  }

  // Optional: Redirect to custom domain if it exists
  if (
    domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
    site.customDomain &&
    process.env.REDIRECT_TO_CUSTOM_DOMAIN_IF_EXISTS === "true"
  ) {
    return redirect(`https://${site.customDomain}`);
  }

  return <>{children}</>;
}
