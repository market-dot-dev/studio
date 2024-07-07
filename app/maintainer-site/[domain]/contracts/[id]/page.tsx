import { getContractById } from "@/app/services/contract-service";

export default async function ContractPage({ params }: { params: { id: string } }) {
	const contract = await getContractById(params.id);
	  return (
		<div>
		<h1>ContractPage {params.id}</h1>
		{ contract?.attachmentUrl &&  <a href={contract.attachmentUrl}>View Contract</a> }
		</div>
	);
}