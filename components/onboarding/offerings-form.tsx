"use client";

import Image from "next/image";
import { Button } from "@tremor/react";
import {
  HandHelping,
  GraduationCap,
  BriefcaseBusiness,
  BookOpen,
  BookLock,
  AppWindowMac,
} from "lucide-react";
import { useState } from "react";
import { User } from "@prisma/client";
interface Offering {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  isComingSoon?: boolean;
}

const offerings: Offering[] = [
  {
    id: "support",
    title: "Support",
    description: "Offer professional services to your clients",
    icon: HandHelping,
  },
  {
    id: "training",
    title: "Training",
    description: "Deliver hands-on training sessions",
    icon: GraduationCap,
  },
  {
    id: "consulting",
    title: "Consulting",
    description: "Provide expert consulting and advisory",
    icon: BriefcaseBusiness,
  },
  {
    id: "courses",
    title: "Courses",
    description: "Create and sell online courses",
    icon: BookOpen,
    isComingSoon: true,
  },
  {
    id: "private-repos",
    title: "Private Repos",
    description: "Share private repositories and code",
    icon: BookLock,
    isComingSoon: true,
  },
  {
    id: "sass-tools",
    title: "SaaS Tools",
    description: "Write and publish digital books",
    icon: AppWindowMac,
    isComingSoon: true,
  },
];

interface OfferingsData {
  offerings: string[];
}

interface OfferingsFormProps {
  user: User;
  onSubmit: (data: OfferingsData) => void;
  onBack: () => void;
  isLoading: boolean;
}

export default function OfferingsForm({
  user,
  onSubmit,
  onBack,
  isLoading,
}: OfferingsFormProps) {
  const [selectedOfferings, setSelectedOfferings] = useState<Set<string>>(
    new Set(),
  );

  const toggleOffering = (id: string) => {
    const newSelected = new Set(selectedOfferings);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedOfferings(newSelected);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      offerings: Array.from(selectedOfferings),
    });
  };

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-8">
        <div className="flex justify-center">
          <Image
            src="/gw-logo-nav.png"
            alt="Gitwallet Logo"
            className="h-16 w-16 shrink-0"
            height={48}
            width={48}
          />
        </div>

        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
            What are you selling?
          </h1>
        </div>

        <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {offerings.map(
            ({ id, title, description, icon: Icon, isComingSoon }) => (
              <label
                key={id}
                className="block h-full w-full rounded-tremor-default focus-within:outline-none focus-within:ring-1 focus-within:ring-gray-300"
              >
                <div className="relative h-full">
                  {isComingSoon && (
                    <span className="absolute right-px top-px z-10 h-5 rounded-bl-[6px] border-b border-l border-black/5 bg-marketing-swamp pl-[7px] pr-2 text-[9px] font-bold uppercase leading-[19px] tracking-wider text-white shadow-sm md:rounded-tr-[5px]">
                      Coming Soon
                    </span>
                  )}
                  <div className="relative flex h-full w-full cursor-pointer flex-col items-center rounded-tremor-default border bg-white p-6 text-center shadow-sm transition-colors focus-within:border-gray-300 hover:bg-gray-50 hover:focus-within:bg-white [&:has(input:checked)]:border-marketing-swamp [&:has(input:checked)]:ring-1 [&:has(input:checked)]:ring-marketing-swamp">
                    <Icon className="mb-3 h-6 w-6 text-gray-500" />
                    <h3 className="mb-2 font-bold text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-500">{description}</p>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={selectedOfferings.has(id)}
                      onChange={() => toggleOffering(id)}
                    />
                  </div>
                </div>
              </label>
            ),
          )}
        </div>

        {/* Navigation */}
        <div className="flex w-full max-w-lg justify-between pt-6">
          <Button variant="light" onClick={onBack} type="button">
            Back
          </Button>
          <Button
            variant="primary"
            type="submit"
            loading={isLoading}
            disabled={isLoading}
          >
            Finish
          </Button>
        </div>
      </div>
    </form>
  );
}
