"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SessionUser } from "@/types/session";
import { UserRoundCheck } from "lucide-react";

interface UserDisplayProps {
  user: SessionUser;
  onLogout: () => Promise<void>;
  isLoading: boolean;
}

export function UserDisplay({ user, onLogout, isLoading }: UserDisplayProps) {
  return (
    <Card className="flex min-h-[60px] w-full items-center justify-between gap-4 px-5 py-4">
      <div className="flex items-start gap-3 overflow-auto">
        <UserRoundCheck className="my-0.5 size-5 shrink-0 text-stone-500" />
        <div className="text-medium flex flex-wrap items-baseline gap-x-2 self-center overflow-auto text-sm text-stone-500">
          <span className="text-base font-bold tracking-tightish text-stone-800">{user.name}</span>
          <span className="truncate leading-6">{user.email}</span>
        </div>
      </div>
      <Button
        size="sm"
        variant="outline"
        loading={isLoading}
        disabled={isLoading}
        onClick={onLogout}
      >
        Logout
      </Button>
    </Card>
  );
}
