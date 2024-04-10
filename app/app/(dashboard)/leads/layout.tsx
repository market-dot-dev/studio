import { Settings } from 'lucide-react';
import LeadsNav from './nav'; 
import { Text } from '@tremor/react';
import PageHeading from '@/components/common/page-heading';

export default async function SettingsLayout({ children } : {
    children: React.ReactNode;
  }) {
    return (
        <div className="flex max-w-screen-xl flex-col">
            <div className="flex flex-col space-y-6">
                <PageHeading title="Leads" />
                <Text>Search for companies using your Open Source Projects.</Text>
                <LeadsNav />
                {children}
            </div>
        </div>
    )
  }