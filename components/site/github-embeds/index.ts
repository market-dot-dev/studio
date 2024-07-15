import tiers from "./tiers";
import GithubTiersEmbedSettings from "./tiers/github-tiers-embed-settings";
import buyButtonEmbed from "./buy-button";


const embedables = {
  tiers: {
    name: 'Tiers',
    callback: tiers,
    settings: GithubTiersEmbedSettings
  },
  buyButton: {
    name: 'Buy Button',
    callback: buyButtonEmbed
  }
} as any;

export default embedables;
