"use server";

import TierFeatureList from "@/components/features/tier-feature-list";
import TierFeaturePicker from "@/components/features/tier-feature-picker";

const TierFeatures = async ({ params }: { params: { id: string } }) => {

  return (<>
    <TierFeaturePicker tierId={params.id} />
  </>);
};

export default TierFeatures;