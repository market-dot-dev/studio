"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useModal } from "@/components/modal/provider";
import { destroyContract } from "@/app/services/contract-service";

const ContractDeleteButton = ({ contractId, onConfirm, onSuccess, onError }: { contractId: string, onSuccess: any, onError: any, onConfirm: any }) => {
  const [loading, setLoading] = useState(false);
  const { show, hide } = useModal();


  const showWarning = (e: any) => {
	e.preventDefault();
	e.stopPropagation();
  const modalHeader = <h2 className="text-xl font-bold">Delete Contract</h2>
    show(
      <div className="flex flex-col gap-12 p-6">
        <p className="text-sm text-stone-500">
          Are you sure, you want to delete this contract?
        </p>
        <div className="flex gap-4">
          <Button
            size="sm"
            variant="destructive"
            loading={loading}
            loadingText="Deleting contract"
            className="w-min"
            onClick={async () => {
              setLoading(true);
              onConfirm();
              destroyContract(contractId)
                .then(() => {
                  hide();
                  onSuccess();
                })
                .catch((error) => {
                  onError(error);
                })
                .finally(() => {
                  setLoading(false);
                  hide();
                });
            }}
          >
            Delete contract
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-min"
            onClick={hide}
          >
            No, keep contract
          </Button>
        </div>
      </div>,
      hide,
      true, // ignoreFocusTrap
      modalHeader,
      "w-full md:w-2/3 lg:w-1/2",
    );
}
  return (
    <Button 
      size="sm" 
      className="w-min" 
      variant="destructive" 
      onClick={showWarning}
    >
      Delete
    </Button>
  );
}

export default ContractDeleteButton;