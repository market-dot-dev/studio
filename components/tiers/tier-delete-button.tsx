"use client";

import { Button, Text } from "@tremor/react";
import { useState } from "react";
import LoadingDots from "@/components/icons/loading-dots";
import { useModal } from "@/components/modal/provider";
import { destroyTier } from "@/app/services/TierService";

const ContractDeleteButton = ({ tierId, onConfirm, onSuccess, onError }: { tierId: string, onSuccess: any, onError: any, onConfirm: any }) => {
  const [loading, setLoading] = useState(false);
  const { show, hide } = useModal();


  const showWarning = (e: any) => {
	e.preventDefault();
	e.stopPropagation();
    show(
        <div className="flex flex-col gap-12 bg-white p-6 border shadow-2xl w-full md:w-2/3 lg:w-1/2 rounded-md">
          <Text>Are you sure, you want to delete this package?</Text>
          <div className="flex gap-4">
           <Button size="xs" className="w-min" variant="primary" color="red" onClick={async() => {
            setLoading(true);
			onConfirm();
            destroyTier(tierId).
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
            {loading ? <>Deleting Package&nbsp;<LoadingDots color="#A8A29E" /></> : "Delete Package"}
          </Button>
          <Button size="xs" className="w-min" variant="secondary" onClick={hide}>No, Keep Package</Button>
          </div>
        </div>,
        hide,
        true // ignoreFocusTrap
    );
}
  return (
    <Button size="xs" className="w-min" variant="primary" color="red" onClick={showWarning}>Delete</Button>
  );
}

export default ContractDeleteButton;