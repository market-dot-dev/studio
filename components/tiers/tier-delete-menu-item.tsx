"use client";

import { deleteTier } from "@/app/services/tier/tier-service";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export function TierDeleteMenuItem({
  tierId,
  onConfirm,
  onSuccess,
  onError,
  canDelete
}: {
  tierId: string;
  onSuccess: any;
  onError: any;
  onConfirm: any;
  canDelete: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    if (!canDelete || loading) return;

    setLoading(true);
    onConfirm();
    try {
      await deleteTier(tierId);
      onSuccess();
    } catch (error) {
      onError(error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <DropdownMenuItem
        disabled={loading || !canDelete}
        data-cy={`delete-tier-menu-item-${tierId}`}
        onClick={(e) => {
          e.preventDefault();
          if (canDelete) {
            setOpen(true);
          }
        }}
        destructive={canDelete}
      >
        <Trash2 />
        Delete
      </DropdownMenuItem>

      {canDelete && (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent className="max-w-[calc(100vw-32px)] rounded-lg xs:max-w-sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Package</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this package?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpen(false)} disabled={loading}>
                No, keep package
              </AlertDialogCancel>
              <AlertDialogAction variant="destructive" asChild>
                <Button onClick={handleDelete} disabled={loading}>
                  Delete package
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
