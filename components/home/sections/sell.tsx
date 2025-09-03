import FeatureCard from "@/components/home/feature-card";
import Section from "@/components/home/section";
import { colors } from "@/lib/home/colors";
import { Briefcase, GraduationCap, HandHelping, ShoppingBag } from "lucide-react";

const featureCards = [
  {
    icon: <HandHelping />,
    title: "Support packages",
    description: "Offer multiple support package ties with access to market rates.",
    image: {
      src: "/tiers.png",
      alt: "Package cards illustration"
    }
  },
  {
    icon: <Briefcase />,
    title: "Specialized consulting",
    description: "Share your expertise through tailored consulting packages.",
    image: {
      src: "/consulting.png",
      alt: "Package cards illustration"
    }
  },
  {
    icon: <GraduationCap />,
    title: "Training",
    description: "Teach others what you know with training packages.",
    image: {
      src: "/course.png",
      alt: "Course illustration"
    }
  }
];

export default function Sell() {
  return (
    <Section
      id="sell"
      color={colors.green["100"]}
      badge={{
        icon: <ShoppingBag />,
        title: "Sell"
      }}
      headline={
        <>
          Sell Se<span className="tracking-normal">r</span>vices
        </>
      }
      description="Manage your offerings in one place with ready-made contracts & proven pricing structures. Perfect for:"
      isFullBleed
    >
      <div className="group relative mx-auto w-full max-w-[var(--marketing-max-width)]">
        <div className="flex flex-col gap-6 lg:flex-row">
          {featureCards.map((card, index) => (
            <div key={index} className="w-full">
              <FeatureCard
                icon={card.icon}
                title={card.title}
                description={card.description}
                image={card.image}
                color={colors.green}
                orientation="vertical"
                imageMaxWidth="max-w-sm w-full sm:max-w-md"
                className="mx-auto aspect-[3/4] max-h-[420px] w-full"
              />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
