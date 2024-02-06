import { Card, Switch, TextInput, Textarea } from "@tremor/react";
import { MessagesSquare, Radio, ListTodo, Timer, AtSign, Video, Github, Settings2 } from 'lucide-react';
import { FaDiscord, FaSlack, FaTelegram } from 'react-icons/fa';
import { Flex, Text, Bold, Badge, Grid, Col } from "@tremor/react"
import prisma from '@/lib/prisma';
import { Service, Feature } from '@prisma/client';
import FeatureForm from '@/components/form/offering-form';


export default async function ProjectPage() {
    const services: Service[] = await prisma.service.findMany();
    const features: Feature[] = await prisma.feature.findMany();
  
    return (
        <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
            <div className="flex flex-col space-y-6">
                <h1 className="font-cal text-3xl font-bold dark:text-white">
                    Product & Service Offerings
                </h1>
                <Text className="text-md">Create and manage your support offerings.</Text>
                <FeatureForm service={services} />
            </div>
        </div>
    );
}
