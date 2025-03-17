import LeadsNav from "@/components/leads/leads-nav";
import PageHeading from '@/components/common/page-heading';

export default function LeadsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex max-w-screen-xl flex-col">
      <div className="flex flex-col space-y-6">
        <PageHeading title="Research" />
        <p className="text-sm text-stone-500">
          Search for companies using your Open Source Projects.
        </p>
        <LeadsNav />
        {children}
      </div>
    </div>
  );
}