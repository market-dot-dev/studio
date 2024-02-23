'use client'

import { Bold, Card, Badge, Text } from "@tremor/react";
import CreatePageButton from "@/components/create-page-button";
import Pages from "@/components/pages";
import PageHeading from "@/components/common/page-heading";
import PrimaryButton from "@/components/common/link-button";
import { ExternalLinkChip } from "@/components/common/external-link";

import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

import { getSiteAndPages } from "@/app/services/SiteService";
import { getRootUrl } from "@/app/services/domain-service";
import { Page, Site } from "@prisma/client";
import { useEffect, useState } from "react";

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

            <Card>
                <div className="flex justify-between w-full">
                    <div className="absolute bottom-0 left-4">
                        <Image
                            src="/site-preview.png"
                            alt="Site Preview"
                            width={843} // Original width
                            height={596} // Original height to maintain the aspect ratio
                            layout="responsive"
                            style={{ maxWidth: '300px', width: '100%' }}
                        />
                    </div>
                    <div className="flex-column ms-[300px]">

                        <div className="mb-2">
                            <Bold className="me-2">
                                Site Homepage
                            </Bold>

                            {homepage?.draft ?
                                <Badge color="gray" size="xs">Draft</Badge> :
                                <Badge color="green" size="xs">Live</Badge>
                            }
                        </div>

                        <div>
                            { url ? <ExternalLinkChip href={url} label={url + ' ↗'} /> : null }
                        </div>

                        <Text className="mt-2">Title: {homepage?.title ?? "No Home Page Set"}</Text>
                        <Text>Last Updated: {homepage?.updatedAt ? formatDistanceToNow(new Date(homepage.updatedAt), { addSuffix: true }) : 'Unknown'}</Text>
                    </div>
                    <div className="flex flex-row">
                        <PrimaryButton label="Edit" href={`/page/${siteData.homepageId}`} />
                    </div>
                </div>
            </Card>

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