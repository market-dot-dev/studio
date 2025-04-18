"use client";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function RoleSwitcher() {
  const { data: session, status, update } = useSession();
  const { user } = session?.user ? (session as { user: Partial<User> }) : { user: null };
  const router = useRouter();

  const handleSwitch = useCallback(
    (e: any) => {
      update({ roleId: e.target.value }).then(() => {
        setTimeout(() => {
          router.push("/", { scroll: false });
        }, 0);
      });
    },
    [update, router]
  );

  return (
    <>
      {user ? (
        <div className="mx-auto w-full">
          <select value={user.roleId} onChange={handleSwitch} className="rounded-xl py-0">
            <option value="customer">Role: Customer</option>
            <option value="maintainer">Role: Maintainer</option>
          </select>
        </div>
      ) : null}
    </>
  );
}
