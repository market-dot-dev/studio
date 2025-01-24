import React from 'react'
import Section from '@/components/home/section';
import FeatureCard from '@/components/home/feature-card';
import { UsersRound, ChartLine, ListCheck, ScanSearch, ScrollText } from 'lucide-react';
import { colors } from '@/lib/home/colors';

export default function Manage() {
  return (
    <Section
      id="manage"
      badge={{
        icon: <ListCheck />,
        title: "Manage",
      }}
      color={colors.orange["100"]}
      headline="Manage Your Business"
      description="A full suite of tools to replace the usual SaaS suspects and help you build your business."
      isFullBleed
      className="lg:max-w-[1150px]"
    >
      <div className="mx-auto grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
        <FeatureCard
          icon={<UsersRound />}
          title="CRM for OSS"
          description="Fully-featured CRM, re-designed for open source services."
          color={colors.orange}
          orientation="vertical"
          imageMaxWidth={null}
          className="ring-0 md:ring-1"
        />
        <FeatureCard
          icon={<ChartLine />}
          title="Analytics"
          description="Track sales and see how your services are performing."
          color={colors.orange}
          orientation="vertical"
          imageMaxWidth={null}
          className="ring-0 md:ring-1"
        />
        <FeatureCard
          icon={<ScrollText />}
          title="Templated contracts"
          description="Create & send service agreements in minutes using our ready-made, open source contracts."
          color={colors.orange}
          orientation="vertical"
          imageMaxWidth={null}
          className="ring-0 md:ring-1"
        />
        <FeatureCard
          icon={<ScanSearch />}
          title="Market research"
          description="Find potential customers using dependency data."
          color={colors.orange}
          orientation="vertical"
          imageMaxWidth={null}
          className="ring-0 md:ring-1"
        />
      </div>
    </Section>
  );
}
