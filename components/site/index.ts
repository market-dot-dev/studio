import { Tiers, TiersPreview } from "./tiers/";
import { UserInfo, UserInfoPreview } from "./user-info";
import { Subscriptions, SubscriptionsPreview } from "./subscriptions/";
import { Menu, MenuPreview } from "./menu/";

const componentsMap = {
    tiers: {
        name: 'Tiers',
        tag: 'Tiers',
        element: Tiers,
        preview: TiersPreview
    },
    userinfo: {
        name: 'User Info',
        tag: 'UserInfo',
        element: UserInfo,
        preview: UserInfoPreview
    },
    subscriptions: {
        name: 'Subscriptions',
        tag: 'Subscriptions',
        element: Subscriptions,
        preview: SubscriptionsPreview
    },
    menu: {
        name: 'Menu',
        tag: 'Menu',
        element: Menu,
        preview: MenuPreview
    }

} as any;

export default componentsMap;