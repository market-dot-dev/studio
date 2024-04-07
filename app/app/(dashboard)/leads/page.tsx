import PageHeading from "@/components/common/page-heading";
import { Text } from "@tremor/react";

import { getRepos } from "@/app/services/RepoService";
import LeadsSearch from "@/components/leads/leads-search";

export default async function ReportsPage({ params }: { params: { id: string } }) {

    const repos = await getRepos();

    return (
        <div className="flex max-w-screen-xl flex-col space-y-12">
            <div className="flex justify-between w-full">
                <div className="flex flex-col items-stretch w-full">
                    <PageHeading title="Leads" />
                    <Text>Search for companies using your Open Source Projects.</Text>

                    <LeadsSearch repos={repos} />

                </div>
            </div>
        </div>
    );
}