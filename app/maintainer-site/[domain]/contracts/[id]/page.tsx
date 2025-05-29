import { getContractById } from "@/app/services/contract-service";

// @TODO: This doesn't appear to be a finished version?
export default async function ContractPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const contract = await getContractById(params.id);
  return (
    <div>
      <h1>ContractPage {params.id}</h1>
      {contract?.attachmentUrl && <a href={contract.attachmentUrl}>View Contract</a>}
    </div>
  );
}
