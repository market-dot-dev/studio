"use client";

import useCurrentSession from "@/app/hooks/use-current-session";
import { updateCurrentUser } from "@/app/services/UserService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";

export default function CustomerSettings() {
  const { currentUser, refreshSession } = useCurrentSession();
  type UserAttrs = Pick<User, "name" | "email" | "company">;

  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState<UserAttrs>({} as UserAttrs);

  useEffect(() => {
    if (currentUser) {
      setUserData({
        name: currentUser.name || null,
        email: currentUser.email || null,
        company: currentUser.company || null
      });
    }
  }, [currentUser]);

  const saveChanges = useCallback(async () => {
    setIsSaving(true);
    try {
      await updateCurrentUser(userData as Partial<User>);
      await refreshSession();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  }, [userData, refreshSession]);

  return (
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

      <div className="flex w-1/2 flex-col items-start gap-1.5">
        <Label htmlFor="company">Company</Label>
        <Input
          placeholder=""
          name="company"
          id="company"
          value={userData.company ?? ""}
          onChange={(e) => {
            setUserData({ ...userData, company: e.target.value });
          }}
        />
      </div>

      <Button loading={isSaving} loadingText="Saving Changes" onClick={saveChanges}>
        Save
      </Button>
    </div>
  );
}
