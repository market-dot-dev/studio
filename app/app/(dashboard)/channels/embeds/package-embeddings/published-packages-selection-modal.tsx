import { Text } from "@tremor/react";
import { getPublishedTiers } from "@/app/services/TierService";
import { Suspense } from "react";
import SkeletonLoader from "@/components/common/skeleton-loader";

export default function PublishedPackagesSelectionModal({
  hide,
}: {
  hide: () => void;
}) {
  return (
    <div className="w-full">
      <div className="w-full">
        <Text>Select a package to embed</Text>
        <Suspense fallback={<PublishedPackagesSelectionLoadingContent />}>
          <PublishedPackagesSelectionModalContent />
        </Suspense>
      </div>
    </div>
  );
}

async function PublishedPackagesSelectionModalContent() {
  const publishedPackages = await getPublishedTiers();
  return (
    <div className="flex w-full grid-cols-3 gap-4 p-10">
      <Text>Select a package to embed</Text>
    </div>
  );
}

function PublishedPackagesSelectionLoadingContent() {
  return (
    <div className="flex w-full grid-cols-3 gap-4 p-10">
      <SkeletonLoader className="h-96 w-full rounded-lg" />
      <SkeletonLoader className="h-96 w-full rounded-lg" />
      <SkeletonLoader className="h-96 w-full rounded-lg" />
    </div>
  );
}
