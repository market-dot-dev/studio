import {getSiteNav} from "@/app/services/SiteService";
import Menu from "./menu";

export default async function MenuServer( { site, page }: { site: any, page: any } ) {
    const nav = await getSiteNav(site.id) as any[];
    return (
        <Menu site={site} page={page} nav={nav} />
    )
}