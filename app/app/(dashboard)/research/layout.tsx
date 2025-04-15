import PageHeader from "@/components/common/page-header";
import ResearchNav from "@/components/research/research-nav";

export default function ResearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex max-w-screen-xl flex-col gap-7">
      <PageHeader
        title="Research"
        description="Search for companies using your Open Source Projects."
      />
      <ResearchNav />
      {children}
    </div>
  );
}
