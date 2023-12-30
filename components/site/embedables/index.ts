import TiersServer from "./tiers/teirs-server";
import TiersClient from "./tiers/tiers-client";


import GreenTiersClient from "./green-tiers/tiers-client";
import GreenTiersServer from "./green-tiers/teirs-server";




const embedables =  {
    tiers: {
        name: 'Tiers',
        element: TiersServer,
        preview: TiersClient
    },
    greentiers: {
        name: 'Green Tiers',
        element: GreenTiersServer,
        preview: GreenTiersClient
    }

} as any;

export default embedables;