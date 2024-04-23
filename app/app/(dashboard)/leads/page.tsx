import { getRepos } from "@/app/services/RepoService";
import LeadsSearch from "@/components/leads/leads-search";

export default async function LeadsPage() {

    const repos = await getRepos();

    return (
        <LeadsSearch repos={repos} />
    );
}