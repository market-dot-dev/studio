import Link from "next/link";
import { Contract } from "@prisma/client";
import { getRootUrl } from "@/lib/domain";

const ContractLink = ({ contract }: { contract?: Contract }) => {
  const baseUrl = getRootUrl("app", "/c/contracts");
  const url = contract
    ? `${baseUrl}/${contract.id}`
    : `${baseUrl}/standard-msa`;
  const contractName = contract?.name || "Standard MSA";

  return (
    <p className="text-sm font-medium">
      <Link href={url} className="underline" target="_blank">
        {contractName}
      </Link>
    </p>
  );
};

export default ContractLink; 