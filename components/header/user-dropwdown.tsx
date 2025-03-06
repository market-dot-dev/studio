"use client";

import React from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";

export default function UserDropwdown({ user }: { user: any }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="flex items-center justify-center rounded-full hover:bg-white/10 hover:opacity-95 focus:bg-white/10 focus:opacity-95"
          aria-label="User menu"
        >
          <Image
            src={user.image ?? `https://avatar.vercel.sh/${user.id}`}
            width={32}
            height={32}
            alt={user.name ?? "User avatar"}
            className="h-7 w-7 rounded-full"
          />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-[40] w-[250px] rounded-md bg-white text-sm font-medium shadow-border-lg"
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
              <Button
                variant="ghost"
                className="w-full justify-start text-left hover:text-rose-800 focus-visible:text-rose-800 hover:bg-white hover:shadow-border focus:text-rose-800 focus:bg-white focus:shadow-border"
                onClick={() =>
                  signOut({
                    callbackUrl:
                      user.roleId === "maintainer"
                        ? "/login"
                        : "/customer-login",
                  })
                }
              >
                Logout
              </Button>
            </DropdownMenu.Item>
          </DropdownMenu.Group>

          <DropdownMenu.Arrow className="fill-white" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
