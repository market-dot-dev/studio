import React from 'react';
import Link from "next/link";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import BlurImage from "@/components/blur-image";
import { placeholderBlurhash, toDateString } from "@/lib/utils";
import BlogCard from "@/components/blog-card";
import { getPostsForSite, getSiteData } from "@/lib/fetchers";
import Image from "next/image";
import { JSDOM } from "jsdom";
import componentsMap from '@/components/site';

type DynamicComponentProps = {
  tag: keyof JSX.IntrinsicElements;
  className?: string;
  children?: React.ReactNode;
};


const voidElements = [
  "area", 
  "base", 
  "br", 
  "col", 
  "embed", 
  "hr", 
  "img", 
  "input", 
  "link", 
  "meta", 
  "param", 
  "source", 
  "track", 
  "wbr"
];


const DynamicComponent: React.FC<DynamicComponentProps> = ({ tag, className, children }) => {
  const Tag = tag;
  return <Tag className={className}>{children}</Tag>;
};

// For recursively rendering elements
const renderElement = (element: Element, index : number): JSX.Element => {
  const tag = element.tagName.toLowerCase() as keyof JSX.IntrinsicElements;
  console.log(tag);
  // Check if the element is a custom component
  if (tag in componentsMap) {
    const CustomComponent = componentsMap[tag]['element'];
    return <CustomComponent key={index} />;
  }


  const className = element.className;

  // Check if the element is a void element
  if (voidElements.indexOf(tag) !== -1) {
    return <DynamicComponent tag={tag} className={className} key={index} />;
  }

  if (element.children.length > 0) {
    return (
      <DynamicComponent tag={tag} className={className} key={index}>
        
        {Array.from(element.children).map((child, index) => renderElement(child as Element, index as number))}
      </DynamicComponent>
    );
  } else {
    return <DynamicComponent tag={tag} className={className} key={index}>{element.textContent}</DynamicComponent>;
  }
};

export async function generateStaticParams() {
  const allSites = await prisma.site.findMany({
    select: {
      subdomain: true,
      customDomain: true,
    },
    // feel free to remove this filter if you want to generate paths for all sites
    where: {
      subdomain: "demo",
    },
  });

  const allPaths = allSites
    .flatMap(({ subdomain, customDomain }) => [
      subdomain && {
        domain: `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
      },
      customDomain && {
        domain: customDomain,
      },
    ])
    .filter(Boolean);

  return allPaths;
}



export default async function SiteHomePage({
  params,
}: {
  params: { domain: string };
}) {
  const domain = decodeURIComponent(params.domain);
  const [data, posts] = await Promise.all([
    getSiteData(domain),
    getPostsForSite(domain),
  ]);

  

  if (!data) {
    notFound();
  }

  const dom = new JSDOM(data.pages.length ? data.pages[0].content : '')
  const rootElement = dom.window.document.body.firstChild;
  const reactElement = renderElement(rootElement as Element, 0);
  
  return (
    <>
      {reactElement}
    </>
  );
}
