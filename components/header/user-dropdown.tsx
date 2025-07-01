"use client";

import { OrganizationType } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { SessionUser } from "@/types/session";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import ProfileSettingsModal from "./profile-settings-modal";

export default function UserDropdown({ user }: { user: SessionUser }) {
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

      <DropdownMenuContent className="z-40 w-[225px]" sideOffset={5} align="end" alignOffset={0}>
        <div className="flex items-center gap-3 py-1 pl-[5px] pr-3">
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
          <DropdownMenuItem asChild>
            <ProfileSettingsModal user={user} />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              signOut({
                callbackUrl:
                  user.currentOrgType === OrganizationType.VENDOR ? "/login" : "/customer-login"
              })
            }
          >
            <LogOut className="!h-4.5 !w-4.5" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
