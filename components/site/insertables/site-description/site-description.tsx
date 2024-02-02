'use client'
export default function SiteDescription({site, page}: { site : any, page : any}) {
    return (
        <>{site.user.projectDescription}</>
    )
}