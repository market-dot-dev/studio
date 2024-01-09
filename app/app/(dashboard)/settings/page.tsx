"use server";

import Form from "@/components/form";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { editUser } from "@/lib/actions";
import { Card, Flex, Text, TextInput, Button } from "@tremor/react";
import UserService from "@/app/services/UserService";
import UserProductWidget from "./UserProductWidget";
import UserCustomerWidget from "./UserCustomerWidget";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const user = await UserService.findUser(session.user.id!);

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <h1 className="font-cal text-3xl font-bold dark:text-white">
          Settings
        </h1>
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
        <Form
          title="Name"
          description="Your name on this app."
          helpText="Please use 32 characters maximum."
          inputAttrs={{
            name: "name",
            type: "text",
            defaultValue: session.user.name!,
            placeholder: "Brendon Urie",
            maxLength: 32,
          }}
          handleSubmit={editUser}
        />
        <Form
          title="Email"
          description="Your email on this app."
          helpText="Please enter a valid email."
          inputAttrs={{
            name: "email",
            type: "email",
            defaultValue: session.user.email!,
            placeholder: "panic@thedis.co",
          }}
          handleSubmit={editUser}
        />
        <UserProductWidget user={user} />
        <UserCustomerWidget user={user} />
      </div>
    </div>
  );
}
