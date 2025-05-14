"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import Image from "next/image";

export default function UserDropdown({ user }: { user: any }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="flex items-center justify-center rounded-full hover:bg-white/10 hover:opacity-95 focus:bg-white/10 focus:opacity-95"
          aria-label="User menu"
        >
          <Image
            src={user.image ?? `https://avatar.vercel.sh/${user.id}`}
            width={24}
            height={24}
            alt={user.name ?? "User avatar"}
            className="size-6 rounded-full"
            priority
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="z-40 w-[250px]" sideOffset={5} align="end" alignOffset={0}>
        <div className="flex items-center gap-3 p-2">
          <Image
            src={user.image ?? `https://avatar.vercel.sh/${user.id}`}
            width={28}
            height={28}
            alt={user.name ?? "User avatar"}
            className="size-6 rounded-full"
            priority
          />
          <h3 className="text-sm font-semibold tracking-tightish">{user.name}</h3>
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() =>
              signOut({
                callbackUrl: user.roleId === "maintainer" ? "/login" : "/customer-login"
              })
            }
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
