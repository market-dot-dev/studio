import LeadsService from "@/app/services/LeadsService";
import { ShortlistedResearch } from "@/components/research/shortlisted-research";

export default async function ShortlistedResearchPage() {
  const shortlistedResearch = await LeadsService.getShortlistedLeads();

  return <ShortlistedResearch research={shortlistedResearch} />;
}
