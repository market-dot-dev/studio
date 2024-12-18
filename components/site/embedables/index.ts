import TiersServer from "./tiers/tiers-server";
import TiersClient from "./tiers/tiers-client";

const embedables = {
  tiers: {
    name: "Packages",
    element: TiersServer,
    preview: TiersClient,
  },
} as any;

export default embedables;
