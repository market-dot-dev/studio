"use server";

import prisma from '@/lib/prisma';
import { Service, Feature } from '@prisma/client';
import React from 'react';
import Offerings from './support-offerings';

type Category = {
  id: string;
  name: string;
  icon?: string;
};

const categories: Category[] = [
  { id: 'email', name: 'Email', icon: 'email' },
  { id: 'chat', name: 'Chat', icon: 'chat' },
  { id: 'voice', name: 'Voice', icon: 'phone' },
  { id: 'ticketing', name: 'Ticketing', icon: 'ticket' },
  { id: 'sla', name: 'SLA', icon: 'clock' },
];

const OfferingsWrapper = async () => {
  const services: Service[] = await prisma.service.findMany();
  const features: Feature[] = await prisma.feature.findMany();

  return (<>
    <div className="p-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900">Product &amp; Service Offerings</h3>
      <div>Create and manage your support offerings</div>
    </div>
    <Offerings services={services} features={features} />
  </>);
};

export default OfferingsWrapper;
