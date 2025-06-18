"use client";

import { Organization } from "@/app/generated/prisma";
import { updateCurrentOrganizationBusiness } from "@/app/services/organization-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCallback, useState } from "react";
import { toast } from "sonner";

// Type for the business-related fields from organization
type EditableBusinessFields = {
  name: string; // Required
  description: string | null;
};

type OrganizationBusinessProps = {
  organization: {
    name: Organization["name"];
    description: Organization["description"];
  };
};

export default function BusinessSettings({ organization }: OrganizationBusinessProps) {
  const [isSaving, setIsSaving] = useState(false);

  // Extract business fields from organization
  const [businessData, setBusinessData] = useState<EditableBusinessFields>({
    name: organization.name,
    description: organization.description ?? null
  });

  // Validation helper
  const isNameValid = useCallback(() => {
    return businessData.name.trim().length > 0;
  }, [businessData.name]);

  const saveChanges = useCallback(async () => {
    // Validate name before saving
    if (!isNameValid()) {
      toast.error("Organization name is required");
      return;
    }

    setIsSaving(true);
    try {
      await updateCurrentOrganizationBusiness({
        name: businessData.name.trim(), // Trim whitespace
        description: businessData.description
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
  }, [businessData, isNameValid]);

  return (
    <div className="flex w-full items-start justify-between gap-12 lg:max-w-xl">
      <div className="flex flex-col items-start space-y-6">
        <div className="flex w-full flex-col gap-2">
          <Label htmlFor="name">Organization Name</Label>
          <Input
            placeholder="Enter your organization's name"
            name="name"
            id="name"
            value={businessData.name}
            onChange={(e) => {
              setBusinessData({
                ...businessData,
                name: e.target.value
              });
            }}
            required
            className={!isNameValid() && businessData.name.length === 0 ? "border-red-500" : ""}
          />
          {!isNameValid() && businessData.name.length === 0 && (
            <p className="text-xs text-red-500">Organization name is required</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div>
            <Label htmlFor="description" className="mb-1">
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
            name="description"
            id="description"
            value={businessData.description ?? ""}
            onChange={(e) => {
              setBusinessData({
                ...businessData,
                description: e.target.value || null
              });
            }}
          />
        </div>

        <Button loading={isSaving} disabled={isSaving || !isNameValid()} onClick={saveChanges}>
          Save
        </Button>
      </div>
    </div>
  );
}
