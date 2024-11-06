import React from 'react'
import Section from '@/components/home/section';
import FeatureCard from '@/components/home/feature-card';
import { colors } from '@/lib/home/colors';
import { Package, ScrollText, ShoppingBag, FileBox } from 'lucide-react';

export default function Sell() {
  return (
    <Section
      id="sell"
      color={colors.green["100"]}
      badge={{
        icon: <ShoppingBag />,
        title: "Sell",
      }}
      headline={
        <>
          Sell Products
          <br />& Se<span className="tracking-[-0.005em]">r</span>vices
        </>
      }
      description="The source of truth for all your offerings. Start with a proven pricing
          structure & contracts to sell nearly whatever you want."
      isFullBleed
    >
      <div className="relative grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
        <FeatureCard
          icon={<Package />}
          title="Offer packages"
          description="Make support, training, or consulting packages. Use market rates to compare & adjust your pricing."
          image={{
            src: "/tiers.png",
            alt: "Package cards illustration",
          }}
          color={colors.green}
          orientation="vertical"
          className="lg:aspect-[3/4]"
        />
        <FeatureCard
          icon={<ScrollText />}
          title="Use templated contracts"
          description={
            <>
              Sta<span className="tracking-normal">r</span>t working with
              clients faster by accessing our libra
              <span className="tracking-normal">r</span>y of ready-made, open
              source contracts.
            </>
          }
          image={{
            src: "/contract-template.png",
            alt: "Package cards illustration",
          }}
          color={colors.green}
          orientation="vertical"
          className="lg:aspect-[3/4]"
        />
        <FeatureCard
          icon={<FileBox />}
          title="Host digital products"
          description="Upload & host courses, ebooks, and other resources — we handle the payment and delivery."
          image={{
            src: "/course.png",
            alt: "Package cards illustration",
          }}
          color={colors.green}
          orientation="vertical"
          isComingSoon
          className="lg:aspect-[3/4]"
        />
      </div>
    </Section>
  );
}
