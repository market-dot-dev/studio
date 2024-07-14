import tiers from "./tiers";
import GithubTiersEmbedSettings from "./tiers/github-tiers-embed-settings";
import buyButtonEmbed from "./buy-button";
import BuyButtonEmbedSettings from "./buy-button/buy-button-embed-settings";

const embedables = {
  tiers: {
    name: 'Tiers',
    callback: tiers,
    settings: GithubTiersEmbedSettings
  },
  buyButton: {
    name: 'Buy Button',
    callback: buyButtonEmbed,
    settings: BuyButtonEmbedSettings
  }
} as any;

export default embedables;
