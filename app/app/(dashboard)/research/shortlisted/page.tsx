import { getShortlistedLeads } from "@/app/services/lead-service";
import { ShortlistedResearch } from "@/components/research/shortlisted-research";

export default async function ShortlistedResearchPage() {
  const shortlistedResearch = await getShortlistedLeads();

  return <ShortlistedResearch research={shortlistedResearch} />;
}
