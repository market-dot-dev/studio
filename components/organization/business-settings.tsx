"use client";

import { updateCurrentOrganizationBusiness } from "@/app/services/organization-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCallback, useState } from "react";
import { toast } from "sonner";

// Type for the business-related fields from organization
type EditableBusinessFields = {
  projectName: string | null;
  projectDescription: string | null;
};

type OrganizationBusinessProps = {
  organization: {
    projectName: string | null;
    projectDescription: string | null;
  };
};

export default function BusinessSettings({ organization }: OrganizationBusinessProps) {
  const [isSaving, setIsSaving] = useState(false);

  // Extract business fields from organization
  const [businessData, setBusinessData] = useState<EditableBusinessFields>({
    projectName: organization.projectName ?? null,
    projectDescription: organization.projectDescription ?? null
  });

  const saveChanges = useCallback(async () => {
    setIsSaving(true);
    try {
      await updateCurrentOrganizationBusiness({
        projectName: businessData.projectName,
        projectDescription: businessData.projectDescription
      });

      // Use Object.prototype.hasOwnProperty.call instead of direct method access
      if (window && Object.prototype.hasOwnProperty.call(window, "refreshOnboarding")) {
        (window as any).refreshOnboarding();
      }

      toast.success("Organization information updated");
    } catch (error) {
      console.error("Error updating organization information:", error);
      toast.error("An unknown error occurred");
    } finally {
      setIsSaving(false);
    }
  }, [businessData]);

  return (
    <div className="flex w-full items-start justify-between gap-12 lg:max-w-xl">
      <div className="flex flex-col items-start space-y-6">
        <div className="flex w-full flex-col gap-2">
          <Label htmlFor="project-name">Organization Name</Label>
          <Input
            placeholder="Enter your organization's name"
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
            <Label htmlFor="project-description" className="mb-1">
              Organization Description
            </Label>
            <p className="text-xs text-stone-500">
              Your organization description is used in your landing page's homepage (and other pages
              where you embed the {`<SiteDescription>`} component).
            </p>
          </div>
          <Textarea
            className="min-h-40"
            placeholder="Describe your organization"
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

        <Button loading={isSaving} disabled={isSaving} onClick={saveChanges}>
          Save
        </Button>
      </div>
    </div>
  );
}
