"use server";

import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import UserService from "@/app/services/UserService";
import { Bold, Button, Card, Select, Text } from "@tremor/react";

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
      <Bold>Choose A Contract:</Bold>

      <Text>
        Disclaimer: This is not legal advice. Please consult with a legal professional before using any of these contracts.
      </Text>
      <br />
      <Bold>Gitwallet Standard MSA</Bold>
      <Text>The Gitwallet Standard MSA is used for all agreements between maintainers and their customers. </Text>
      <Button>Choose This Contract</Button>      <Button>View Contract</Button>

      <br />      <br />
      <Bold>Gitwallet Customized MSA</Bold>
      <Text>The Gitwallet custom MSA is used for all agreements between maintainers and their customers. </Text>
      <Select>
        <option>Choose Cuntry</option>
        <option>USA</option>
        <option>Canada</option>
        <option>UK</option>
        <option>India</option>
      </Select><Button>Choose This Contract</Button>      <Button>View Contract</Button>

    </div>
  );
}
