"use server";

import Form from "@/components/form";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { editUser } from "@/lib/actions";
import { Card, Flex, Text, TextInput, Button, Grid, Bold, Badge } from "@tremor/react";
import UserService from "@/app/services/UserService";


export default async function GeneralSettings() {
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
    <Text>General Settings</Text>
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
    </div>      
  );
}
