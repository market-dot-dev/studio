"use server";

import Form from "@/components/form";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { editUser } from "@/lib/actions";
import { Card, Flex, Text, TextInput, Button, Grid, Bold, Badge } from "@tremor/react";
import UserService from "@/app/services/UserService";


export default async function ProjectSettings() {
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
                <Text>Project Settings</Text>
                <Form
                  title="Project Name"
                  description="The project you're offering support for."
                  helpText="Please enter your project name."
                  inputAttrs={{
                    name: "projectName",
                    type: "text",
                    defaultValue: user.projectName || "",
                    placeholder: "Nokogiri",
                  }}
                  handleSubmit={editUser}
                />
                <Form
                  title="Project Description"
                  description="Describe your project."
                  helpText="Enter a description for your project."
                  inputAttrs={{
                    name: "projectDescription",
                    type: "text",
                    defaultValue: user.projectDescription || "",
                    placeholder: "It slices! It dices! It makes julienne fries!",
                  }}
                  handleSubmit={editUser}
                />

              </div>
  );
}
