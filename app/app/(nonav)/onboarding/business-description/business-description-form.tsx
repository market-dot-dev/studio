"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useDraftPackages } from "@/hooks/use-draft-packages";
import { Check, PackagePlus } from "lucide-react";
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
  organizationId: string;
}

export default function BusinessDescriptionForm({
  submitAction,
  organizationId,
  existingDescription = ""
}: BusinessDescriptionFormProps) {
  const [state, formAction, pending] = useActionState(submitAction, initialState);
  const { clearDraftPackages } = useDraftPackages(organizationId);

  const actionWithLocalStorageCleanup = (formData: FormData) => {
    if (organizationId) {
      clearDraftPackages();
    }
    formAction(formData);
  };

  return (
    <form action={actionWithLocalStorageCleanup} className="flex flex-col gap-8">
      <div>
        <Textarea
          id="businessDescription"
          name="businessDescription"
          placeholder="I'm a freelance web developer specializing in React and Next.js applications. I offer website development, consulting, and code reviews for small to medium businesses."
          className="relative z-[1] mb-4 min-h-[136px] resize-none px-4 py-3 placeholder:text-foreground/[35%] md:min-h-[112px]"
          required
          defaultValue={state?.fields?.businessDescription || existingDescription}
        />

        <div className="pl-3.5">
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
                Typical tiers & price points
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* <div className="relative overflow-hidden rounded border  bg-stone-200/50 px-4 py-3">
          <div className="space-y-1 pr-28">
            <div className="flex items-center gap-2">
              <AppWindowMac size={16} className="text-muted-foreground" />
              <p className="text-xs font-semibold text-foreground">Custom Landing Page</p>
            </div>
            <p className="max-w-[250px] text-pretty text-xs text-muted-foreground">
              We'll also use this description to draft your landing page. You can customize it
              later.
            </p>
          </div>

          <div className="absolute -bottom-1 -right-1">
            <div className="absolute bottom-3 right-0 z-10 flex items-center gap-1 whitespace-nowrap rounded-[2px] bg-white py-0.5 pl-1 pr-2 font-mono text-[7px] font-semibold tracking-wide text-stone-600 shadow-border">
              <Globe size={7} />
              your-domain.market.dev
            </div>

            <div className="h-16 w-28 rounded-sm bg-white shadow-border">
              <div className="space-y-1 p-2">
                <div className="h-1 w-full rounded-sm bg-stone-150"></div>
                <div className="h-1 w-3/4 rounded-sm bg-stone-100"></div>
                <div className="h-1 w-1/2 rounded-sm bg-stone-50"></div>
              </div>
            </div>
          </div>
        </div> */}

        <div className="flex w-full flex-col gap-3">
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
              Create my draft packages
            </Button>
          </div>
          <Button variant="ghost" className="w-full text-muted-foreground" asChild>
            <Link href="/onboarding/stripe">Skip, I'll make my own later</Link>
          </Button>
        </div>
      </div>
    </form>
  );
}
