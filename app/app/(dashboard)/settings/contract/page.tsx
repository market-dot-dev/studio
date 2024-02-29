"use server";

import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import UserService from "@/app/services/UserService";
import { Title, Text, Card, Bold, Badge, Button } from "@tremor/react";
import Link from "next/link";

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
      <div className="flex flex-col space-y-6">
      <Card className="border-2 border-slate-800">
        <Bold>Gitwallet Standard MSA</Bold><Badge className="ms-2" color="green">Selected</Badge>
        <Text className="mb-2">A master service agreement optimized service agreements between open source maintainers and their customers.</Text>
        <Link href="https://www.gitwallet.co/legal/standard-msa"><Button variant="primary">Review Standard MSA</Button></Link>
      </Card>
      <Card>
        <Bold>Customized Gitwallet Standard MSA</Bold><Badge className="ms-2">Coming Soon</Badge>
        <Text>A regional specific version of the Gitwallet Master Service Agreement, customizable for jurisdiction and other terms.</Text>
      </Card>
      <Card>
        <Bold>Upload Your Own</Bold><Badge className="ms-2">Coming Soon</Badge>
        <Text>Upload your own services agreement that will govern the services between your project and its customers.</Text>
      </Card>
      </div>
    </div>
  );
}
