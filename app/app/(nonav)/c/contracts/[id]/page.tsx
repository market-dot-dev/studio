"use server";

import { getContractById } from "@/app/services/contract-service";
import { notFound } from "next/navigation";

export default async function ContractPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const contract = await getContractById(params.id);

  if (!contract) {
    notFound();
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
}
