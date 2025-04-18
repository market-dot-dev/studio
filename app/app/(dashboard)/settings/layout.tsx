import PageHeader from "@/components/common/page-header";
import SettingsNav from "./nav";

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex max-w-screen-xl flex-col gap-7">
      <PageHeader title="Settings" />
      <div className="flex flex-col space-y-8">
        <SettingsNav />
        {children}
      </div>
    </div>
  );
}
