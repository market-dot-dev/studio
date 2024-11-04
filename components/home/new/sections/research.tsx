import React from 'react'
import Image from 'next/image';
import Section from '@/components/home/new/section';
import FeatureCard from '@/components/home/new/feature-card';
import { ScanSearch, Target } from 'lucide-react';
import { colors } from '@/lib/home/colors';

export default function Research() {
  return (
    <Section
      id="research"
      badge={{
        icon: <ScanSearch />,
        title: "Research",
      }}
      color={colors.orange["100"]}
      headline={<>Find Projects<br/>& Customers</>}
      description="Discover who's engaging with your work and uncover projects that align with your goals."
      isFullBleed
    >
      <div className="relative grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
        <FeatureCard
          icon={<Target />}
          title="In-depth repo reports"
          description="Crawl the dependency graph of any repo and find out who's actually using your stuff (or make a logo-soup)."
          image={{
            src: "/radar.png",
            alt: "Package cards illustration",
          }}
          color={colors.orange}
          orientation="vertical"
          imageMaxWidth={null}
          className="sm:aspect-[4/3] lg:aspect-[5/4]"
        />
        <FeatureCard
          icon={
            <Image
              src="/echo-logo.svg"
              alt="echo logo"
              height={28}
              width={164}
              className="h-[20px]! w-auto"
            />
          }
          title="Explore ecosystems with Echo"
          description="Keep a pulse on open source — find the big players, interesting projects and top talent in any ecosystem."
          image={{
            src: "/echo.png",
            alt: "Package cards illustration",
          }}
          color={colors.orange}
          orientation="vertical"
          imageMaxWidth={null}
          link={{
            text: "Try it out",
            href: "https://ecosystems.gitwallet.co/",
          }}
          className="sm:aspect-[4/3] lg:aspect-[5/4]"
        />
      </div>
    </Section>
  );
}
