import TiersServer from "./tiers/tiers-server";
import TiersClient from "./tiers/tiers-client";
import TiersEmbedSettings from "./tiers/tiers-embed-settings";
import TiersPreviewProps from "./tiers/tiers-preview-props";

const embedables = {
  tiers: {
    name: "Packages",
    element: TiersServer,
    preview: TiersClient,
    previewProps: TiersPreviewProps,
    settings: TiersEmbedSettings,
  },
} as any;

export default embedables;
