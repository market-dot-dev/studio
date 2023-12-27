import { ReactNode } from "react";
import Form from "@/components/form";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { editUser } from "@/lib/actions";
import { Accordion, AccordionBody, AccordionHeader, AccordionList } from "@tremor/react";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <h1 className="font-cal text-3xl font-bold dark:text-white">
          Settings
        </h1>

        <AccordionList className="max-w-md w-full mx-auto">
          <Accordion>
            <AccordionHeader>General Settings</AccordionHeader>
            <AccordionBody>
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
              />      </AccordionBody>
          </Accordion>
          <Accordion>
            <AccordionHeader>Payment Information</AccordionHeader>
            <AccordionBody>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus tempor lorem non est
              congue blandit. Praesent non lorem sodales, suscipit est sed, hendrerit dolor.
            </AccordionBody>
          </Accordion>
          <Accordion>
            <AccordionHeader>Contract Information</AccordionHeader>
            <AccordionBody>
              Options:
              - Use Default Contract (Recommended)
              - Upload Custom Contract
            </AccordionBody>
          </Accordion>
        </AccordionList>

      </div>
    </div>
  );
}
