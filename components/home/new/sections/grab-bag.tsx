import React from 'react'
import Section from '@/components/home/new/section';
import FeatureCard from '@/components/home/new/feature-card';
import { UsersRound, ChartLine, Signature, ShoppingCart, Shapes } from 'lucide-react';
import { colors } from '@/lib/home/colors';

export default function GrabBag() {
  return (
    <Section
      badge={{
        icon: <Shapes />,
        title: "Everything else",
      }}
      color={colors.swamp["100"]}
      headline="+ much more"
      description="Full suite of tools to replace the usual suspects and help you build your business."
      isFullBleed
      className="lg:max-w-[1150px]"
    >
      <div className="mx-auto grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
        <FeatureCard
          icon={<UsersRound />}
          title="CRM for OSS"
          description="Fully-featured CRM, re-designed for open source services."
          color={colors.swamp}
          orientation="vertical"
          imageMaxWidth={null}
          className="ring-0 md:order-1 md:ring-1"
        />
        <FeatureCard
          icon={<ChartLine />}
          title="Sales reports & insights"
          description="Track sales and see how your services are performing."
          color={colors.swamp}
          orientation="vertical"
          imageMaxWidth={null}
          className="ring-0 md:order-3 md:ring-1"
        />
        <FeatureCard
          icon={<Signature />}
          title="Write & design proposals"
          description="Create, share and sign service agreements in minutes."
          color={colors.swamp}
          orientation="vertical"
          imageMaxWidth={null}
          isComingSoon
          className="ring-0 md:order-2 md:ring-1"
        />
        <FeatureCard
          icon={<ShoppingCart />}
          title="Custom checkout"
          description="Let people pay in a decicated checkout flow, tailored to you."
          color={colors.swamp}
          orientation="vertical"
          imageMaxWidth={null}
          isComingSoon
          className="md:order-4"
        />
      </div>
    </Section>
  );
}
