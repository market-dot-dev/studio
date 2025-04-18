import ContractService from "@/app/services/contract-service";
import NoNavLayout from "../../../layout";

import type { NextPage } from "next";
import type { ReactElement, ReactNode } from "react";

type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement<any>) => ReactNode;
};

type ContractPageProps = {
  params: Promise<{ id: string }>;
};

const ContractPage: NextPageWithLayout<ContractPageProps> = async (props: ContractPageProps) => {
  const params = await props.params;
  const contract = await ContractService.getContractById(params.id);

  if (!contract) {
    return <div>Contract not found</div>;
  }

  const { name, description, url, attachmentUrl, attachmentType, storage } = contract;

  return (
    <div className="flex h-screen flex-col bg-green-500 md:flex-row">
      {/* Left Column */}
      <div
        className="flex flex-col justify-center gap-2 bg-slate-800 p-8 text-slate-50 md:h-screen md:w-2/5 lg:py-32 xl:px-32"
        style={{ backgroundImage: "url(/voronoi.png)" }}
      >
        <h2 className="text-xl font-bold text-stone-300">{name}</h2>
        <p className="text-sm text-stone-500">{description}</p>
      </div>

      {/* Right Column */}
      <div className="grow bg-slate-100 text-slate-800 md:w-3/5">
        {(storage === "link" && url) || attachmentUrl ? (
          <embed
            src={(storage === "link" ? url : attachmentUrl) + "#toolbar=0"}
            type={attachmentType ?? undefined}
            className="h-screen w-full"
          />
        ) : (
          <div>No contract document available</div>
        )}
      </div>
    </div>
  );
};

ContractPage.getLayout = function getLayout(page: ReactElement<any>) {
  return <NoNavLayout>{page}</NoNavLayout>;
};
export default ContractPage;
