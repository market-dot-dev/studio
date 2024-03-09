import tiers from "./tiers";
import GithubTiersEmbedSettings from "./tiers/github-tiers-embed-settings";

const embedables =  {
    tiers : {
        name: 'Tiers',
        callback: tiers,
        settings: GithubTiersEmbedSettings
    }
} as any;

export default embedables;