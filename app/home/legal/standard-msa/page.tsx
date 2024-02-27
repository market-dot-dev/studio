"use client";

import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import UserService from "@/app/services/UserService";
import { Title, Text } from "@tremor/react";

export default async function DefaultMasterServicesAgreement() {
  return (    
    <div className="flex flex-col md:flex-row min-h-screen">

      {/* Left Column */}
      <div className="md:fixed top-0 left-0 w-full md:w-2/5 h-full bg-slate-800 text-slate-50 flex flex-col justify-center p-8 lg:py-32 xl:px-32" style={{ backgroundImage: "url(/voronoi.png)" }}>
      <Title>Gitwallet Services Agreement</Title>

      <Text>Gitwallet has created a Master Service Agreement optimized for the world of Open Source. This is an agreement between a maintainer and their customers and covers the services being offered to customers.</Text>
      </div>
      <div className="w-full md:w-3/5 ml-auto bg-slate-100 text-slate-800 overflow-y-auto p-8 md:p-16">
      </div>
    </div>
  );
}
