import { User } from "@/app/generated/prisma";
import { updateCurrentUser } from "@/app/services/UserService";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRound } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { toast } from "sonner";

// Type for the fields we can update
type EditableUserFields = {
  name: string | null;
  email: string | null;
};

interface ProfileSettingsModalProps {
  user: Partial<User>;
}

export default function ProfileSettingsModal({ user }: ProfileSettingsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Extract only the editable fields we care about
  const [userData, setUserData] = useState<EditableUserFields>({
    name: user.name ?? null,
    email: user.email ?? null
  });

  const saveChanges = useCallback(async () => {
    setIsSaving(true);
    try {
      await updateCurrentUser({
        name: userData.name,
        email: userData.email
      });
      toast.success("Profile updated");
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("An unknown error occurred");
    } finally {
      setIsSaving(false);
    }
  }, [userData]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="relative flex w-full cursor-default select-none items-center gap-2.5 rounded px-2 py-1.5 text-sm font-medium outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0">
          <UserRound className="!h-4.5 !w-4.5" />
          Profile
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-[320px] rounded-lg p-7 shadow-border-lg" hideCloseButton>
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

          <div className="grid gap-5 py-6">
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
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={userData.email ?? ""}
                onChange={(e) => {
                  setUserData({ ...userData, email: e.target.value || null });
                }}
              />
            </div>
          </div>
          <Button
            loading={isSaving}
            loadingText="Saving..."
            disabled={isSaving}
            onClick={saveChanges}
            className="w-full"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
