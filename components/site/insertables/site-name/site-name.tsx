'use client'
export default function SiteName({site, page}: { site : any, page : any}) {
    return (
        <>{site?.user?.projectName ?? 'Lorem ipsum'}</>
    )
}