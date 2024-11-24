import { useState } from "react";
import SectionHeader from "./section-header";
import { Bold, Button, Card, TextInput } from "@tremor/react";
import { addNewProspectForPackage } from "@/app/services/prospect-service";
import { Tier } from "@prisma/client";

export default function ProspectiveCheckout({ tier }: { tier: Tier }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const newProspect = {
      email: formData.get("email") as string,
      name: formData.get("name") as string,
    };

    try {
      await addNewProspectForPackage(newProspect, tier);
    } catch (error) {
      // TODO(mathusan): handle this error better.
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
          Please provide your email address and name below so we can get in
          touch with you.
        </span>
      </section>
      <section>
        <Card>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="w-full items-center">
              <Bold>Email Address:</Bold>
              <TextInput
                name="email"
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="w-full items-center">
              <Bold>Name:</Bold>
              <TextInput name="name" placeholder="Enter your name" required />
            </div>

            <div className="items-center">
              <Button
                disabled={isSubmitting}
                type="submit"
                className="w-full"
                loading={isSubmitting}
              >
                Get In Touch →
              </Button>
            </div>
          </form>
        </Card>
      </section>
    </div>
  );
}
