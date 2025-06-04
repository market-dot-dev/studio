"use client";

import { Organization, User } from "@/app/generated/prisma";
import { updateCurrentOrganizationBusiness } from "@/app/services/organization-service";
import { updateCurrentUser } from "@/app/services/UserService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCallback, useState } from "react";
import { toast } from "sonner";

type UserPersonalData = {
  name: string | null;
  email: string | null;
};

type OrganizationBusinessData = {
  businessName: string;
};

type CustomerSettingsProps = {
  user: Pick<User, "name" | "email">;
  organization: {
    name: Organization["name"];
  };
};

export default function CustomerSettings({ user, organization }: CustomerSettingsProps) {
  const [isSaving, setIsSaving] = useState(false);

  // Separate state for user personal data
  const [userData, setUserData] = useState<UserPersonalData>({
    name: user.name ?? null,
    email: user.email ?? null
  });

  // Separate state for organization business data
  const [orgData, setOrgData] = useState<OrganizationBusinessData>({
    businessName: organization.name ?? null
  });

  const saveChanges = useCallback(async () => {
    setIsSaving(true);
    try {
      // Update user personal information
      await updateCurrentUser({
        name: userData.name,
        email: userData.email
      });

      // Update organization business information
      await updateCurrentOrganizationBusiness({
        name: orgData.businessName ?? "My company name" // Note: Updates org name, not "company" field as that was removed
      });

      toast.success("Settings updated successfully");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  }, [userData, orgData]);

  return (
    <div className="flex w-full flex-col items-start space-y-8">
      {/* Personal Information Section */}
      <div className="w-full">
        <h3 className="mb-4 text-lg font-medium">Personal Information</h3>
        <div className="max-w-md space-y-6">
          <div className="flex flex-col items-start gap-1.5">
            <Label htmlFor="name">Full Name</Label>
            <Input
              placeholder="Enter your full name"
              name="name"
              id="name"
              value={userData.name ?? ""}
              onChange={(e) => {
                setUserData({ ...userData, name: e.target.value || null });
              }}
            />
          </div>

          <div className="flex flex-col items-start gap-1.5">
            <Label htmlFor="email">Email Address</Label>
            <Input
              placeholder="Enter your email address"
              type="email"
              name="email"
              id="email"
              value={userData.email ?? ""}
              onChange={(e) => {
                setUserData({ ...userData, email: e.target.value || null });
              }}
            />
          </div>
        </div>
      </div>

      {/* Organization Information Section */}
      <div className="w-full">
        <h3 className="mb-4 text-lg font-medium">Organization Information</h3>
        <div className="max-w-md space-y-6">
          <div className="flex flex-col items-start gap-1.5">
            <Label htmlFor="business-name">Business Name</Label>
            <Input
              placeholder="Enter your business name"
              name="business-name"
              id="business-name"
              value={orgData.businessName}
              onChange={(e) => {
                setOrgData({ ...orgData, businessName: e.target.value });
              }}
              required
            />
            <p className="text-xs text-stone-500">
              This will be associated with your organization and visible to team members.
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <Button
        loading={isSaving}
        loadingText="Saving Changes"
        disabled={isSaving}
        onClick={saveChanges}
        className="w-fit"
      >
        Save Changes
      </Button>
    </div>
  );
}
