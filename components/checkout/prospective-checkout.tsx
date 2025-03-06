"use client";

import { useState } from "react";
import SectionHeader from "./section-header";
import { TextInput, Textarea } from "@tremor/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
    <div className="w-7/8 flex flex-col gap-4">
      <section className="text-md mb-8 text-slate-600 lg:w-5/6">
        <SectionHeader headerName="Contact Us" />
        <span>
          Please provide your details below so we can get in touch with you.
        </span>
      </section>
      <section>
        <Card>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="w-full items-center">
              <strong>Email Address:</strong>
              <TextInput
                name="email"
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="w-full items-center">
              <strong>Name:</strong>
              <TextInput 
                name="name" 
                placeholder="Enter your name" 
                required 
              />
            </div>
            <div className="w-full items-center">
              <strong>Organization:</strong>
              <TextInput
                name="organization"
                placeholder="Enter your organization name"
                required
              />
            </div>
            <div className="w-full items-center">
              <strong>Additional Context:</strong>
              <Textarea
                name="context"
                placeholder="Tell us more about your project needs and how we can help"
                required
                className="min-h-[100px]"
              />
            </div>
            <div className="items-center">
              <Button
                type="submit"
                className="w-full"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Get in touch
              </Button>
            </div>
          </form>
        </Card>
      </section>
    </div>
  );
}
