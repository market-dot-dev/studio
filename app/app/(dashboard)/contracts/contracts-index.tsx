"use client";

import { Button } from "@tremor/react";
import { Contract } from "@prisma/client";
import { useState } from "react";
import { destroyContract } from "@/app/services/contract-service";
import useCurrentSession from "@/app/hooks/use-current-session";
import Link from "next/link";
import LoadingDots from "@/components/icons/loading-dots";

export default function ContractSettings({
  contracts,
}: {
  contracts: Contract[];
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null,
  );
  const { currentUser } = useCurrentSession();

  const handleDelete = async (contractId: string) => {
    setError(null);
    setIsDeleting(true);
    try {
      await destroyContract(contractId);
      setSelectedContract(null);
    } catch (error) {
      setError(error as { message: string });
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleView = (contract: Contract) => {
    window.location.href = `/contracts/${contract.id}`;
  };

  const ownsContract = selectedContract?.maintainerId === currentUser?.id;

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Available Contracts</h2>
        <Link href="/contracts/create">
          <Button>Create Contract</Button>
        </Link>
      </div>

      <div className="mt-8">
        {error && <p className="text-red-500">{error.message}</p>}
        {contracts.map((contract) => (
          <div
            key={contract.id}
            className="mb-4 flex items-center justify-between"
          >
            <div>
              <h3
                className="text-lg font-semibold"
                onClick={() => handleView(contract)}
              >
                {contract.name}
              </h3>
              <p className="text-gray-600">{contract.description}</p>
            </div>
            <div>
              {contract.maintainerId === currentUser?.id && (
                <>
                  <Button
                    onClick={() =>
                      (window.location.href = `/contracts/${contract.id}/edit`)
                    }
                  >
                    Edit
                  </Button>
                  {isDeleting ? (
                    <LoadingDots />
                  ) : (
                    <Button
                      onClick={() => handleDelete(contract.id)}
                      className="ml-2"
                    >
                      Delete
                    </Button>
                  )}
                </>
              )}
              {contract.maintainerId === null && (
                <Button onClick={() => handleView(contract)}>View</Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
