"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AppWindowMac, Check, Globe, PackagePlus, Pencil } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";

const initialState = {
  error: "",
  fields: {}
};

interface BusinessDescriptionFormProps {
  submitAction: (
    prevState: any,
    formData: FormData
  ) => Promise<{ error?: string; fields?: Record<string, string> }>;
  existingDescription?: string;
}

export default function BusinessDescriptionForm({
  submitAction,
  existingDescription = ""
}: BusinessDescriptionFormProps) {
  const [state, formAction, pending] = useActionState(submitAction, initialState);

  return (
    <form action={formAction} className="mt- flex flex-col gap-10">
      <div>
        <h2 className="mb-3 ml-2 text-sm font-semibold tracking-tightish text-foreground">
          Tell us about your business
        </h2>
        <Textarea
          id="businessDescription"
          name="businessDescription"
          placeholder="I'm a freelance web developer specializing in React and Next.js applications. I offer website development, consulting, and code reviews for small to medium businesses."
          className="relative z-[1] mb-4 min-h-[136px] resize-none px-4 py-3 placeholder:text-foreground/[35%] md:min-h-[112px]"
          required
          defaultValue={state?.fields?.businessDescription || existingDescription}
        />

        <div className="pl-3">
          {state?.error && (
            <div className="mb-4">
              <p className="text-xs text-destructive">{state.error}</p>
            </div>
          )}

          <div className="space-y-2 text-xs text-muted-foreground">
            <p>Be as detailed as possible. Tell us about...</p>
            <ul className="space-y-1">
              <li className="flex items-center gap-2 text-xs text-muted-foreground">
                <Check strokeWidth={2.25} className="size-3.5 shrink-0 text-muted-foreground" />
                Your expertise
              </li>
              <li className="flex items-center gap-2 text-xs text-muted-foreground">
                <Check strokeWidth={2.25} className="size-3.5 shrink-0 text-muted-foreground" />
                Services you want to sell
              </li>
              <li className="flex items-center gap-2 text-xs text-muted-foreground">
                <Check strokeWidth={2.25} className="size-3.5 shrink-0 text-muted-foreground" />
                Typical price points or tiers
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* Landing Page Callout */}
        <div className="relative overflow-hidden rounded border  bg-stone-200/50 px-4 py-3">
          <div className="space-y-1 pr-28">
            <div className="flex items-center gap-2">
              <AppWindowMac size={16} className="text-muted-foreground" />
              <p className="text-xs font-semibold text-foreground">Custom Landing Page</p>
            </div>
            <p className="max-w-[250px] text-pretty text-xs text-muted-foreground">
              We'll also use this description to draft up a landing page you can customize later.
            </p>
          </div>

          {/* Landing Page Preview Mockup */}
          <div className="absolute -bottom-1 -right-1">
            {/* Domain chip floating above */}
            <div className="absolute bottom-3 right-0 z-10 flex items-center gap-1 whitespace-nowrap rounded-[2px] bg-white py-0.5 pl-1 pr-2 font-mono text-[7px] font-semibold tracking-wide text-stone-600 shadow-border">
              <Globe size={7} />
              your-domain.market.dev
            </div>

            {/* Landing page mockup card */}
            <div className="h-16 w-28 rounded-sm bg-white shadow-border">
              <div className="space-y-1 p-2">
                {/* Hero section mockup */}
                <div className="h-1 w-full rounded-sm bg-stone-150"></div>
                <div className="h-1 w-3/4 rounded-sm bg-stone-100"></div>
                <div className="h-1 w-1/2 rounded-sm bg-stone-50"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 bg-stone-150">
            <div className="group overflow-hidden">
              <div id="package-preview" className="-mb-12 flex items-center justify-center">
                <div className="-mr-6 mt-6 h-20 w-16 -rotate-3 rounded-sm bg-white p-1.5 shadow-border-md transition-transform duration-200 ease-in-out group-hover:-translate-y-1.5 group-hover:rotate-[-9deg] group-hover:shadow-border-xl"></div>
                <div className="z-[1] h-20 w-16 rounded-sm bg-white shadow-border-md transition-transform duration-300 ease-in-out group-hover:-translate-y-2 group-hover:shadow-border-xl"></div>
                <div className="-ml-6 mt-6 h-20 w-16 rotate-3 rounded-sm bg-white shadow-border-md transition-transform duration-200 ease-in-out group-hover:-translate-y-1.5 group-hover:rotate-[9deg] group-hover:shadow-border-xl"></div>
              </div>
              <Button
                type="submit"
                className="relative z-[3] w-full disabled:bg-muted-foreground disabled:opacity-100"
                loading={pending}
                loadingText="Generating draft packages"
              >
                <PackagePlus />
                Generate draft packages
              </Button>
            </div>
            <Button variant="ghost" className="w-full text-muted-foreground" asChild>
              <Link href="/onboarding/organization">Skip, I'll make them later</Link>
            </Button>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            <Pencil size="14" className="mr-1 inline-block -translate-y-px" /> You'll be able to
            edit, delete & publish these packages later.
          </p>
        </div>
      </div>
    </form>
  );
}
