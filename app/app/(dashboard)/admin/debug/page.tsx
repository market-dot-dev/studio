"use server";

import UserService from "@/app/services/UserService";
import PageHeader from "@/components/common/page-header";
import { DataTable } from "@/components/ui/data-table";
import RoleSwitcher from "@/components/user/role-switcher";
import { columns, DebugLink } from "./columns";

const Debug = async () => {
  const user = await UserService.getCurrentUser();
  if (!user || !(user.roleId === "admin")) {
    return <div>Not logged in</div>;
  }

  const debugLinks: DebugLink[] = [
    { name: "User Analytics", href: "/admin/users" },
    { name: "View All Users", href: "/admin/debug/users" },
    { name: "Bulk Email Tool", href: "/admin/debug/email" },
    { name: "Onboarding State", href: "/admin/debug/onboarding" },
    { name: "Stripe Debug", href: "/admin/debug/stripe-debug" },
    { name: "Stripe Connect", href: "/settings/payment" },
    { name: "Stripe Validation", href: `/admin/debug/${user?.id}/validation` },
    { name: "Session Viewer", href: "/admin/debug/session" }
  ];

  // Add the role switcher as a special row that will be handled separately
  const roleSwitcherRow = { name: "Switch Role", href: "#" };

  return (
    <div className="flex max-w-screen-xl flex-col space-y-8">
      <PageHeader title="Debug Tools" />

      <DataTable columns={columns} data={debugLinks} />

      <div className="mt-4 border-t pt-4">
        <div className="flex items-center justify-between">
          <div className="font-medium">Switch Role</div>
          <RoleSwitcher />
        </div>
      </div>
    </div>
  );
};

export default Debug;
