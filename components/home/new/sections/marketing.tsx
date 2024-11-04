import React from 'react'
import Section from '@/components/home/new/section';
import FeatureCard from '@/components/home/new/feature-card';
import { Speech, AppWindowMac, CodeSquare } from 'lucide-react';
import { colors } from '@/lib/home/colors';

export default function Marketing() {
  return (
    <Section
      id="marketing"
      badge={{
        icon: <Speech />,
        title: "Marketing",
      }}
      color={colors.purple["100"]}
      headline={
        <>
          Market Eve<span className="tracking-normal">ry</span>where
        </>
      }
      description={
        <>
          Expand your audience and boost visibility with a fully adaptable,
          developer-focused approach to marketing your open-source work.
        </>
      }
      isFullBleed
    >
      <div className="relative grid w-full grid-cols-1 flex-col gap-6 lg:grid-cols-2">
        <FeatureCard
          icon={<AppWindowMac />}
          title="Fully-customizable landing pages"
          description={
            <>
              Sta<span className="tracking-normal">r</span>t with a beautiful
              template, designed for OS developers. Not good enough? Pop the
              hood with a full-screen code editor.
            </>
          }
          image={{
            src: "/landing-page.png",
            alt: "Package cards illustration",
          }}
          color={colors.purple}
          orientation="vertical"
          imageMaxWidth={null}
          className="sm:aspect-[4/3] lg:aspect-[5/4]"
        />
        <FeatureCard
          icon={<CodeSquare />}
          title="Purpose-built embeds"
          description="Use single-purpose, customizable embeds to promote servies on your repo, read.me or anywhere really."
          image={{
            src: "/embeds-screenshot.png",
            alt: "Package cards illustration",
          }}
          color={colors.purple}
          orientation="vertical"
          imageMaxWidth={null}
          className="sm:aspect-[4/3] lg:aspect-[5/4]"
        />
      </div>
    </Section>
  );
}
