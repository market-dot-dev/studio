"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserRoundPlus } from "lucide-react";
import { PropsWithChildren } from "react";

export function InviteTeamMembersBtn({ children }: PropsWithChildren) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserRoundPlus />
          Invite Teammates
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100vh-32px)] max-w-[425px] overflow-hidden bg-stone-150 p-0 sm:max-w-[425px]">
        <ScrollArea className="max-h-[calc(100vh-32px)]">
          <div className="flex flex-col gap-5 p-6">
            <DialogHeader>
              <DialogTitle>Invite Teammates</DialogTitle>
              <DialogDescription>
                Add team members to your organization and assign their roles.
              </DialogDescription>
            </DialogHeader>
            {children}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
