'use client'
import { Flex, Card, TextInput, Button } from "@tremor/react";
import { Site } from "@prisma/client";
import { useState } from "react";
import { updateCurrentSite } from "@/app/services/SiteService"; // Ensure this service is implemented correctly
import Uploader from "../form/uploader";

export default function SiteSettings({ site }: { site: Partial<Site> }) {
    const [isSaving, setIsSaving] = useState(false);
    const [changed, setChanged] = useState(false);

    const handleSubmit = async (e : any) => {
        e.preventDefault(); // Prevent the default form submission behavior
        setIsSaving(true);
        
        const formData = new FormData(e.target); // Create FormData from the form
        // if not changed, remove the logo from the form data
        if (!changed) {
            formData.delete("logo");
        }
        try {
            await updateCurrentSite(formData); // Assumes your service can handle FormData
            setChanged(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card>
            <form onSubmit={handleSubmit}>
                <Flex flexDirection="col" alignItems="start" className="space-y-6 w-full">
                    <Flex flexDirection="col" alignItems="start" className="w-1/2 gap-2">
                        <label htmlFor="subdomain" className="block text-sm font-medium text-gray-700">Subdomain</label>
                        <TextInput placeholder="Your subdomain" name="subdomain" id="subdomain" defaultValue={site.subdomain ?? ''} />
                    </Flex>
                    <Flex flexDirection="col" alignItems="start" className="w-1/2 gap-2">
                        <label htmlFor="logo" className="block text-sm font-medium text-gray-700">Logo</label>
                        <Uploader defaultValue={site.logo ?? null} name="logo" setChanged={setChanged} />
                    </Flex>
                    
                    <Button type="submit" loading={isSaving} disabled={isSaving}>Save Changes</Button>
                </Flex>
            </form>
        </Card>
    );
}
