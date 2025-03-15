"use client";

import { useState } from "react";
import SectionHeader from "./section-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addNewProspectForPackage } from "@/app/services/prospect-service";
import { Tier } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ProspectiveCheckout({ tier }: { tier: Tier }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const newProspect = {
      email: formData.get("email") as string,
      name: formData.get("name") as string,
      organization: formData.get("organization") as string,
      context: formData.get("context") as string,
    };

    try {
      await addNewProspectForPackage(newProspect, tier);
      toast.success("We've received your request. We'll be in touch soon!");
      router.push("/");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="lg:max-w-md mx-auto flex flex-col items-center w-full gap-9">
      <form className="flex flex-col gap-9 w-full" onSubmit={handleSubmit}>
        <div className="flex w-full flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="flex w-full flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter your name"
            required
          />
        </div>
        <div className="flex w-full flex-col gap-2">
          <Label htmlFor="organization">Organization</Label>
          <Input
            id="organization"
            name="organization"
            placeholder="Enter your organization name"
            required
          />
        </div>
        <div className="flex w-full flex-col gap-2">
          <Label htmlFor="context">Additional Context</Label>
          <Textarea
            id="context"
            name="context"
            placeholder="Tell us more about your project needs and how we can help"
            required
            className="min-h-[100px]"
          />
        </div>
        <Button
          size="lg"
          type="submit"
          className="w-full"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Get in touch
        </Button>
      </form>
    </div>
  );
}
