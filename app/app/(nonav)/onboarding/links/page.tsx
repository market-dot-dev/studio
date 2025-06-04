"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CircleMinus, CirclePlus, Link, ScanFace } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Generate a simple unique ID for field keys
const generateId = (): string => {
  return `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

interface UserLink {
  id: string;
  url: string;
}

async function submitLinks(links: UserLink[]) {
  try {
    // Filter out empty links
    const validLinks = links.filter((link) => link.url.trim() !== "");

    if (validLinks.length > 0) {
      const urlsArray = validLinks.map((link) => link.url);

      // For now, we'll store this in a JSON field or create a separate table
      // This is a placeholder - you'd want to extend the user model or create a separate links table
      console.log("Storing user links:", urlsArray);

      // You could update the user with a socialLinks JSON field:
      // await updateCurrentUser({ socialLinks: urlsArray });
    }

    return { success: true };
  } catch (error) {
    console.error("Error saving links:", error);
    throw new Error("An error occurred. Please try again.");
  }
}

export default function LinksOnboardingPage() {
  const [links, setLinks] = useState<UserLink[]>([{ id: generateId(), url: "" }]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const addLink = () => {
    setLinks([...links, { id: generateId(), url: "" }]);
  };

  const removeLink = (id: string) => {
    if (links.length > 1) {
      setLinks(links.filter((link) => link.id !== id));
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const updateLinkUrl = (id: string, url: string) => {
    setLinks(links.map((link) => (link.id === id ? { ...link, url } : link)));

    // Clear error for this field when user starts typing
    if (errors[id]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const validateLinks = (): boolean => {
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    links.forEach((link) => {
      if (link.url.trim() && !isValidUrl(link.url)) {
        newErrors[link.id] = "Please enter a valid URL";
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleSubmit = () => {
    if (!validateLinks()) {
      return;
    }

    startTransition(async () => {
      try {
        await submitLinks(links);
        toast.success("Links saved successfully!");
        router.push("/onboarding/complete");
      } catch (error: any) {
        console.error("Error saving links:", error);
        toast.error(error.message || "Failed to save links");
      }
    });
  };

  const handleSkip = () => {
    router.push("/onboarding/complete");
  };

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Let's get to know you better</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tell us about you & your business so we can give better recommendations.
        </p>
      </div>

      <Alert className="bg-transparent p-0 shadow-none">
        <AlertTitle className="inline-flex justify-center gap-2">
          <ScanFace className="size-4 -translate-y-px text-muted-foreground" />
          Make market.dev 10x smarter
        </AlertTitle>
        <AlertDescription className="text-xs">
          We'll scan any links you share and use what we learn to suggest services, improve
          positioning, and set up marketing channels.
        </AlertDescription>
      </Alert>

      <div className="space-y-3">
        <div className="space-y-1">
          <Label>Links</Label>
          <p className="self-center text-xs text-muted-foreground">
            ex: Personal/Business site, Linkedin/Twitter profile, blog posts
          </p>
        </div>
        <div className="space-y-2">
          {links.map((link) => (
            <div key={link.id} className="flex flex-col gap-1">
              <div className="flex items-start gap-4">
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={link.url}
                  onChange={(e) => updateLinkUrl(link.id, e.target.value)}
                  icon={<Link />}
                  className={cn("flex-1", errors[link.id] && "border-destructive")}
                />
                {links.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLink(link.id)}
                    className="-mx-2 h-9 rounded-full text-stone-400 hover:bg-transparent focus:bg-transparent md:h-8"
                  >
                    <CircleMinus className="size-4" />
                  </Button>
                )}
              </div>
              {errors[link.id] && (
                <p className="my-1 text-xs text-destructive">{errors[link.id]}</p>
              )}
            </div>
          ))}

          <div className="inline-flex gap-4">
            <Button variant="nude" onClick={addLink} className="ml-1.5 p-0">
              <CirclePlus className="size-4" />
              Add Link
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={isPending}
            loading={isPending}
            loadingText="Saving Links"
          >
            Continue
          </Button>

          <Button onClick={handleSkip} variant="ghost" className="w-full" disabled={isPending}>
            Skip for now
          </Button>
        </div>

        <div className="text-center">
          <p className="text-xs text-stone-500">
            This is optional. You can always add or update these links later.
          </p>
        </div>
      </div>
    </div>
  );
}
