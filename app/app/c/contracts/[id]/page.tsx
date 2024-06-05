import ContractService from "@/app/services/contract-service";
import { Title, Text } from "@tremor/react";


type ContractPageProps = {
  id: string;
};

export default async function ContractPage({params} : {params: { id: string }}) {
  const contract = await ContractService.getContractById(params.id);

  if (!contract) {
    return <div>Contract not found</div>;
  }

  const { name, description, url, attachmentUrl, attachmentType } = contract;

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Column */}
      <div className="md:fixed top-0 left-0 w-full md:w-2/5 h-full bg-slate-800 text-slate-50 flex flex-col justify-center p-8 lg:py-32 xl:px-32" style={{ backgroundImage: "url(/voronoi.png)" }}>
        <Title>{name}</Title>
        <Text>{description}</Text>
      </div>

      {/* Right Column */}
      <div className="w-full md:w-3/5 ml-auto bg-slate-100 text-slate-800 overflow-y-auto p-8 md:p-16">
        {url ? (
          <iframe src={url} width="100%" height="100%" />
        ) : attachmentUrl && attachmentType ? (
          <embed src={attachmentUrl} type={attachmentType} width="100%" height="100%" />
        ) : (
          <div>No contract document available</div>
        )}
      </div>
    </div>
  );
};