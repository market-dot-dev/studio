import UserService from "@/app/services/UserService";
import PageHeading from "@/components/common/page-heading";
import CustomerSettings from "@/components/user/customer-settings";

import { User } from "@prisma/client";


export default async function SettingsPage() {
    const user = await UserService.getCurrentUser() as Partial<User>;
    
    return (
        <div className="space-y-12 p-8">
            <PageHeading title="User Settings" />
            <CustomerSettings user={user} />
        </div>
    );
}