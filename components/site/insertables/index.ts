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

export const siteComponents = {
    tiers: {
        name: 'Tiers',
        tag: 'Tiers',
        element: TiersServer,
        preview: TiersClient
    },
    userinfo: {
        name: 'User Info',
        tag: 'UserInfo',
        element: UserInfoServer,
        preview: UserInfoClient
    },
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
    },
    sitename: {
        name: 'Site Name',
        tag: 'SiteName',
        element: SiteName
    },
    sitedescription: {
        name: 'Site Description',
        tag: 'SiteDescription',
        element: SiteDescription
    },
    siteowner: {
        name: 'Site Owner',
        tag: 'SiteOwner',
        element: SiteOwner
    },
    
} as any;

export const layoutComponents = {
    flex: {
        name: 'Flex',
        tag: 'Flex',
        element: Flex,
        ui: true // This is a UI component, not a site component, so props like site and pages are not available
    },
    box: {
        name: 'Box',
        tag: 'Box',
        element: Box,
        ui: true 
    },
    grid: {
        name: 'Grid',
        tag: 'Grid',
        element: Grid,
        ui: true
    },
    container: {
        name: 'Container',
        tag: 'Container',
        element: Container,
        ui: true // This is a UI component, not a site component, so props like site and pages are not available
    },
    section: {
        name: 'Section',
        tag: 'Section',
        element: Section,
        ui: true 
    },
    card: {
        name: 'Card',
        tag: 'Card',
        element: Card,
        ui: true 
    },
    avatar: {
        name: 'Avatar',
        tag: 'Avatar',
        element: Avatar,
        ui: true 
    }
    
} as any;

export const textComponents = {
    text: {
        name: 'Text',
        tag: 'Text',
        element: Text,
        ui: true
    },
    heading: {
        name: 'Heading',
        tag: 'Heading',
        element: Heading,
        ui: true 
    },
    blockquote: {
        name: 'Blockquote',
        tag: 'Blockquote',
        element: Blockquote,
        ui: true 
    },
    code: {
        name: 'Code',
        tag: 'Code',
        element: Code,
        ui: true 
    },
    em: {
        name: 'Em',
        tag: 'Em',
        element: Em,
        ui: true 
    },
    link: {
        name: 'Link',
        tag: 'Link',
        element: Link,
        ui: true 
    },
    quote: {
        name: 'Quote',
        tag: 'Quote',
        element: Quote,
        ui: true 
    }

} as any;

export default {
    ...siteComponents,
    ...layoutComponents,
    ...textComponents
} as any;