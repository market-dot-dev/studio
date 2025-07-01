"use client";

import { SessionUser } from "@/app/models/Session";
import { updateCurrentUser } from "@/app/services/UserService";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VisuallyHidden } from "@radix-ui/themes";
import { UserRound } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

type EditableUserFields = {
  name: string | null;
};

interface ProfileSettingsModalProps {
  user: SessionUser;
}

export default function ProfileSettingsModal({ user }: ProfileSettingsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { update } = useSession();

  const [userData, setUserData] = useState<EditableUserFields>({
    name: user.name ?? null
  });

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSaving(true);
      try {
        await updateCurrentUser({
          name: userData.name
        });

        await update();

        toast.success("Profile updated");
        setIsOpen(false);
        router.refresh();
      } catch (error) {
        console.error("Error updating user:", error);
        toast.error("An unknown error occurred");
      } finally {
        setIsSaving(false);
      }
    },
    [userData, router, update]
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="relative flex w-full cursor-default select-none items-center gap-2.5 rounded px-2 py-1.5 text-sm font-medium outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0">
          <UserRound className="!h-4.5 !w-4.5" />
          Profile
        </button>
      </DialogTrigger>
      <DialogContent className="rounded-lg p-7 shadow-border-lg md:max-w-[320px]" hideCloseButton>
        <VisuallyHidden>
          <DialogTitle>Profile Settings</DialogTitle>
        </VisuallyHidden>
        <div className="relative">
          <div className="absolute left-1/2 top-[-68px] -translate-x-1/2">
            <div className="size-20 overflow-hidden rounded-full border-4 border-background bg-muted">
              <Image
                src={user.image ?? `https://avatar.vercel.sh/${user.id}`}
                width={80}
                height={80}
                alt={user.name ?? "User avatar"}
                className="size-full object-cover shadow-border"
                priority
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-6 pt-6">
            <div className="flex w-full flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your name"
                value={userData.name ?? ""}
                onChange={(e) => {
                  setUserData({ ...userData, name: e.target.value || null });
                }}
                required
              />
            </div>
            <Button
              type="submit"
              loading={isSaving}
              loadingText="Saving Changes"
              className="w-full"
            >
              Save Changes
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
