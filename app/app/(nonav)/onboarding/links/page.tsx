import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info, Link } from "lucide-react";
import { redirect } from "next/navigation";

async function submitLinks(formData: FormData) {
  "use server";

  const links = {
    website: formData.get("website") as string,
    linkedin: formData.get("linkedin") as string,
    twitter: formData.get("twitter") as string,
    github: formData.get("github") as string
  };

  try {
    // Store links in user profile (you might want to create a separate field for this)
    const linksJson = Object.fromEntries(
      Object.entries(links).filter(([, value]) => value && value.trim() !== "")
    );

    if (Object.keys(linksJson).length > 0) {
      // For now, we'll store this in a JSON field or create a separate table
      // This is a placeholder - you'd want to extend the user model or create a separate links table
      console.log("Storing user links:", linksJson);

      // You could update the user with a socialLinks JSON field:
      // await updateCurrentUser({ socialLinks: linksJson });
    }

    // Navigate to final step
    redirect("/onboarding/complete");
  } catch (error) {
    console.error("Error saving links:", error);
    throw new Error("An error occurred. Please try again.");
  }
}

async function skipLinks() {
  "use server";
  redirect("/onboarding/complete");
}

export default async function LinksOnboardingPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Share your links</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Help us understand your background to create better service recommendations.
        </p>
      </div>

      <Alert className="border border-stone-200/50 bg-stone-200/50 shadow-none">
        <AlertTitle className="inline-flex gap-2">
          <Info className="size-4 -translate-y-px text-muted-foreground" />
          Why do we collect this?
        </AlertTitle>
        <AlertDescription className="text-xs">
          We'll analyze your online presence to suggest the best services to offer and help you
          create compelling service descriptions that match your expertise.
        </AlertDescription>
      </Alert>

      <form action={submitLinks} className="space-y-6">
        {/* Website */}
        <div className="space-y-2">
          <Label htmlFor="website" className="flex items-center gap-2">
            Personal or Business Website
          </Label>
          <Input
            id="website"
            name="website"
            type="url"
            placeholder="https://yourwebsite.com"
            icon={<Link />}
          />
        </div>

        {/* LinkedIn */}
        <div className="space-y-2">
          <Label htmlFor="linkedin" className="flex items-center gap-2">
            LinkedIn
          </Label>
          <Input
            id="linkedin"
            name="linkedin"
            type="url"
            placeholder="https://linkedin.com/in/yourprofile"
            icon={<Link />}
          />
        </div>

        {/* Twitter */}
        <div className="space-y-2">
          <Label htmlFor="twitter" className="flex items-center gap-2">
            Twitter
          </Label>
          <Input
            id="twitter"
            name="twitter"
            type="url"
            placeholder="https://twitter.com/yourusername"
            icon={<Link />}
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button type="submit" className="w-full">
            Continue
          </Button>

          <Button formAction={skipLinks} variant="ghost" className="w-full">
            Skip for now
          </Button>
        </div>
      </form>

      <div className="text-center">
        <p className="text-xs text-stone-500">
          All fields are optional. You can always add or update these links later.
        </p>
      </div>
    </div>
  );
}
