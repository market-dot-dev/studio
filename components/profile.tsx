"use client";

import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import LogoutButton from "./logout-button";
import useCurrentSession from "@/app/hooks/use-current-session";

export default function Profile() {
  const { refreshSession, currentUser: user, notSignedIn } = useCurrentSession();

  if(notSignedIn()) redirect("/login");
  if(!user) return <></>;

  return (
    <>      
      <div className="flex w-full items-center justify-between">
        <Link
          href="/settings"
          className="flex w-full flex-1 items-center space-x-3 rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800"
        >
          <Image
            src={
              user.image ??
              `https://avatar.vercel.sh/${user.id}`
            }
            width={40}
            height={40}
            alt={user.name ?? "User avatar"}
            className="h-6 w-6 rounded-full"
          />
          <span className="truncate text-sm font-medium">
            {user.name}
          </span>
        </Link>
        <LogoutButton redirect={ user.roleId === 'maintainer' ? '/login' : '/customer-login'} />
      </div>
      
    </>
  );
}
