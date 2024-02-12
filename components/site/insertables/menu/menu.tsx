'use client'

import { Flex } from "@tremor/react";

export default function Menu( { site, page, nav }: { site: any, page: any, nav: any[] } ) {
    const url = `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

    return (
        <Flex justifyContent="start" className="gap-4">
            {nav.map((page: any, index: number) => (
                <span key={index}>
                    <a href={
                        process.env.NEXT_PUBLIC_VERCEL_ENV !== 'development'
                            ? `https://${url}` + (page.id === site.homepageId ? '' : `/${page.slug}`)
                            : `http://${site.subdomain}.gitwallet.local:3000` + (page.id === site.homepageId ? '' : `/${page.slug}`)
                        } className="p-4 text-blue-800">{page.title}</a>
                </span>
            ))}
        </Flex>
    )
}