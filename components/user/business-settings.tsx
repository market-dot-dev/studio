"use client";

import { updateCurrentUser } from "@/app/services/UserService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@prisma/client";
import { useCallback, useState } from "react";
import { toast } from "sonner";

// Type for the business-related fields we can update
type EditableBusinessFields = {
  projectName: string | null;
  projectDescription: string | null;
};

export default function BusinessSettings({ user }: { user: Partial<User> }) {
  const [isSaving, setIsSaving] = useState(false);

  // Extract only the business fields we want to edit
  const [businessData, setBusinessData] = useState<EditableBusinessFields>({
    projectName: user.projectName ?? null,
    projectDescription: user.projectDescription ?? null
  });

  const saveChanges = useCallback(async () => {
    setIsSaving(true);
    try {
      await updateCurrentUser({
        projectName: businessData.projectName,
        projectDescription: businessData.projectDescription
      });

      // Use Object.prototype.hasOwnProperty.call instead of direct method access
      if (window && Object.prototype.hasOwnProperty.call(window, "refreshOnboarding")) {
        (window as any).refreshOnboarding();
      }

      toast.success("Business information updated");
    } catch (error) {
      console.error("Error updating business information:", error);
      toast.error("An unknown error occurred");
    } finally {
      setIsSaving(false);
    }
  }, [businessData]);

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
              placeholder="Enter your business name"
              name="project-name"
              id="project-name"
              value={businessData.projectName ?? ""}
              onChange={(e) => {
                setBusinessData({
                  ...businessData,
                  projectName: e.target.value || null
                });
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
              placeholder="Describe your business"
              name="project-description"
              id="project-description"
              value={businessData.projectDescription ?? ""}
              onChange={(e) => {
                setBusinessData({
                  ...businessData,
                  projectDescription: e.target.value || null
                });
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
      </div>
    </>
  );
}
