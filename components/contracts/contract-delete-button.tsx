"use client";

import { Button, Title } from "@tremor/react";
import { useState } from "react";
import LoadingDots from "@/components/icons/loading-dots";
import { useModal } from "@/components/modal/provider";
import { destroyContract } from "@/app/services/contract-service";

const ContractDeleteButton = ({ contractId, onConfirm, onSuccess, onError }: { contractId: string, onSuccess: any, onError: any, onConfirm: any }) => {
  const [loading, setLoading] = useState(false);
  const { show, hide } = useModal();


  const showWarning = (e: any) => {
	e.preventDefault();
	e.stopPropagation();
  const modalHeader = <Title>Delete Contract</Title>
    show(
        <div className="flex flex-col gap-12 p-6">
          <p className="text-sm text-stone-500">Are you sure, you want to delete this contract?</p>
          <div className="flex gap-4">
           <Button size="xs" className="w-min" variant="primary" color="red" onClick={async() => {
            setLoading(true);
			onConfirm();
            destroyContract(contractId).
				then(() => {
					hide();
					onSuccess();
				})
				.catch((error) => {
					onError(error)
				}).
				finally(() => {
					setLoading(false)
					hide();
				});
          }} >
            {loading ? <>Deleting Contract&nbsp;<LoadingDots color="#A8A29E" /></> : "Delete Contract"}
          </Button>
          <Button size="xs" className="w-min" variant="secondary" onClick={hide}>No, Keep Contract</Button>
          </div>
        </div>,
        hide,
        true, // ignoreFocusTrap
        modalHeader,
        'w-full md:w-2/3 lg:w-1/2'
    );
}
  return (
    <Button size="xs" className="w-min" variant="primary" color="red" onClick={showWarning}>Delete</Button>
  );
}

export default ContractDeleteButton;