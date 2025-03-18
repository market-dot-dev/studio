import TiersServer from "./tiers/tiers-server";
import TiersClient from "./tiers/tiers-client";
import PackageEmbeddings from "@/components/embedables/package-embeddings/package-embeddings";

const embedables = {
  tiers: {
    name: "Packages",
    element: TiersServer,
    preview: TiersClient,
  },
  package: {
    name: "Package Embeddings",
    element: PackageEmbeddings,
    preview: PackageEmbeddings,
  },
} as any;

export default embedables;
