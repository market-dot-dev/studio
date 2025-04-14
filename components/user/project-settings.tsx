"use client";

import { updateCurrentUser } from "@/app/services/UserService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@prisma/client";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export default function BusinessSettings({ user }: { user: Partial<User> }) {
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState<Partial<User>>(user);

  const saveChanges = useCallback(async () => {
    setIsSaving(true);
    try {
      await updateCurrentUser(userData);

      // Use Object.prototype.hasOwnProperty.call instead of direct method access
      if (window && Object.prototype.hasOwnProperty.call(window, "refreshOnboarding")) {
        (window as any).refreshOnboarding();
      }

      toast.success("Project updated");
    } catch (error) {
      console.log(error);
      toast.error("An unknown error occurred");
    } finally {
      setIsSaving(false);
    }
  }, [userData]);

  return (
    <>
      <div className="flex w-full items-start justify-between gap-12">
        <div className="flex w-1/2 flex-col items-start space-y-6">
          <div className="flex flex-col gap-2">
            <div>
              <Label htmlFor="project-name" className="mb-0.5">
                Business Name
              </Label>
              <p className="text-xs text-stone-500">
                Provide a name for your business, if you have one.
              </p>
            </div>
            <Input
              placeholder=""
              name="project-name"
              id="project-name"
              value={userData.projectName ?? ""}
              onChange={(e) => {
                setUserData({ ...userData, projectName: e.target.value });
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div>
              <Label htmlFor="project-description" className="mb-0.5">
                Business Description
              </Label>
              <p className="text-xs text-stone-500">
                Your business description is used in your store homepage (and other pages where you
                embed the {`<SiteDescription>`} component).
              </p>
            </div>
            <Textarea
              className="h-52"
              placeholder=""
              name="project-description"
              id="project-description"
              value={userData.projectDescription ?? ""}
              onChange={(e) => {
                setUserData({
                  ...userData,
                  projectDescription: e.target.value
                });
              }}
            />
          </div>

          <Button loading={isSaving} loadingText="Saving Changes" onClick={saveChanges}>
            Save
          </Button>
        </div>
      </div>
    </>
  );
}
