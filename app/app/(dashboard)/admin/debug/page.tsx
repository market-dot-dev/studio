"use server";

import UserService from "@/app/services/UserService";
import PageHeading from "@/components/common/page-heading";
import RoleSwitcher from "@/components/user/role-switcher";
import { Card, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@tremor/react";
import LinkButton from "@/components/common/link-button";

const StripeDebug = async () => {
  const user = await UserService.getCurrentUser();
  if(!user || !(user.roleId === "admin")) {
    return <div>Not logged in</div>;
  }

  const debugLinks = [
    { name: "View All Users", href: "/admin/debug/users" },
    { name: "Bulk Email Tool", href: "/admin/debug/email" },
    { name: "Onboarding State", href: "/admin/debug/onboarding" },
    { name: "Stripe Debug", href: "/admin/debug/stripe-debug" },
    { name: "Stripe Connect", href: "/settings/payment" },
    { name: "Stripe Validation", href: `/admin/debug/${user?.id}/validation` },
    { name: "Direct Payments Migration", href: "/admin/debug/stripe-migration" },
    { name: "Active Subscriptions", href: "/subscriptions" },
    { name: "Session Viewer", href: "/admin/debug/session" },
    { name: "Sentry Example", href: "/admin/debug/sentry-example-page" },
  ];

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex justify-between w-full">
        <PageHeading title="Debug Tools" />
      </div>
      
      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Debug Tool</TableHeaderCell>
              <TableHeaderCell>Action</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {debugLinks.map((link) => (
              <TableRow key={link.href}>
                <TableCell>{link.name}</TableCell>
                <TableCell>
                  <LinkButton href={link.href} label="View" className="w-24" />
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell>Switch Role</TableCell>
              <TableCell>
                <RoleSwitcher />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default StripeDebug;