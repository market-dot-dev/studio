'use client'
import Image from "next/image";
import { Flex } from "@tremor/react"
export default function SiteOwner({site, page}: { site : any, page : any}) {
    return (
        <Flex alignItems="center" justifyContent="start" className="gap-4">
            { site?.user ?
                <Image
                    src={
                        site.user.image
                    }
                    width={80}
                    height={80}
                    alt={site.user.name }
                    className="h-12 w-12 rounded-full"
                    />
                : 
                <div className="h-12 w-12 rounded-full bg-gray-200"></div>
            }
            <span className="truncate text-lg">
                {site?.user.name ?? 'John Doe'}
            </span>
        </Flex>
    )
}