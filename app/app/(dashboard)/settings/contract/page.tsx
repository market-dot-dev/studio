"use server";

import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import UserService from "@/app/services/UserService";
import { Title, Text } from "@tremor/react";

export default async function ContractSettings() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const user = await UserService.findUser(session.user.id!);

  if (!user) {
    redirect("/login");
  }

  return (    
    <div className="space-y-6">
      <Title>Services Agreement</Title>
      <Text>Gitwallet has created a Master Service Agreement optimized for the world of Open Source.</Text>
    </div>
  );
}
