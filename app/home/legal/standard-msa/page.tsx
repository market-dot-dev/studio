"use client";

const DefaultMasterServicesAgreement = () => {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left Column */}
      <div
        className="left-0 top-0 flex size-full flex-col justify-center bg-slate-800 p-8 text-slate-50 md:fixed md:w-2/5 lg:py-32 xl:px-32"
        style={{ backgroundImage: "url(/voronoi.png)" }}
      >
        <h2 className="text-xl font-bold">Standard Services Agreement</h2>
        <p className="text-sm text-stone-500">
          Market.dev has created a Master Service Agreement optimized for the world of Open Source.
          This is an agreement between a maintainer and their customers and covers the services
          being offered to customers.
        </p>
      </div>
      <div className="ml-auto w-full overflow-y-auto bg-slate-100 p-8 text-slate-800 md:w-3/5 md:p-16">
        <embed
          src="../GitwalletMSA-Feb2024.pdf"
          type="application/pdf"
          width="100%"
          height="100%"
        />
      </div>
    </div>
  );
};

export default DefaultMasterServicesAgreement;
