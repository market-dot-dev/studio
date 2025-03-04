'use client'
import { Flex, TextInput, Button } from "@tremor/react";
import { Card } from "@/components/ui/card";
import { User } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import { updateCurrentUser } from "@/app/services/UserService";
import useCurrentSession from "@/app/hooks/use-current-session";

export default function CustomerSettings() {
    const { currentUser, refreshSession } = useCurrentSession();
    type UserAttrs = Pick<User, 'name' | 'email' | 'company'>;

    const [isSaving, setIsSaving] = useState(false);
    const [userData, setUserData ] = useState<UserAttrs>({} as UserAttrs);

    useEffect(() => {
        if (currentUser) {
            setUserData({
                name: currentUser.name || null,
                email: currentUser.email || null,
                company: currentUser.company || null,
            });
        }
    }, [currentUser])

    const saveChanges = useCallback( async () => {
        setIsSaving(true);
        try {
            await updateCurrentUser(userData as Partial<User>);
            await refreshSession();
        } catch (error) {
            console.log(error);
        } finally {
            setIsSaving(false);
        }

    }, [userData, refreshSession])

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