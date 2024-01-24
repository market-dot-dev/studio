"use server";

import Form from "@/components/form";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { editUser } from "@/lib/actions";
import { Card, Flex, Text, TextInput, Button, Grid, Bold, Badge } from "@tremor/react";
import { Github } from "lucide-react";
import UserService from "@/app/services/UserService";

export default async function RepositorySettings() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const user = await UserService.findUser(session.user.id!);

  if (!user) {
    redirect("/login");
  }

  return (    
    <div className="w-full mt-10">


    <Card className="p-10">
      <Flex flexDirection="col" alignItems="start" className="gap-4">
        <h2 className="font-cal text-xl dark:text-white">Repos</h2>
        <Text>
          Repositories you have access to.
        </Text>
        <Flex className="max-w-lg gap-4">
          <TextInput placeholder="Repo name" />
          <Button>Add</Button>
        </Flex>
      </Flex>
    </Card>

    <Text>Repo Settings</Text>
    <Card className="max-w w-full mx-auto">
      <Bold>Your Github Repository</Bold>
      <Text className="mb-4">These are the Github repositories for which you are currently a maintainer.</Text>
      <Grid numItems={2} className="gap-2 mb-4">
        <Card className="p-2 mb-2">
          <div className="flex flex-row justify-items-center text-center">
            <Github size={32} />
            <Bold>ESLint</Bold>
          </div>
        </Card>
        <Card className="p-2 mb-2">
          <div className="flex flex-row justify-items-center text-center">
            <Github size={32} />
            <Bold>ES6</Bold>
          </div>
        </Card>
        <Card className="p-2 mb-2">
          <div className="flex flex-row justify-items-center text-center">
            <Github size={32} />
            <Bold>Repo 3</Bold>
          </div>
        </Card>
        <Card className="p-2 mb-2">
          <div className="flex flex-row justify-items-center text-center">
            <Github size={32} />
            <Bold>Repo 4</Bold>
          </div>
        </Card>
      </Grid>
    </Card>


  </div>
  );
}
