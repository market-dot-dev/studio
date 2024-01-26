import prisma from '@/lib/prisma';
import { Service, Feature } from '@prisma/client';
import React from 'react';
import FeatureForm from '@/components/form/feature-form';
import { Button, Card } from '@tremor/react';
import Link from 'next/link';

const FeatureCard: React.FC<{ feature: Feature }> = ({ feature }) => {
  return (<>
    <Card>
      <Link href={`services/${feature.id}`}>{ feature.name }</Link>
      <div>Description: { feature.description }</div>
      { feature.uri && <div>Link: { feature.uri }</div> }
    </Card>
    <br/>
  </>);
}

const ServicesIndex: React.FC = async () => {
  const services: Service[] = await prisma.service.findMany();
  const features: Feature[] = await prisma.feature.findMany();

  return (
    <Card>
      <h1>Services</h1>
      <FeatureForm service={services} />
      <h1>Features</h1>
      { features.map((feature) => <FeatureCard feature={feature} key={feature.id} />) }
    </Card>
  );
};


export default ServicesIndex;