import { getSiteNav } from "@/lib/site/fetchers";
import { Flex } from "@tremor/react";

export function MenuPreview() {
    return (
        <Flex justifyContent="start">
            <a href="#">Home</a>
            <a href="#">About</a>
        </Flex>
    )
}

export async function Menu( { site, page, ...props }: { site: any, page: any, props: any } ) {
    
    const { homepageId, subdomain } = site;
    const nav = await getSiteNav(site.id);
    
    const url = `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

    return (
        <Flex justifyContent="start" className="gap-4">
            {nav.map((page: any, index: number) => (
                <span key={index}>
                    <a href={
                        process.env.NEXT_PUBLIC_VERCEL_ENV
                            ? `https://${url}` + (page.id === homepageId ? '' : `/${page.slug}`)
                            : `http://${subdomain}.localhost:3000` + (page.id === homepageId ? '' : `/${page.slug}`)
                        } className="p-4 text-blue-800">{page.title}</a>
                </span>
            ))}
        </Flex>
    )

}