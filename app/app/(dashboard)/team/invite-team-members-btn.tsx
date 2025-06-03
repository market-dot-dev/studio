"use client";

import { OrganizationRole } from "@/app/generated/prisma";
import { inviteUsersToOrganization } from "@/app/services/team-management-service";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CircleMinus, CirclePlus, Send, UserRoundPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate a simple unique ID for field keys inside this component
const generateId = (): string => {
  return `invite-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

interface TeamMemberInvite {
  id: string;
  email: string;
  role: OrganizationRole;
}

export function InviteTeamMembersBtn() {
  const [isOpen, setIsOpen] = useState(false);
  const [invites, setInvites] = useState<TeamMemberInvite[]>([
    { id: generateId(), email: "", role: OrganizationRole.MEMBER }
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const addInvite = () => {
    setInvites([...invites, { id: generateId(), email: "", role: OrganizationRole.MEMBER }]);
  };

  const removeInvite = (id: string) => {
    if (invites.length > 1) {
      setInvites(invites.filter((invite) => invite.id !== id));
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const updateInviteEmail = (id: string, email: string) => {
    setInvites(invites.map((invite) => (invite.id === id ? { ...invite, email } : invite)));

    // Clear error for this field when user starts typing
    if (errors[id]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const updateInviteRole = (id: string, role: OrganizationRole) => {
    setInvites(invites.map((invite) => (invite.id === id ? { ...invite, role } : invite)));
  };

  const validateInvites = (): boolean => {
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    invites.forEach((invite) => {
      if (!invite.email.trim()) {
        newErrors[invite.id] = "Email address is required";
        hasErrors = true;
      } else if (!isValidEmail(invite.email)) {
        newErrors[invite.id] = "Invalid email address";
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleInvite = () => {
    if (!validateInvites()) {
      return;
    }

    const validInvites = invites.filter((invite) => invite.email.trim());

    if (validInvites.length === 0) {
      return;
    }

    startTransition(async () => {
      try {
        // Group invites by role to make separate API calls
        const memberEmails = validInvites
          .filter((invite) => invite.role === OrganizationRole.MEMBER)
          .map((invite) => invite.email);

        const adminEmails = validInvites
          .filter((invite) => invite.role === OrganizationRole.ADMIN)
          .map((invite) => invite.email);

        let totalSuccess = 0;
        const allErrors: string[] = [];

        // Send member invites
        if (memberEmails.length > 0) {
          const memberResult = await inviteUsersToOrganization(
            memberEmails,
            OrganizationRole.MEMBER
          );
          totalSuccess += memberResult.success.length;
          allErrors.push(...memberResult.errors);
        }

        // Send admin invites
        if (adminEmails.length > 0) {
          const adminResult = await inviteUsersToOrganization(adminEmails, OrganizationRole.ADMIN);
          totalSuccess += adminResult.success.length;
          allErrors.push(...adminResult.errors);
        }

        if (totalSuccess > 0) {
          toast.success(`Successfully invited ${totalSuccess} user(s)`);
        }

        if (allErrors.length > 0) {
          allErrors.forEach((error) => toast.error(error));
        }

        setInvites([{ id: generateId(), email: "", role: OrganizationRole.MEMBER }]);
        setErrors({});
        setIsOpen(false);
        router.refresh();
      } catch (error: any) {
        console.error("Error inviting users:", error);
        toast.error(error.message || "Failed to send invitations");
      }
    });
  };

  const validInviteCount = invites.filter((invite) => invite.email.trim()).length;
  const isDisabled = validInviteCount === 0 || isPending;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={isPending}>
          <UserRoundPlus />
          Invite Teammates
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100vh-32px)] max-w-[425px] overflow-hidden p-0 sm:max-w-[425px]">
        <ScrollArea className="max-h-[calc(100vh-32px)]">
          <div className="flex flex-col gap-4 p-6">
            <DialogHeader>
              <DialogTitle>Invite Teammates</DialogTitle>
              <DialogDescription>
                Add team members to your organization and assign their roles.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2">
              {invites.map((invite, index) => (
                <div key={invite.id} className="flex flex-col gap-1">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-1 rounded shadow-border-sm">
                      <Input
                        placeholder="team@example.com"
                        value={invite.email}
                        onChange={(e) => updateInviteEmail(invite.id, e.target.value)}
                        className={cn(
                          "flex-1 shadow-none rounded-r-none",
                          errors[invite.id] && "border-destructive"
                        )}
                      />
                      <Select
                        value={invite.role}
                        onValueChange={(value: OrganizationRole) =>
                          updateInviteRole(invite.id, value)
                        }
                      >
                        <SelectTrigger className="h-9 w-32 rounded-l-none border-l shadow-none focus:z-[1] md:h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                          <SelectItem value={OrganizationRole.MEMBER}>Member</SelectItem>
                          <SelectItem value={OrganizationRole.ADMIN}>Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {invites.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeInvite(invite.id)}
                        className="-mx-2 h-9 rounded-full text-stone-400 hover:bg-transparent focus:bg-transparent md:h-8"
                      >
                        <CircleMinus className="size-4" />
                      </Button>
                    )}
                  </div>
                  {errors[invite.id] && (
                    <p className="my-1 text-xs text-destructive">{errors[invite.id]}</p>
                  )}
                </div>
              ))}

              <Button
                variant="ghost"
                onClick={addInvite}
                className="ml-1.5 w-fit p-0 text-muted-foreground hover:bg-transparent focus:bg-transparent"
              >
                <CirclePlus className="size-4" />
                Add Teammate
              </Button>
            </div>
            <DialogFooter className="pt-1">
              <Button
                onClick={handleInvite}
                disabled={isDisabled || isPending}
                loading={isPending}
                loadingText="Sending Invites"
                className="w-full"
              >
                <Send />
                Send Invites
              </Button>
            </DialogFooter>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
