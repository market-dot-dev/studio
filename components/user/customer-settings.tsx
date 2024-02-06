'use client'
import { Flex, Card, TextInput, Button } from "@tremor/react";
import { User } from "@prisma/client";
import { useCallback, useState } from "react";
import { updateCurrentUser } from "@/app/services/UserService";

export default function CustomerSettings({ user  }: {user : Partial<User> }) {
    const [isSaving, setIsSaving] = useState(false);
    const [userData, setUserData ] = useState<Partial<User>>(user);

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
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <TextInput placeholder="" name="name" id="name" value={userData.name ?? ''} onChange={(e) => {
                        setUserData({ ...userData, name: e.target.value });
                    }} />
                </Flex>
        
                <Flex flexDirection="col" alignItems="start" className="w-1/2 gap-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <TextInput placeholder="" type="email" name="email" id="email" value={userData.email ?? ''} onChange={(e) => {
                        setUserData({ ...userData, email: e.target.value });
                    }} />
                </Flex>
        
                <Flex flexDirection="col" alignItems="start" className="w-1/2 gap-2">
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
                    <TextInput placeholder="" name="company" id="company" value={userData.company ?? ''} onChange={(e) => {
                        setUserData({ ...userData, company: e.target.value });
                    }} />
                </Flex>
        
                <Button loading={isSaving} disabled={isSaving} onClick={saveChanges}>Save Changes</Button>
            </Flex>
        </Card>
    )
}