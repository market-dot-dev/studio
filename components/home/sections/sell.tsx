"use client"

import React, { useRef, useEffect } from "react";
import Section from "@/components/home/section";
import FeatureCard from "@/components/home/feature-card";
import { colors } from "@/lib/home/colors";
import {
  HandHelping,
  Briefcase,
  ShoppingBag,
  FileBox,
  BookLock,
  GraduationCap,
  Key,
} from "lucide-react";

const featureCards = [
  {
    icon: <HandHelping />,
    title: "Support packages",
    description:
      "Offer multiple support package ties with access to market rates.",
    image: {
      src: "/tiers.png",
      alt: "Package cards illustration",
    },
  },
  {
    icon: <BookLock />,
    title: "Code repos",
    description:
      "Host and sell access to your private code repositories securely.",
    image: {
      src: "/code-repo.png",
      alt: "Private code repo illustration",
    },
  },
  {
    icon: <Briefcase />,
    title: "Specialized consulting",
    description: "Share your expertise through tailored consulting packages.",
    image: {
      src: "/consulting.png",
      alt: "Package cards illustration",
    },
  },
  {
    icon: <FileBox />,
    title: "File downloads",
    description:
      "Upload & manage PDFs, ebooks, and other digital files for sale.",
    image: {
      src: "/file.png",
      alt: "Digital files illustration",
    },
  },
  {
    icon: <GraduationCap />,
    title: "Training & courses",
    description:
      "Teach others what you know with training packages & online courses.",
    image: {
      src: "/course.png",
      alt: "Course illustration",
    },
  }
];

export default function Sell() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const setScrollDuration = () => {
      const scrollWidth = container.scrollWidth;
      const pxPerSecond = 50;
      const duration = scrollWidth / pxPerSecond;
      
      container.style.setProperty('--scroll-duration', `${duration}s`);
    };

    setScrollDuration();
    window.addEventListener('resize', setScrollDuration);

    return () => window.removeEventListener('resize', setScrollDuration);
  }, []);

  return (
    <Section
      id="sell"
      color={colors.green["100"]}
      badge={{
        icon: <ShoppingBag />,
        title: "Sell",
      }}
      headline="Sell Anything"
      description="Manage your offerings in one place. Use ready-made contracts & proven pricing structures to sell whatever you want, right away."
      className="w-screen !max-w-none md:!px-0"
      isFullBleed
    >
      <div className="group relative w-full overflow-hidden">
        <div className="flex flex-col gap-6 md:hidden">
          {featureCards.map((card, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <FeatureCard
                icon={card.icon}
                title={card.title}
                description={card.description}
                image={card.image}
                color={colors.green}
                orientation="vertical"
                imageMaxWidth="w-[89%] max-w-[400px] sm:w-auto sm:max-w-[clamp(350px,85%,480px)]"
                className="mx-auto aspect-[3/4] max-h-[420px] w-full"
              />
            </div>
          ))}
        </div>
        <div
          ref={scrollContainerRef}
          className="scroll-container group-hover:pause-animation group-active:pause-animation hidden animate-scroll md:flex"
        >
          {[
            ...featureCards.slice(-1),
            ...featureCards.slice(0, -1),
            ...featureCards.slice(-1),
            ...featureCards.slice(0, -1),
          ].map((card, index) => (
            <div key={index} className="max-w-[360px] flex-shrink-0 px-3">
              <FeatureCard
                icon={card.icon}
                title={card.title}
                description={card.description}
                image={card.image}
                color={colors.green}
                orientation="vertical"
                className="mx-auto max-h-[420px] w-full"
              />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
