import { getContractById } from "@/app/services/contract-service";

export default async function ContractPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const contract = await getContractById(id);
  return (
    <div>
      <h1>ContractPage {id}</h1>
      {contract?.attachmentUrl && (
        <a href={contract.attachmentUrl}>View Contract</a>
      )}
    </div>
  );
}
