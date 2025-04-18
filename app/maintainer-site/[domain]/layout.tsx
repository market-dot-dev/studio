import { getRootUrl } from "@/lib/domain";
import { getSiteData } from "@/lib/fetchers";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ReactNode } from "react";

export async function generateMetadata(props: {
  params: Promise<{ domain: string }>;
}): Promise<Metadata | null> {
  const params = await props.params;
  const domain = decodeURIComponent(params.domain);
  const data = await getSiteData(domain);
  if (!data) {
    return null;
  }
  const image = getRootUrl(data?.subdomain ?? "app", `/api/og/${data.id}`);

  const { logo, user } = data as {
    image: string;
    logo: string;
    user: {
      projectName: string;
      projectDescription: string;
    };
  };

  const { projectName: title, projectDescription: description } = user as {
    projectName: string;
    projectDescription: string;
  };

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
    icons: [logo],
    metadataBase: new URL(`https://${domain}`)
    // Optional: Set canonical URL to custom domain if it exists
    // ...(params.domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
    //   data.customDomain && {
    //     alternates: {
    //       canonical: `https://${data.customDomain}`,
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
  const data = await getSiteData(domain);

  if (!data) {
    notFound();
  }

  // Optional: Redirect to custom domain if it exists
  if (
    domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
    data.customDomain &&
    process.env.REDIRECT_TO_CUSTOM_DOMAIN_IF_EXISTS === "true"
  ) {
    return redirect(`https://${data.customDomain}`);
  }

  return <>{children}</>;
}
