'use client'

import { Bold } from "@tremor/react";
import CreatePageButton from "@/components/create-page-button";
import Pages from "@/components/pages";
import PageHeading from "@/components/common/page-heading";
import { ExternalLinkChip } from "@/components/common/external-link";

import { getSiteAndPages } from "@/app/services/SiteService";
import { getRootUrl } from "@/app/services/domain-service";
import { Page, Site } from "@prisma/client";
import { useEffect, useState } from "react";
import SiteHomepagePreview from "../dashboard/site-homepage-preview";

type SiteData = Partial<Site> & {
    pages: Page[];
  };

export default function SiteAdmin({id} : { id: string}) {

    const [siteData, setSiteData] = useState<SiteData | null>(null);
    const [url, setUrl] = useState<string | null>(null);

    useEffect(() => {
        if(id) {
            const getData = async () => {
                try {
                    const data = await getSiteAndPages(id);
                    const url = data?.subdomain ? await getRootUrl(data.subdomain ?? 'app') : '';
                    setSiteData(data);
                    setUrl(url)
                } catch (e) {
                    console.error(e);
                }
            }
            getData();
        }
    }, [])

    const homepage = siteData?.pages?.find((page : Page) => page.id === siteData.homepageId) ?? null;
    
    if(!siteData) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    return (
        <>
            <div className="flex justify-between w-full">
                <div className="flex flex-row">
                    <PageHeading title="Site Content" />
                </div>
                <div className="flex flex-row">
                    { url ? <ExternalLinkChip href={url} label={url + ' ↗'} /> : null }
                </div>
            </div>

            <div className="my-2">&nbsp;</div>

            <SiteHomepagePreview homepage={homepage} url={url ?? null}   homepageId={siteData.homepageId ?? null} />

            <div className="flex justify-between w-full">
                <div className="flex flex-row">
                    <Bold>All Pages</Bold>
                </div>
                <div className="flex flex-row">
                    <CreatePageButton />
                </div>
            </div>

            <Pages pages={siteData.pages} url={url ?? ''} homepageId={siteData.homepageId ?? null} />
        </>
    )
}