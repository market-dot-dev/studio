"use server";

import prisma from '@/lib/prisma';
import { Service, Feature } from '@prisma/client';
import React from 'react';
import Offerings from './support-offerings';
import { Text } from '@tremor/react';
import PageHeading from '@/components/common/page-heading';

const OfferingsWrapper = async () => {
  const services: Service[] = await prisma.service.findMany();
  const features: Feature[] = await prisma.feature.findMany();

  return (<>
      <div className="flex flex-col">
        <PageHeading title="Your Services" />
        <Text>Create and manage your support offerings</Text>
      </div>
      <Offerings services={services} features={features} />
  </>);
};

export default OfferingsWrapper;
