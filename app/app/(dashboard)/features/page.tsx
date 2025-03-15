"use server";

import prisma from '@/lib/prisma';
import { Service, Feature } from '@prisma/client';
import React from 'react';
import Offerings from './support-offerings';
import PageHeading from '@/components/common/page-heading';
import FeatureService from '@/app/services/feature-service';
import Link from 'next/link';

const OfferingsWrapper = async () => {
  const services: Service[] = await prisma.service.findMany();
  const features: Feature[] = await FeatureService.findByCurrentUser();

  return (<>
      <div className="flex flex-col">
        <PageHeading title="Your Services" />
        <p className="text-sm text-stone-500">Enable & define your premium services, and add them into a <Link href="/tiers" className='underline'>Package</Link>.</p>
      </div>
      <Offerings services={services} features={features} />
  </>);
};

export default OfferingsWrapper;
