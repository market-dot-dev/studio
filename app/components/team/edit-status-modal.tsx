"use client";

import { TeamMember } from "@/app/app/(dashboard)/team/columns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";

interface EditStatusModalProps {
  member: TeamMember | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (memberId: string, newStatus: "Admin" | "Collaborator") => void;
}

export function EditStatusModal({ member, isOpen, onOpenChange, onSave }: EditStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<"Admin" | "Collaborator">(
    member?.status || "Collaborator"
  );

  useEffect(() => {
    if (member) {
      setSelectedStatus(member.status);
    }
  }, [member]);

  if (!member) return null;

  const handleSave = () => {
    onSave(member.id, selectedStatus);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Member Status</DialogTitle>
          <DialogDescription>Change the role for {member.name || member.email}.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <RadioGroup
            value={selectedStatus}
            onValueChange={(value) => setSelectedStatus(value as "Admin" | "Collaborator")}
          >
            <div className="hover:bg-accent hover:text-accent-foreground flex items-center space-x-2 rounded-md border p-4">
              <RadioGroupItem value="Admin" id="r1" />
              <Label htmlFor="r1" className="flex flex-col space-y-1">
                <span>Admin</span>
                <span className="text-muted-foreground text-xs font-normal">
                  Full access, can manage billing and invite/manage teammates.
                </span>
              </Label>
            </div>
            <div className="hover:bg-accent hover:text-accent-foreground flex items-center space-x-2 rounded-md border p-4">
              <RadioGroupItem value="Collaborator" id="r2" />
              <Label htmlFor="r2" className="flex flex-col space-y-1">
                <span>Collaborator</span>
                <span className="text-muted-foreground text-xs font-normal">
                  Can manage services but cannot manage billing or teammates.
                </span>
              </Label>
            </div>
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
