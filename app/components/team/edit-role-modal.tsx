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
import { cn } from "@/lib/utils";
import { Key, Lock } from "lucide-react";
import { useEffect, useState } from "react";

interface EditRoleModalProps {
  member: TeamMember | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (memberId: string, newStatus: "Admin" | "Collaborator") => void;
}

export function EditRoleModal({ member, isOpen, onOpenChange, onSave }: EditRoleModalProps) {
  const [selectedRole, setSelectedRole] = useState<"Admin" | "Collaborator">(
    member?.status || "Collaborator"
  );

  useEffect(() => {
    if (member) {
      setSelectedRole(member.status);
    }
  }, [member]);

  if (!member) return null;

  const handleSave = () => {
    onSave(member.id, selectedRole);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-stone-100 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Role for {member.name || member.email}</DialogTitle>
          <DialogDescription>
            Select the role you want to assign to this team member.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="flex flex-col gap-2">
            {/* Admin Option */}
            <label className="flex size-full rounded focus-within:outline-none focus-within:ring-2 focus-within:ring-inset focus-within:ring-swamp">
              <div
                className={cn(
                  "flex h-full w-full flex-col items-start justify-start gap-1.5 rounded bg-white p-4 pt-3.5 shadow-border-sm transition-[background-color,box-shadow] cursor-pointer hover:shadow-border [&:has(input:checked)]:ring-2 [&:has(input:checked)]:ring-swamp"
                )}
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center">
                    <Key className="mr-2.5 size-[18px] text-stone-500" />
                    <span className="text-left text-sm font-semibold text-stone-800">Admin</span>
                  </div>
                  <input
                    id="status-admin"
                    type="radio"
                    name="member-status"
                    value="Admin"
                    className="border-stone-400 shadow-sm checked:border-swamp checked:text-swamp focus:outline-none focus:ring-0"
                    checked={selectedRole === "Admin"}
                    onChange={(e) => setSelectedRole(e.target.value as "Admin" | "Collaborator")}
                  />
                </div>
                <p className="text-pretty pr-8 text-left text-xs leading-4 text-stone-500">
                  Full access, can manage billing and invite/manage teammates.
                </p>
              </div>
            </label>

            {/* Collaborator Option */}
            <label className="flex size-full rounded focus-within:outline-none focus-within:ring-2 focus-within:ring-inset focus-within:ring-swamp">
              <div
                className={cn(
                  "flex h-full w-full flex-col items-start justify-start gap-1.5 rounded bg-white p-4 pt-3.5 shadow-border-sm transition-[background-color,box-shadow] cursor-pointer hover:shadow-border [&:has(input:checked)]:ring-2 [&:has(input:checked)]:ring-swamp"
                )}
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center">
                    <Lock className="mr-2.5 size-[18px] text-stone-500" />
                    <span className="text-left text-sm font-semibold text-stone-800">
                      Collaborator
                    </span>
                  </div>
                  <input
                    id="status-collaborator"
                    type="radio"
                    name="member-status"
                    value="Collaborator"
                    className="border-stone-400 shadow-sm checked:border-swamp checked:text-swamp focus:outline-none focus:ring-0"
                    checked={selectedRole === "Collaborator"}
                    onChange={(e) => setSelectedRole(e.target.value as "Admin" | "Collaborator")}
                  />
                </div>
                <p className="text-pretty pr-8 text-left text-xs leading-4 text-stone-500">
                  Can manage services but cannot manage billing or teammates.
                </p>
              </div>
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={selectedRole === member.status}>
            Change Role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
