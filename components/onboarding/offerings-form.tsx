"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  HandHelping,
  GraduationCap,
  BriefcaseBusiness,
  BookOpen,
  BookLock,
  Book,
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
    id: "e-books",
    title: "Ebooks",
    description: "Write and publish digital books",
    icon: Book,
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
      <div className="flex flex-col items-center gap-9">
        <div className="flex flex-col items-center gap-3">
          <div className="flex justify-center">
            <Image
              src="/gw-logo-nav.png"
              alt="Gitwallet Logo"
              className="h-11 w-11 shrink-0"
              height={44}
              width={44}
            />
          </div>

          <h1 className="text-center text-2xl font-bold tracking-tight text-stone-900">
            Last, what are you selling?
          </h1>
        </div>

        <div className="flex w-full flex-col gap-4">
          {offerings.map(
            ({ id, title, description, icon: Icon, isComingSoon }) => (
              <label
                key={id}
                className="block h-full w-full rounded focus-within:outline-none focus-within:ring-2 focus-within:ring-stone-300"
              >
                <div className="relative h-full">
                  <div className="relative flex h-full w-full cursor-pointer flex-col gap-1.5 rounded bg-white p-4 pt-3.5 shadow-border transition-all focus-within:border-stone-300 hover:bg-stone-50 hover:focus-within:bg-white [&:has(input:checked)]:ring-2 [&:has(input:checked)]:ring-marketing-swamp">
                    <div className="flex items-center gap-2.5">
                      <Icon className="size-[18px] shrink-0 text-stone-500" />
                      <h3 className="text-sm font-semibold text-stone-900">
                        {title}
                      </h3>
                      {isComingSoon && (
                        <span className="border-box z-10 flex h-[18px] items-center rounded-full border border-black/10 bg-stone-100 px-1.5 text-[9px] font-bold uppercase tracking-wide text-stone-500">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-stone-500">{description}</p>
                    <input
                      type="checkbox"
                      className="sr-only hidden"
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
        <div className="flex w-full justify-between pt-4">
          <Button variant="ghost" size="lg" onClick={onBack} type="button">
            Back
          </Button>
          <Button type="submit" size="lg" loading={isLoading}>
            Finish
          </Button>
        </div>
      </div>
    </form>
  );
}
