import { Contract } from "@prisma/client";
import { useEffect, useState } from "react";
import { getContractById } from "../services/contract-service";

const useContract = (id: string | undefined) => {
  const [contract, setContract] = useState<Contract>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) {
      return;
    }

    getContractById(id)
      .then((contract) => {
        if (contract) {
          setContract(contract);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [id]);

  return [contract, isLoading] as const;
};

export default useContract;
