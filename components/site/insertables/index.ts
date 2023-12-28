import TiersServer from "./tiers/teirs-server";
import TiersClient from "./tiers/tiers-client";

import MenuServer from "./menu/menu-server";
import MenuClient from "./menu/menu-client";

import UserInfoServer from "./userinfo/user-info-server";
import UserInfoClient from "./userinfo/user-info-client";

// import { Subscriptions, SubscriptionsPreview } from "./subscriptions";
import { SubscriptionsServer } from "./subscriptions/subscriptions-server";
import { SubscriptionsClient } from "./subscriptions/subscriptions-client";


const componentsMap = {
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
    subscriptions: {
        name: 'Subscriptions',
        tag: 'Subscriptions',
        element: SubscriptionsServer,
        preview: SubscriptionsClient
    },
    menu: {
        name: 'Menu',
        tag: 'Menu',
        element: MenuServer,
        preview: MenuClient
    }

} as any;

export default componentsMap;