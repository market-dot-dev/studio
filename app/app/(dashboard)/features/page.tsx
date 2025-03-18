"use server";

import prisma from '@/lib/prisma';
import { Service, Feature } from '@prisma/client';
import React from 'react';
import Offerings from './support-offerings';
import PageHeader from '@/components/common/page-header';
import FeatureService from '@/app/services/feature-service';
import Link from 'next/link';

const OfferingsWrapper = async () => {
  const services: Service[] = await prisma.service.findMany();
  const features: Feature[] = await FeatureService.findByCurrentUser();

  return (<>
      <PageHeader 
        title="Your Services" 
        description="Enable & define your premium services, and add them into a Package."
      />
      <div className="mb-6">
        <Link href="/tiers" className="text-sm text-stone-500 underline">
          Browse available packages
        </Link>
      </div>
      <Offerings services={services} features={features} />
  </>);
};

export default OfferingsWrapper;
