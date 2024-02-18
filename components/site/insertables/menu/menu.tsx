'use client'

import DomainService from "@/app/services/domain-service";
import { Flex } from "@tremor/react";

export default function Menu( { site, page, nav }: { site: any, page: any, nav: any[] } ) {
    // const url = `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
    const url = DomainService.getRootUrl(site.subdomain ?? 'app', page.id === site.homepageId ? '' : `/${page.slug}`);

    return (
        <Flex justifyContent="start" className="gap-4">
            {nav.map((page: any, index: number) => (
                <span key={index}>
                    <a href={ url } className="p-4 text-blue-800">{page.title}</a>
                </span>
            ))}
        </Flex>
    )
}