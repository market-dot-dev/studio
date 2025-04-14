import { PackageEmbeddings } from "@/components/embedables/package-embeddings/package-embeddings";
import TiersClient from "./tiers/tiers-client";
import TiersServer from "./tiers/tiers-server";

const embedables = {
  tiers: {
    name: "Packages",
    element: TiersServer,
    preview: TiersClient
  },
  package: {
    name: "Package Embeddings",
    element: PackageEmbeddings,
    preview: PackageEmbeddings
  }
} as any;

export default embedables;
