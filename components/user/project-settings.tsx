'use client'
import { Flex, Card, TextInput, Textarea, Button } from "@tremor/react";
import { User } from "@prisma/client";
import { useCallback, useState } from "react";
import { updateCurrentUser } from "@/app/services/UserService";

export default function ProjectSettings({ user  }: {user : Partial<User> }) {
    const [isSaving, setIsSaving] = useState(false);
    const [ userData, setUserData ] = useState<Partial<User>>(user);

    const saveChanges = useCallback( async () => {
        setIsSaving(true);
        try {
            await updateCurrentUser(userData);
        } catch (error) {
            console.log(error);
        } finally {
            setIsSaving(false);
        }

    }, [userData])

    return (
        <Card>
            <Flex flexDirection="col" alignItems="start" className="space-y-6 w-full">
                <Flex flexDirection="col" alignItems="start" className="w-1/2 gap-2">
                    <label htmlFor="project-name" className="block text-sm font-medium text-gray-700">Project Name</label>
                    <small>The project you&apos;re offering support for.</small>
                    <TextInput placeholder="" name="project-name" id="project-name" value={userData.projectName ?? ''} onChange={(e) => {
                        setUserData({ ...userData, projectName: e.target.value });
                    }} />
                </Flex>
        
                <Flex flexDirection="col" alignItems="start" className="w-1/2 gap-2">
                    <label htmlFor="project-description" className="block text-sm font-medium text-gray-700">Project Description</label>
                    <small>Describe your project.</small>
                    <Textarea placeholder="" name="project-description" id="project-description" value={userData.projectDescription ?? ''} onChange={(e) => {
                        setUserData({ ...userData, projectDescription: e.target.value });
                    }} />
                </Flex>
        
                <Button loading={isSaving} disabled={isSaving} onClick={saveChanges}>Save Changes</Button>
            </Flex>
        </Card>

    )
}