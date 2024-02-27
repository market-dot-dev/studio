import TiersServer from "./tiers/teirs-server";
import TiersClient from "./tiers/tiers-client";

import MenuServer from "./menu/menu-server";
import MenuClient from "./menu/menu-client";

import UserInfoServer from "./userinfo/user-info-server";
import UserInfoClient from "./userinfo/user-info-client";

import SiteName from "./site-name/site-name";


// import { Subscriptions, SubscriptionsPreview } from "./subscriptions";
// import { SubscriptionsServer } from "./subscriptions/subscriptions-server";
// import { SubscriptionsClient } from "./subscriptions/subscriptions-client";

import Section from "./section/section";

import { 
    Flex, Box, Grid, Container, Card, Avatar,
    Text, Heading, Blockquote, Code, Em, Link, Quote
} from '@radix-ui/themes'

import SiteDescription from "./site-description/site-description";
import SiteOwner from "./site-owner/site-owner";

import ImageInsert from "./image/image-insert";

export type Insertable = {
    name: string,
    tag: string,
    element: any,
    preview?: any,
    insert?: any, // component for inserting the element
    ui?: boolean
}

export const siteComponents = {
    tiers: {
        name: 'Tiers',
        tag: 'Tiers',
        element: TiersServer,
        preview: TiersClient
    } as Insertable,
    userinfo: {
        name: 'User Info',
        tag: 'UserInfo',
        element: UserInfoServer,
        preview: UserInfoClient
    } as Insertable,
    // subscriptions: {
    //     name: 'Subscriptions',
    //     tag: 'Subscriptions',
    //     element: SubscriptionsServer,
    //     preview: SubscriptionsClient
    // },
    menu: {
        name: 'Menu',
        tag: 'Menu',
        element: MenuServer,
        preview: MenuClient
    } as Insertable,
    sitename: {
        name: 'Site Name',
        tag: 'SiteName',
        element: SiteName
    } as Insertable,
    sitedescription: {
        name: 'Site Description',
        tag: 'SiteDescription',
        element: SiteDescription
    } as Insertable,
    siteowner: {
        name: 'Site Owner',
        tag: 'SiteOwner',
        element: SiteOwner
    } as Insertable,
    
} as any;

export const layoutComponents = {
    flex: {
        name: 'Flex',
        tag: 'Flex',
        element: Flex,
        ui: true // This is a UI component, not a site component, so props like site and pages are not available
    } as Insertable,
    box: {
        name: 'Box',
        tag: 'Box',
        element: Box,
        ui: true 
    } as Insertable,
    grid: {
        name: 'Grid',
        tag: 'Grid',
        element: Grid,
        ui: true
    } as Insertable,
    container: {
        name: 'Container',
        tag: 'Container',
        element: Container,
        ui: true // This is a UI component, not a site component, so props like site and pages are not available
    } as Insertable,
    section: {
        name: 'Section',
        tag: 'Section',
        element: Section,
        ui: true 
    } as Insertable,
    card: {
        name: 'Card',
        tag: 'Card',
        element: Card,
        ui: true 
    } as Insertable,
    avatar: {
        name: 'Avatar',
        tag: 'Avatar',
        element: Avatar,
        ui: true 
    } as Insertable,
    image: {
        name: 'Image',
        tag: 'img',
        insert: ImageInsert,
        ui: true 
    } as Insertable
    
} as any;

export const textComponents = {
    text: {
        name: 'Text',
        tag: 'Text',
        element: Text,
        ui: true
    } as Insertable,
    heading: {
        name: 'Heading',
        tag: 'Heading',
        element: Heading,
        ui: true 
    } as Insertable,
    blockquote: {
        name: 'Blockquote',
        tag: 'Blockquote',
        element: Blockquote,
        ui: true 
    } as Insertable,
    code: {
        name: 'Code',
        tag: 'Code',
        element: Code,
        ui: true 
    } as Insertable,
    em: {
        name: 'Em',
        tag: 'Em',
        element: Em,
        ui: true 
    } as Insertable,
    link: {
        name: 'Link',
        tag: 'Link',
        element: Link,
        ui: true 
    } as Insertable,
    quote: {
        name: 'Quote',
        tag: 'Quote',
        element: Quote,
        ui: true 
    } as Insertable

} as any;

export default {
    ...siteComponents,
    ...layoutComponents,
    ...textComponents
} as any;