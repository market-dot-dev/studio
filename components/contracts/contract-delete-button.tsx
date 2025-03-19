"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { destroyContract } from "@/app/services/contract-service";
import { Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ContractDeleteButton = ({ contractId, onConfirm, onSuccess, onError }: { contractId: string, onSuccess: any, onError: any, onConfirm: any }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    onConfirm();
    
    try {
      await destroyContract(contractId);
      onSuccess();
    } catch (error) {
      onError(error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const showWarning = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  };

  return (
    <>
      <Button 
        className="w-min" 
        variant="destructive" 
        onClick={showWarning}
      >
        <Trash />
        Delete
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contract</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-stone-500">
              Are you sure you want to delete this contract?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)}>
              No, keep contract
            </AlertDialogCancel>
            <AlertDialogAction
              asChild
            >
              <Button
                variant="destructive"
                loading={loading}
                loadingText="Deleting contract"
                className="w-min"
                onClick={handleDelete}
              >
                Delete contract
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default ContractDeleteButton;