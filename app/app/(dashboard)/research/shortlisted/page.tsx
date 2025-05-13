import { getResearchLeads } from "@/app/services/research-service";
import { ShortlistedResearch } from "@/components/research/shortlisted-research";

export default async function ShortlistedResearchPage() {
  const leads = await getResearchLeads();

  return <ShortlistedResearch research={leads} />;
}
