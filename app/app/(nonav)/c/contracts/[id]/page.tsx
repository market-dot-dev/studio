import ContractService from "@/app/services/contract-service";
import { Title, Text } from "@tremor/react";
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

  const { name, description, url, attachmentUrl, attachmentType } = contract;

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left Column */}
      <div
        className="left-0 top-0 flex h-full w-full flex-col justify-center bg-slate-800 p-8 text-slate-50 md:fixed md:w-2/5 lg:py-32 xl:px-32"
        style={{ backgroundImage: "url(/voronoi.png)" }}
      >
        <Title>{name}</Title>
        <Text>{description}</Text>
      </div>

      {/* Right Column */}
      <div className="ml-auto w-full overflow-y-auto bg-slate-100 p-8 text-slate-800 md:w-3/5 md:p-16">
        {url ? (
          <iframe src={url} width="100%" height="100%" />
        ) : attachmentUrl && attachmentType ? (
          <embed
            src={attachmentUrl}
            type={attachmentType}
            width="100%"
            height="100%"
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