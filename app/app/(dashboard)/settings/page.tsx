"use server";

import Form from "@/components/form";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { editUser } from "@/lib/actions";
import { Card, Flex, Text, TextInput, Button, Grid, Bold, Badge } from "@tremor/react";
import { Github } from "lucide-react";
import UserService from "@/app/services/UserService";
import UserProductWidget from "./UserProductWidget";
import UserCustomerWidget from "./UserCustomerWidget";
import UserPaymentMethodWidget from "@/components/common/user-payment-method-widget";
import {
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@tremor/react";


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

        <TabGroup>
          <TabList className="mt-8">
            <Tab >General</Tab>
            <Tab >Project Settings</Tab>
            <Tab >Repositories</Tab>
            <Tab >Payments</Tab>
            <Tab >Contracts</Tab>
            <Tab >Plan & Billing</Tab>
          </TabList>
          <TabPanels>
            {/* General Settings */}
            <TabPanel>
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
            </TabPanel>

            {/* Project Settings */}
            <TabPanel>
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
            </TabPanel>

            {/* Repository Settings */}
            <TabPanel>
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
            </TabPanel>

            {/* Payment Settings */}
            <TabPanel>
              <div className="w-full mt-10">
                <Card className='border-2 border-slate-800 bg-slate-50'>
                  <Badge size="xs" className="me-2 mb-1.5">FOR DEBUGGING PURPOSES ONLY</Badge>
                  <Flex flexDirection="col" alignItems="start" className="gap-4">
                    <UserProductWidget user={user} />
                    <UserCustomerWidget user={user} />
                  </Flex>
                </Card>
              </div>
            </TabPanel>

            {/* Contract Settings */}
            <TabPanel>
              <div className="w-full mt-10">
                <Flex className="mt-4">
                  <Text className="w-full">Product Z</Text>
                  <Flex className="space-x-2" justifyContent="end">
                    <Text>$ 99,484</Text>
                    <Text>16%</Text>
                  </Flex>
                </Flex>
              </div>
            </TabPanel>


          </TabPanels>
        </TabGroup>

        { /* <UserPaymentMethodWidget userId={user.id} /> */}
      </div>
    </div>
  );
}
