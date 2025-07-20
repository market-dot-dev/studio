"use client";

import { ONBOARDING_BASE_URL } from "@/app/services/onboarding/onboarding-steps";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { createOrganizationAction, type CreateOrganizationFormState } from "./actions";

const initialState: CreateOrganizationFormState = {
  message: "",
  success: false
};

export function CreateOrganizationModal() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { update: updateSession } = useSession();
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(createOrganizationAction, initialState);

  // useRef to prevent double-firing of effect in Strict Mode
  const prevStateRef = useRef<typeof initialState>(initialState);

  useEffect(() => {
    if (state !== prevStateRef.current) {
      if (state.success) {
        toast.success("Organization created! Setting up your workspace...");

        // Update session to include new organization context, then redirect
        updateSession().then(() => {
          router.push(ONBOARDING_BASE_URL);
        });

        // @NOTE: We don't close the modal here
      } else if (state.message) {
        toast.error(state.message);
      }
    }
    prevStateRef.current = state;
  }, [state, updateSession, router]);

  // Reset form and state when modal closes
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      formRef.current?.reset();
      // Reset the action state by triggering with empty form data
      if (!isPending) {
        // Only reset if not currently pending to avoid interference
        prevStateRef.current = initialState;
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full gap-2" variant="outline">
          <Building className="size-4" />
          Create a new organization
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Organization</DialogTitle>
          <DialogDescription>
            Create a new organization to start selling your products and services.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="organizationName">Organization Name</Label>
            <Input
              id="organizationName"
              name="organizationName"
              placeholder="Your Organization Name"
              required
              disabled={isPending}
              autoFocus
            />
          </div>

          {/* Display error messages returned from the server action */}
          {state.message && !isPending && !state.success && (
            <p aria-live="polite" className="text-sm text-destructive">
              {state.message}
            </p>
          )}

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Organization"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
