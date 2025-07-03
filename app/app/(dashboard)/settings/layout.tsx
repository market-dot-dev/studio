import PageHeader from "@/components/common/page-header";
import SettingsNav from "./nav";

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex max-w-screen-xl flex-col gap-6">
      <PageHeader title="Settings" className="xl:border-b xl:pb-4" />
      <div className="relative flex flex-col gap-8 xl:flex-row">
        <SettingsNav />
        <div className="mx-auto w-full xl:max-w-xl xl:pt-1">{children}</div>
      </div>
    </div>
  );
}
