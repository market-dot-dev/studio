"use client";

import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import UserService from "@/app/services/UserService";
import { Title, Text } from "@tremor/react";

export default async function DefaultMasterServicesAgreement() {
  return (    
    <div className="space-y-6">
      <Title>Gitwallet Services Agreements</Title>
    </div>
  );
}
