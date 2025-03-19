import LeadsNav from "@/components/leads/leads-nav";
import PageHeader from '@/components/common/page-header';

export default function LeadsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex max-w-screen-xl flex-col gap-7">
      <PageHeader 
        title="Research" 
        description="Search for companies using your Open Source Projects."
      />
      <LeadsNav />
      {children}
    </div>
  );
}