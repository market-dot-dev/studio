'use client'
import Image from "next/image";
import { Flex } from "@tremor/react"
export default function SiteOwner({site, page}: { site : any, page : any}) {
    return (
        <Flex alignItems="center" className="gap-4">
            <Image
                src={
                    site.user.image
                }
                width={80}
                height={80}
                alt={site.user.name ?? "User avatar"}
                className="h-12 w-12 rounded-full"
                />
            <span className="truncate text-lg">
                {site.user.name}
            </span>
        </Flex>
    )
}