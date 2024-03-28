"use server";

import prisma from '@/lib/prisma';
import { Service, Feature } from '@prisma/client';
import React from 'react';
import Offerings from './support-offerings';
import { Text } from '@tremor/react';
import PageHeading from '@/components/common/page-heading';
import FeatureService from '@/app/services/feature-service';

const OfferingsWrapper = async () => {
  const services: Service[] = await prisma.service.findMany();
  const features: Feature[] = await FeatureService.findByCurrentUser();

  return (<>
      <div className="flex flex-col">
        <PageHeading title="Your Services" />
        <Text>Define the support services and workflows you are providing to your customers.</Text>
      </div>
      <Offerings services={services} features={features} />
  </>);
};

export default OfferingsWrapper;
