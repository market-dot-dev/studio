"use client";

import Image from "next/image";
import { Button, TextInput } from "@tremor/react";
import {
  HandHelping,
  GraduationCap,
  BriefcaseBusiness,
  BookOpen,
  BookLock,
  AppWindowMac,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface Offering {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
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
  },
  {
    id: "private-repos",
    title: "Private Repos",
    description: "Share private repositories and code",
    icon: BookLock,
  },
  {
    id: "sass-tools",
    title: "SaaS Tools",
    description: "Write and publish digital books",
    icon: AppWindowMac,
  },
];

export default function OfferingsForm() {
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

  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-8">
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
        {offerings.map(({ id, title, description, icon: Icon }) => (
          <label
            key={id}
            className="block w-full rounded-tremor-default focus-within:outline-none focus-within:ring-1 focus-within:ring-gray-300"
          >
            <div className="relative flex h-full cursor-pointer flex-col items-center rounded-tremor-default border bg-white hover:focus-within:bg-white p-6 text-center shadow-sm transition-colors focus-within:border-gray-300 hover:bg-gray-50 [&:has(input:checked)]:border-gray-800 [&:has(input:checked)]:ring-1 [&:has(input:checked)]:ring-gray-800">
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
          </label>
        ))}
      </div>

      <div className="w-full max-w-lg space-y-2">
        <TextInput placeholder="Something else..." />
      </div>

      {/* Navigation */}
      <div className="flex w-full max-w-lg justify-between pt-6">
        <Link href="/design/wizard/business">
          <Button variant="light">Back</Button>
        </Link>
        <Button variant="primary">Finish</Button>
      </div>
    </div>
  );
}
