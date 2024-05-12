import TiersServer from "./tiers/teirs-server";
import TiersClient from "./tiers/tiers-client";
import TiersInsert from "./tiers/tiers-insert";
import SiteName from "./site-name/site-name";
import SiteDescription from "./site-description/site-description";


import ImageInsert from "./image/image-insert";

export type Insertable = {
    name: string,
    tag: string,
    description?: string,
    element: any,
    preview?: any,
    insert?: any, // component for inserting the element
    ui?: boolean,
    hidden?: boolean
    attributes?: any
}

export const components = {
    tiers: {
        name: 'Tiers',
        tag: 'Tiers',
        description: 'Display tier panels',
        element: TiersServer,
        preview: TiersClient,
        insert: TiersInsert
    },
    sitename: {
        name: 'Site Name',
        tag: 'SiteName',
        description: 'Display site name',
        element: SiteName
    } as Insertable,
    sitedescription: {
        name: 'Site Description',
        tag: 'SiteDescription',
        description: 'Display site description',
        element: SiteDescription
    } as Insertable,
    
    image: {
        name: 'Image',
        tag: 'img',
        description: 'Display image',
        insert: ImageInsert,
        ui: true 
    } as Insertable
    
} as any;



export default {
    ...components
} as any;