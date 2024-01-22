import Form from "@/components/form";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card } from "@tremor/react";
import { MessagesSquare, Radio, ListTodo, Timer, AtSign, Video, Laptop, Github  } from 'lucide-react';
import { FaDiscord, FaSlack, FaTelegram } from 'react-icons/fa';
import { Flex, Text, Button, TextInput, Title, Bold, Badge, Textarea, Switch, Divider, Grid, Icon } from "@tremor/react"
import { Checkbox } from "@radix-ui/themes";


const directContactDetails = [
  {
    icon: <FaDiscord size={16} />,
    title: "Hosted Discord",
    description: "Hosted Discord server for your customers",
  },
  {
    icon: <FaSlack size={16} />,
    title: "Slack Connect",
    description: "Join company Slack channels to support customers",
  },
  {
    icon: <AtSign size={16} />,
    title: "Support Email",
    description: "Your customers can reach you via email",
  },
  {
    icon: <FaTelegram size={16} />,
    title: "Telegram",
    description: "Your customers can reach you via Telegram",
  },
];


const liveSupportDetails = [
  {
    icon: <Video size={16} />,
    title: "Video Chat",
    description: "Hosted Discord server for your customers",
  },
  {
    icon: <FaSlack size={16} />,
    title: "Pair Programming",
    description: "Join company Slack channels to support customers",
  },
  {
    icon: <AtSign size={16} />,
    title: "Office Hours",
    description: "Your customers can reach you via email",
  },
  {
    icon: <FaTelegram size={16} />,
    title: "Company Training / Lunch and Learn",
    description: "Your customers can reach you via Telegram",
  },
];

const featuresData = [
  {
    icon: <MessagesSquare size={32} />,
    title: "Direct Contact",
    description: "Offer direct support to customers",
    badge: "Required",
    selected: true,
    subcategories: directContactDetails,
  },
  {
    icon: <Radio size={32} />,
    title: "Live Support",
    description: "Offer live support to your customers",
    badge: "Optional",
    selected: false,
    subcategories: liveSupportDetails
  },
  {
    icon: <ListTodo size={32} />,
    title: "Issue Tracking",
    description: "Offer prioritized issue resolution",
    badge: "Optional",
    selected: false,
  },
  {
    icon: <Timer size={32} />,
    title: "Response Time",
    description: "Offer response time guarantees to customers",
    badge: "Optional",
    selected: false,
  },
];



export default async function ProjectPage() {

  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <h1 className="font-cal text-3xl font-bold dark:text-white">
          Project Details
        </h1>

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


        <Card className="max-w w-full mx-auto">
          <Bold>Service Offerings</Bold>
          <Text className="mb-4">Choose the support offerings you'd like to provide to your customers.</Text>



          <Grid numItems={2} className="gap-2 mb-4">
              {featuresData.map((feature, index) => (
            <div className="flex flex-col">
              <Card className="p-2 mb-2" key={index}>
                  <div className="flex flex-row justify-items-center text-center">
                    {feature.icon}
                    <Bold>{feature.title}</Bold>
                  </div>
                  <div className="mb-2">Fulfillment Via:</div>
                  {feature.subcategories && (
                    <div className="flex flex-col">
                      {feature.subcategories.map((subcategory, subIndex) => (
                        <Card  className="p-2 mb-2" key={subIndex}>
                          <div className="flex flex-row justify-items-start align-items-center text-start">
                            {subcategory.icon}
                            <Bold>{subcategory.title}</Bold>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </Card>
                </div>
              ))}
          </Grid>

        </Card>

        <Card className="max-w w-full mx-auto">
          <Bold>Feature Offerings</Bold>
          <Text className="mb-4">Choose the Product Features you'd like to provide to your customers.</Text>
        </Card>

      </div>
    </div>
  );
}
