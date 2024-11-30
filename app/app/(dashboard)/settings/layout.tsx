import SettingsNav from "./nav";
import PageHeading from "@/components/common/page-heading";

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex max-w-screen-xl flex-col">
      <div className="flex flex-col space-y-6">
        <PageHeading title="Settings" />
        <SettingsNav />
        {children}
      </div>
    </div>
  );
}
