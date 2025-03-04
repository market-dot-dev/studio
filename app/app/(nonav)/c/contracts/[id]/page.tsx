import ContractService from "@/app/services/contract-service";
import { Title } from "@tremor/react";
import NoNavLayout from "../../../layout";

import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type ContractPageProps = {
  params: { id: string };
};

const ContractPage: NextPageWithLayout<ContractPageProps> = async ({
  params,
}: ContractPageProps) => {
  const contract = await ContractService.getContractById(params.id);
  
  
  if (!contract) {
    return <div>Contract not found</div>;
  }

  const { name, description, url, attachmentUrl, attachmentType, storage } = contract;

  return (
    <div className="flex flex-col md:flex-row bg-green-500 h-screen">
      {/* Left Column */}
      <div
        className="flex flex-col gap-2 justify-center bg-slate-800 p-8 md:h-screen text-slate-50 md:w-2/5 lg:py-32 xl:px-32"
        style={{ backgroundImage: "url(/voronoi.png)" }}
      >
        <Title className="text-stone-300">{name}</Title>
        <p className="text-sm text-stone-500">{description}</p>
      </div>

      {/* Right Column */}
      <div className="grow bg-slate-100 text-slate-800 md:w-3/5">
        {(storage === 'link' && url) || attachmentUrl ? (
          <embed
            src={(storage === 'link' ? url : attachmentUrl)+'#toolbar=0'}
            type={attachmentType ?? undefined}
            className="w-full h-screen"
          />
        ) : (
          <div>No contract document available</div>
        )}
      </div>
    </div>
  );
}

ContractPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <NoNavLayout>
      {page}
    </NoNavLayout>
  )
}
export default ContractPage;