'use client'
import { Flex, Card, TextInput, Textarea, Button, Bold, Text, Icon, SearchSelect, SearchSelectItem } from "@tremor/react";
import { Repo, User } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import { updateCurrentUser } from "@/app/services/UserService";
import { getRepo, getRepos } from "@/app/services/RepoService";
import { Github } from "lucide-react";
import Link from 'next/link'
import { get } from "http";

export default function ProjectSettings({ user }: { user: Partial<User> }) {
    const [isSaving, setIsSaving] = useState(false);
    const [userData, setUserData] = useState<Partial<User>>(user);
    const [repos, setRepos] = useState<Repo[]>([]);

    useEffect(() => {
        getRepos().then((repos) => {
            setRepos(repos);
        });
    }, []);

    const importFromRepo = useCallback(async (repoId: string) => {
        const selectedRepo = repos.find(repo => repo.id === repoId);

        if (selectedRepo) {
            getRepo(selectedRepo.repoId).then((repoDetails) => {
                setUserData({
                    ...userData,
                    projectName: repoDetails.name,
                    ...(repoDetails.description ? { projectDescription: repoDetails.description } : {})
                });
            });
        }
    }, [repos]);

    const saveChanges = useCallback(async () => {
        setIsSaving(true);
        try {
            await updateCurrentUser(userData);

            // call the refreshOnboarding function if it exists
            if (window?.hasOwnProperty('refreshOnboarding')) {
                (window as any)['refreshOnboarding']();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsSaving(false);
        }

    }, [userData])

    return (
        <>
            <Flex justifyContent="between" alignItems="start" className="w-full gap-12">
                <Flex flexDirection="col" alignItems="start" className="space-y-6 w-1/2">
                    <Flex flexDirection="col" alignItems="start" className="w-full gap-2">
                        <label htmlFor="project-name" className="block text-sm font-medium text-gray-700">Project Name</label>
                        <Text>Your project name</Text>
                        <TextInput placeholder="" name="project-name" id="project-name" value={userData.projectName ?? ''} onChange={(e) => {
                            setUserData({ ...userData, projectName: e.target.value });
                        }} />
                    </Flex>

                    <Flex flexDirection="col" alignItems="start" className="w-full gap-2">
                        <label htmlFor="project-description" className="block text-sm font-medium text-gray-700">Project Description</label>
                        <Text>Your project description is used in your site homepage (and other pages where you embed the {`<SiteDescription>`} component).</Text>
                        <Textarea className="h-52" placeholder="" name="project-description" id="project-description" value={userData.projectDescription ?? ''} onChange={(e) => {
                            setUserData({ ...userData, projectDescription: e.target.value });
                        }} />
                    </Flex>

                    <Button loading={isSaving} disabled={isSaving} onClick={saveChanges}>Save Changes</Button>
                </Flex>
                <Flex flexDirection="col" alignItems="start" className="h-full space-y-6 w-1/2">
                    <Card
                        className="mb-4 flex h-full flex-col justify-between bg-gray-100 border border-gray-400 px-4 py-4 text-gray-700"
                    >                        
                        <Bold className="text-sm mb-2">Import Project Info from Github</Bold>
                        <Text className="mb-4">Auto populate your project info from one of your connected repositories. </Text>
                        {repos.length > 0 ?
                            <>
                            <Text className="mb-4">Your Connected Repositories:</Text>

                            <SearchSelect onValueChange={importFromRepo}>
                                {repos.map((repo, index) => (
                                    <SearchSelectItem value={repo.id} key={index}>
                                        <Flex alignItems="center">
                                            <Icon icon={Github} /> <Text>{repo.name}</Text>
                                        </Flex>
                                    </SearchSelectItem>
                                ))}
                            </SearchSelect>
                            </>
                            : <Text>There are no Connected repositories yet. <Link href="/settings/repos" className="underline">Connect a repository now</Link>.</Text>
                        }
                    </Card>
                </Flex>
            </Flex>
        </>
    )
}