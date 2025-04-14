"use client";

import { updateCurrentUser } from "@/app/services/UserService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@prisma/client";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export default function GeneralSettings({ user }: { user: Partial<User> }) {
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState<Partial<User>>(user);

  const saveChanges = useCallback(async () => {
    setIsSaving(true);
    try {
      await updateCurrentUser(userData);
      toast.success("Settings updated");
    } catch (error) {
      console.log(error);
      toast.error("An unknown error occurred");
    } finally {
      setIsSaving(false);
    }
  }, [userData]);

  return (
    <>
      <div className="flex w-full flex-col items-start space-y-6">
        <div className="flex w-1/2 flex-col items-start gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            placeholder=""
            name="name"
            id="name"
            value={userData.name ?? ""}
            onChange={(e) => {
              setUserData({ ...userData, name: e.target.value });
            }}
          />
        </div>

        <div className="flex w-1/2 flex-col items-start gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            placeholder=""
            type="email"
            name="email"
            id="email"
            value={userData.email ?? ""}
            onChange={(e) => {
              setUserData({ ...userData, email: e.target.value });
            }}
          />
        </div>

        <Button
          loading={isSaving}
          loadingText="Saving Changes"
          disabled={isSaving}
          onClick={saveChanges}
        >
          Save
        </Button>
      </div>
    </>
  );
}
