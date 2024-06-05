import { getContractById } from "@/app/services/contract-service";
import LinkButton from "@/components/common/link-button";
import { Contract } from "@prisma/client";
import { Button } from "@tremor/react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
  contract: Contract;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const contract = await getContractById(params.id);

  if (!contract) {
    return {
      title: "Contract Not Found",
    };
   }

  return {
    title: contract.name,
    description: contract.description,
  };
}

export default async function ContractPage({ contract }: { contract: Contract }) {
  if (!contract) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-semibold mb-4">{contract.name}</h1>
      <p className="text-gray-600 mb-6">{contract.description}</p>

      <div className="mb-8">
        <div>Contract type: { contract.storage }</div>
        <div>Preview: <LinkButton href={`/c/contracts/${contract.id}`}>Go</LinkButton></div>
        {contract.url && (
          <a href={contract.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            View Contract
          </a>
        )}
        {contract.attachmentUrl && <>
          <div>Attachment type: { contract.attachmentType }</div>
          <a href={contract.attachmentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            Download Attachment
          </a>
        </>}
      </div>

      <Link href="/maintainer/contracts" className="text-blue-500 hover:underline">
        Back to Contracts
      </Link>
    </div>
  );
 }