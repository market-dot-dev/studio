"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { getRootUrl, domainCopy } from "@/lib/domain";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default function UserDropwdown({ user }: { user: any }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="hover:opacity-95 h-7 w-7 rounded-full"
          aria-label="User menu"
        >
          <Image
            src={user.image ?? `https://avatar.vercel.sh/${user.id}`}
            width={32}
            height={32}
            alt={user.name ?? "User avatar"}
            className="h-7 w-7 rounded-full ring-1 ring-inset ring-white/10"
          />
        </button>
      </DropdownMenu.Trigger>
      
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="shadow-border-lg w-[250px] rounded-md bg-white text-sm font-medium z-[40]"
          sideOffset={5}
          align="end"
          alignOffset={0}
          avoidCollisions
          collisionPadding={10}
        >
          <div className="flex items-center gap-2.5 border-b border-stone-200 p-4">
            <Image
              src={user.image ?? `https://avatar.vercel.sh/${user.id}`}
              width={32}
              height={32}
              alt={user.name ?? "User avatar"}
              className="h-7 w-7 rounded-full"
            />
            <h3 className="font-bold tracking-tight">{user.name}</h3>
          </div>
          
          <DropdownMenu.Group className="px-2 py-2.5 text-stone-500">
            <DropdownMenu.Item asChild>
              <button
                onClick={() =>
                  signOut({
                    callbackUrl:
                      user.roleId === "maintainer"
                        ? "/login"
                        : "/customer-login",
                  })
                }
                className="hover:shadow-border focus-visible:shadow-border block w-full rounded-md px-2 py-1.5 text-left transition-all hover:text-red-800 focus-visible:text-red-800 outline-none"
              >
                Logout
              </button>
            </DropdownMenu.Item>
          </DropdownMenu.Group>
          
          <DropdownMenu.Arrow className="fill-white" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
