import PageHeading from "@/components/common/page-heading";
import { Text, Bold, Card, TextInput, Badge } from "@tremor/react";
import { SearchIcon } from "lucide-react";
import mockData from "./mockdata";


export default function ReportsPage({ params }: { params: { id: string } }) {
    return (
        <div className="flex max-w-screen-xl flex-col space-y-12">
            <div className="flex justify-between w-full">
                <div className="flex flex-col">
                    <PageHeading title="Leads" />
                    <Text>Search for companies using your Open Source Projects.</Text>
                    <Card
                        className="my-4 w-full bg-gray-100 border border-gray-400 px-4 py-3 text-gray-700"
                    >
                        <div className="mx-2 w-full">
                            <p className="font-semibold">No Connected Repositories</p>
                            <p>We recommend you connect some repositories in your <a href="/settings/repos" className="underline">Repo Settings</a>.</p>
                        </div>
                    </Card>

                    <div className="mb-4">
                    <Bold>Search for a Repo:</Bold>
                    <TextInput placeholder="Enter a Repo Name..." className="border-2 text-lg p-1 border-slate-600" />
                    </div>

                    <Bold>Organizations Using This Repository</Bold>

                    {mockData.map((lead, index) => (
                        <Card key={index} className="flex flex-col my-2">
                            <div>
                                <Bold>{lead.name}</Bold>
                                <Badge>Organization</Badge>
                            </div>
                            <Text>{lead.description}</Text>
                            <Text>Dependent Repositories: {lead.dependent_repos_count}</Text>
                            <Text>Total Repositories: {lead.repositories_count}</Text>
                            <Text>Website: {lead.website}</Text>
                            <Text>Email: {lead.email}</Text>
                            <Text>Twitter: {lead.twitter}</Text>
                            <Text>Location: {lead.location}</Text>
                            <Text>Company: {lead.company}</Text>
                            <Text>Maintainers: {lead.maintainers.join(', ')}</Text>
                        </Card>
                    ))}

                </div>
            </div>
        </div>
    );
}