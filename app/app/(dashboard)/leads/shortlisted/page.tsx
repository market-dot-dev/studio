import LeadsService from "@/app/services/LeadsService";
import ShortlistedLeads from "@/components/leads/shortlisted-leads";

export default async function LeadsPage() {
  const shortlistedLeads = await LeadsService.getShortlistedLeads();

  return <ShortlistedLeads leads={shortlistedLeads} />;
}
