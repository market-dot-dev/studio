"use client";

import { User } from "@prisma/client";
import {
  Book,
  BookLock,
  BookOpen,
  BriefcaseBusiness,
  GraduationCap,
  HandHelping
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
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
    icon: HandHelping
  },
  {
    id: "training",
    title: "Training",
    description: "Deliver hands-on training sessions",
    icon: GraduationCap
  },
  {
    id: "consulting",
    title: "Consulting",
    description: "Provide expert consulting and advisory",
    icon: BriefcaseBusiness
  },
  {
    id: "courses",
    title: "Courses",
    description: "Create and sell online courses",
    icon: BookOpen,
    isComingSoon: true
  },
  {
    id: "private-repos",
    title: "Private Repos",
    description: "Share private repositories and code",
    icon: BookLock,
    isComingSoon: true
  },
  {
    id: "e-books",
    title: "Ebooks",
    description: "Write and publish digital books",
    icon: Book,
    isComingSoon: true
  }
];

interface OfferingsData {
  offerings: string[];
}

interface OfferingsFormProps {
  user: User;
  onSubmit: (data: OfferingsData) => void;
  isLoading: boolean;
}

export default function OfferingsForm({ user, onSubmit, isLoading }: OfferingsFormProps) {
  const [selectedOfferings, setSelectedOfferings] = useState<Set<string>>(new Set());

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
      offerings: Array.from(selectedOfferings)
    });
  };

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-9">
        <div className="flex flex-col items-center gap-2">
          <div className="flex justify-center">
            <Image
              src="/gw-logo-nav.png"
              alt="Gitwallet Logo"
              className="size-9 shrink-0"
              height={36}
              width={36}
              priority
            />
          </div>

          <h1 className="tracking-tightish text-center text-xl font-bold text-stone-800">
            Last, what are you selling?
          </h1>
        </div>

        <div className="flex w-full grid-cols-2 flex-col gap-4 md:grid">
          {offerings.map(({ id, title, description, icon: Icon, isComingSoon }) => (
            <label
              key={id}
              className="block size-full rounded focus-within:outline-none focus-within:ring-2 focus-within:ring-stone-300"
            >
              <div className="relative h-full">
                <div className="shadow-border-sm hover:shadow-border [&:has(input:checked)]:ring-marketing-swamp relative flex size-full cursor-pointer flex-col gap-1.5 rounded bg-white p-4 pt-3.5 transition-all focus-within:border-stone-300 hover:focus-within:bg-white [&:has(input:checked)]:ring-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Icon className="my-px size-[18px] shrink-0 text-stone-500" />
                    <h3 className="text-sm font-semibold text-stone-900">{title}</h3>
                    {isComingSoon && (
                      <span className="border-box absolute right-0 top-0 z-10 flex h-[18px] items-center whitespace-nowrap rounded-bl-md border-b border-l border-black/10 bg-stone-100 px-1 text-[9px] font-bold uppercase tracking-wide text-stone-500">
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
          ))}
        </div>
      </div>
    </form>
  );
}
