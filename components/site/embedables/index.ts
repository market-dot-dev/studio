import TiersServer from "./tiers/tiers-server";
import TiersClient from "./tiers/tiers-client";
import TiersEmbedSettings from "./tiers/tiers-embed-settings";

// import TierServer from "./single-tier/tier-server";
// import TierClient from "./single-tier/tier-client";
// import TierEmbedSettings from "./single-tier/tier-embed-settings";

const embedables =  {
    tiers: {
        name: 'Published Tiers',
        element: TiersServer,
        preview: TiersClient,
        settings: TiersEmbedSettings
    },
    // tier: {
    //     name: 'Single Tier',
    //     element: TierServer,
    //     preview: TierClient,
    //     settings: TierEmbedSettings
    // }

} as any;

export default embedables;