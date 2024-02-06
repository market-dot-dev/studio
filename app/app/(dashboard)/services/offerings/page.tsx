"use client";
import Form from "@/components/form";
// import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, Switch, TextInput, Textarea } from "@tremor/react";
import { MessagesSquare, Radio, ListTodo, Timer, AtSign, Video, Github, Settings2 } from 'lucide-react';
import { FaDiscord, FaSlack, FaTelegram } from 'react-icons/fa';
import { Flex, Text, Bold, Badge, Grid, Col } from "@tremor/react"
import { Checkbox } from "@radix-ui/themes";


const directContactDetails = [
    {
        icon: <FaDiscord size={24} />,
        title: "Hosted Discord",
        description: "Hosted Discord server for your customers. This is great for certain projects where you get a lot of common customer questions. Discord also helps you setup a channel per customer.",
        checked: true,
    },
    {
        icon: <FaSlack size={24} />,
        title: "Slack Connect",
        description: "Join company Slack channels to support customer. This is great for certain projects where you get a lot of common customer questions. Slack also helps you setup a channel per customer.",
        checked: false,
    },
    {
        icon: <AtSign size={24} />,
        title: "Support Email",
        description: "Your customers can reach you via email. This is great for certain projects where you get a lot of common customer questions. Email also helps you setup a channel per customer.",
        checked: false,
    },
    {
        icon: <FaTelegram size={24} />,
        title: "Telegram",
        description: "Your customers can reach you via Telegram. This is great for certain projects where you get a lot of common customer questions. Telegram also helps you setup a channel per customer.",
        checked: false,
    },
    {
        icon: <FaDiscord size={24} />,
        title: "Hosted Discord",
        description: "Hosted Discord server for your customers. This is great for certain projects where you get a lot of common customer questions. Discord also helps you setup a channel per customer.",
        checked: false,
    },
    {
        icon: <FaSlack size={24} />,
        title: "Slack Connect",
        description: "Join company Slack channels to support customers. This is great for certain projects where you get a lot of common customer questions. Slack also helps you setup a channel per customer.",
        checked: false,
    },
    {
        icon: <AtSign size={24} />,
        title: "Support Email",
        description: "Your customers can reach you via email. This is great for certain projects where you get a lot of common customer questions. Email also helps you setup a channel per customer.",
        checked: false,
    },
    {
        icon: <FaTelegram size={24} />,
        title: "Telegram",
        description: "Your customers can reach you via Telegram. This is great for certain projects where you get a lot of common customer questions. Telegram also helps you setup a channel per customer.",
        checked: false,
    },
    {
        icon: <FaSlack size={24} />,
        title: "Slack Connect",
        description: "Join company Slack channels to support customers. This is great for certain projects where you get a lot of common customer questions. Slack also helps you setup a channel per customer.",
        checked: false,
    },
    {
        icon: <AtSign size={24} />,
        title: "Support Email",
        description: "Your customers can reach you via email. This is great for certain projects where you get a lot of common customer questions. Email also helps you setup a channel per customer.",
        checked: false,
    },
];


const liveSupportDetails = [
    {
        icon: <Video size={24} />,
        title: "Video Chat",
        description: "Hosted Discord server for your customers",
    },
    {
        icon: <FaSlack size={24} />,
        title: "Pair Programming",
        description: "Join company Slack channels to support customers",
    },
    {
        icon: <AtSign size={24} />,
        title: "Office Hours",
        description: "Your customers can reach you via email",
    },
    {
        icon: <FaTelegram size={24} />,
        title: "Company Training / Lunch and Learn",
        description: "Your customers can reach you via Telegram",
    },
];

const featuresData = [
    {
        icon: <MessagesSquare size={24} />,
        title: "Direct Contact",
        description: "Offer direct support to customers",
        badge: "Required",
        selected: true,
        subcategories: directContactDetails,
    },
    {
        icon: <Radio size={24} />,
        title: "Live Support",
        description: "Offer live support to your customers",
        badge: "Optional",
        selected: true,
        subcategories: liveSupportDetails
    },
    {
        icon: <ListTodo size={24} />,
        title: "Issue Tracking",
        description: "Offer prioritized issue resolution",
        badge: "Optional",
        selected: false,
    },
    {
        icon: <Timer size={24} />,
        title: "Response Time",
        description: "Offer response time guarantees to customers",
        badge: "Optional",
        selected: false,
    },
    {
        icon: <Settings2 size={24} />,
        title: "Custom",
        description: "Create a custom support offering",
        badge: "Optional",
        selected: false,
    },
];




export default async function ProjectPage() {

    return (
        <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
            <div className="flex flex-col space-y-6">
                <h1 className="font-cal text-3xl font-bold dark:text-white">
                    Product & Service Offerings
                </h1>
                <Text className="text-md">Create and manage your support offerings.</Text>
                <Grid numItems={5} className="gap-2 mb-4">


                    {/* 
                    NOTHING SELECTED
                    <Col numColSpan={2}>
                        <div className="text-lg font-bold mb-2">Details</div>

                        <div className="flex flex-col bg-gray-50 h-full pt-24 text-center h-full rounded-xl">
                            Please select a fulfillment option to view details.
                        </div>
                    </Col>
                    */}

                    
                    {/* COLUMN 1: SERVICE OFFERING CATEGORIES */}
                    <Col numColSpan={1}>
                        <div className="text-lg font-bold mb-2">Categories</div>

                        <div className="flex flex-col pt-1">
                            {featuresData.map((feature, index) => (
                                <Card className={feature.selected ? "border-2 border-slate-800 p-2 mb-2" : "p-2 mb-2"} key={index}>
                                    <div className="flex flex-row justify-items-center text-center gap-2">
                                        {feature.icon}
                                        <Bold>{feature.title}</Bold>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </Col>


                    {/* COLUMN 2: SERVICE OFFERING FULFILLMENT TYPES */}
                    <Col numColSpan={2}>
                        <div className="text-lg font-bold mb-2">Options</div>
                        <div className="flex flex-col h-4/5">
                            {directContactDetails && (
                                <div className="flex flex-col overflow-auto px-1 pt-1">
                                    {directContactDetails.map((subcategory, subIndex) => (
                                        <Card className={subcategory.checked ? "border-2 border-slate-800 p-2 mb-2" : "p-2 mb-2"} key={subIndex}>
                                            <div className="flex flex-row items-center justify-between gap-2">
                                                {subcategory.icon}
                                                <Bold>{subcategory.title}</Bold>
                                                <div className="ml-auto">
                                                    <Switch defaultChecked={subcategory.checked} />
                                                </div>
                                            </div>
                                            <div className="text-sm">{subcategory.description}</div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Col>

                    {/* COLUMN 3: SERVICE OFFERING FULFILLMENT DETAILS */}
                    <Col numColSpan={2}>
                        <div className="text-lg font-bold mb-2">Details</div>

                        <div className="flex flex-col px-1">
                            <label className="text-sm font-light">URL</label>
                            <TextInput className="mb-4" placeholder="Enter your Discord server URL" />
                            <label className="text-sm font-light">Details</label>
                            <Textarea placeholder="Enter details about your Discord." />
                        </div>
                    </Col>
                </Grid>
            </div>
        </div>
    );
}
