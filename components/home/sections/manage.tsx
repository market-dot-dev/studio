import FeatureCard from "@/components/home/feature-card";
import Section from "@/components/home/section";
import { colors } from "@/lib/home/colors";
import { ChartLine, ListCheck, ScrollText, UsersRound } from "lucide-react";

export default function Manage() {
  return (
    <Section
      id="manage"
      badge={{
        icon: <ListCheck />,
        title: "Manage"
      }}
      color={colors.orange["100"]}
      headline="Manage Your Business"
      description="A full suite of tools to replace the usual SaaS suspects and help you build your business."
      isFullBleed
      className="lg:max-w-[1150px]"
    >
      <div className="mx-auto grid w-full grid-cols-1 gap-4 md:grid-cols-3 lg:gap-6">
        <FeatureCard
          icon={<ScrollText />}
          title="Contract Library"
          description="Create & send service agreements in minutes using our ready-made, open source contracts."
          color={colors.orange}
          orientation="vertical"
          imageMaxWidth={null}
          className="ring-0 md:ring-1"
        />
        <FeatureCard
          icon={<ChartLine />}
          title="Client Portals"
          description="Create client portals to help you manage your services with your clients."
          color={colors.orange}
          orientation="vertical"
          imageMaxWidth={null}
          className="ring-0 md:ring-1"
        />
        <FeatureCard
          icon={<UsersRound />}
          title="CRM & Lead Generation"
          description="A simple, no-nonsense CRM with built-in lead-generation tools"
          color={colors.orange}
          orientation="vertical"
          imageMaxWidth={null}
          className="ring-0 md:ring-1"
        />
      </div>
    </Section>
  );
}
