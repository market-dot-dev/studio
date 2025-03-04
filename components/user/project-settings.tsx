"use client";
import { TextInput, Textarea, Button, Text } from "@tremor/react";
import { User } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import { updateCurrentUser } from "@/app/services/UserService";
import { toast } from "sonner";

export default function BusinessSettings({ user }: { user: Partial<User> }) {
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState<Partial<User>>(user);

  const saveChanges = useCallback(async () => {
    setIsSaving(true);
    try {
      await updateCurrentUser(userData);

      // call the refreshOnboarding function if it exists
      if (window?.hasOwnProperty("refreshOnboarding")) {
        (window as any)["refreshOnboarding"]();
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
      <div className="flex justify-between items-start w-full gap-12">
        <div className="flex flex-col items-start w-1/2 space-y-6">
          <div className="flex flex-col items-start w-full gap-2">
            <label
              htmlFor="project-name"
              className="block text-sm font-medium text-gray-700"
            >
              Business Name
            </label>
            <Text>Provide a name for your business, if you have one.</Text>
            <TextInput
              placeholder=""
              name="project-name"
              id="project-name"
              value={userData.projectName ?? ""}
              onChange={(e) => {
                setUserData({ ...userData, projectName: e.target.value });
              }}
            />
          </div>

          <div className="flex flex-col items-start w-full gap-2">
            <label
              htmlFor="project-description"
              className="block text-sm font-medium text-gray-700"
            >
              Business Description
            </label>
            <Text>
              Your business description is used in your store homepage (and other
              pages where you embed the {`<SiteDescription>`} component).
            </Text>
            <Textarea
              className="h-52"
              placeholder=""
              name="project-description"
              id="project-description"
              value={userData.projectDescription ?? ""}
              onChange={(e) => {
                setUserData({
                  ...userData,
                  projectDescription: e.target.value,
                });
              }}
            />
          </div>

          <Button loading={isSaving} disabled={isSaving} onClick={saveChanges}>
            Save Changes
          </Button>
        </div>
      </div>
    </>
  );
}
