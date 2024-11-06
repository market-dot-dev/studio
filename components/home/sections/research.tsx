import React from 'react'
import Image from 'next/image'
import Link from '@/components/home/link';
import Section from '@/components/home/section';
import FeatureCard from '@/components/home/feature-card';
import { ScanSearch, Target, BookOpenCheck } from 'lucide-react';
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
      headline="Find Customers"
      description="See who's engaging with your work and uncover projects that align with your goals."
      isFullBleed
    >
      <div className="relative grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
        <FeatureCard
          icon={<BookOpenCheck />}
          title="Get listed on a premium marketplace"
          description={
            <>
              <Link href="https://ecosystems.gitwallet.co/">
                <Image
                  src="/echo-logo.svg"
                  alt="echo logo"
                  height={34}
                  width={118}
                  aria-labelledby="Echo"
                  className="mr-[5px] inline h-[17px] w-auto shrink-0"
                />
              </Link>
              is a new discovery marketplace for open source communities,
              projects & resources.
            </>
          }
          image={{
            src: "/echo.png",
            alt: "Package cards illustration",
          }}
          color={colors.orange}
          orientation="vertical"
          imageMaxWidth={null}
          link={{
            text: "Explore Echo",
            href: "https://ecosystems.gitwallet.co/",
          }}
          className="sm:aspect-[4/3] lg:aspect-[5/4]"
        />
        <FeatureCard
          icon={<Target />}
          title="In-depth repo reports"
          description="We'll scan your repo's dependency graphs to find and contact potential customers."
          image={{
            src: "/radar.png",
            alt: "Package cards illustration",
          }}
          color={colors.orange}
          orientation="vertical"
          imageMaxWidth={null}
          className="sm:aspect-[4/3] lg:aspect-[5/4]"
        />
      </div>
    </Section>
  );
}
