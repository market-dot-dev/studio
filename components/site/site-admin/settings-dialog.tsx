"use client"

import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Site } from "@prisma/client";
import { Settings } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import Uploader from "@/components/form/uploader";
import { updateSite } from "./settings-action";

interface SettingsDialogProps {
  site: Partial<Site>;
  handleSiteUpdate: () => Promise<void>;
}

function SubdomainField({ subdomain, siteURL }: { subdomain: string | null | undefined; siteURL: string }) {
  return (
    <div className="flex w-full flex-col items-start gap-2">
      <div>
        <Label htmlFor="subdomain" className="mb-1">
          Subdomain
        </Label>
        <p className="text-xs text-stone-500">
          Your store will appear at{" "}
          <Link className="underline" href={siteURL}>
            {siteURL}
          </Link>
        </p>
      </div>
      <Input
        placeholder="Your subdomain"
        name="subdomain"
        id="subdomain"
        defaultValue={subdomain ?? ""}
      />
    </div>
  );
}

function NameField({ name }: { name: string | null | undefined }) {
  return (
    <div className="flex w-full flex-col items-start gap-2">
      <Label htmlFor="name">Name</Label>
      <Input
        placeholder="Your store title"
        name="name"
        id="name"
        defaultValue={name ?? ""}
      />
    </div>
  );
}

function LogoField({ logo, setChanged }: { logo: string | null | undefined; setChanged: (changed: boolean) => void }) {
  return (
    <div className="flex w-full flex-col items-start gap-2">
      <div>
        <Label htmlFor="logo" className="mb-1">
          Logo
        </Label>
        <p className="text-xs text-stone-500">
          Your store logo is used in your landing page, for favicons and
          Open Graph images.
        </p>
      </div>
      <Uploader
        defaultValue={logo ?? null}
        name="logo"
        setChanged={setChanged}
      />
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button 
      type="submit" 
      disabled={pending}
      aria-disabled={pending}
      loading={pending}
      loadingText="Save"
    >
      Save
    </Button>
  );
}

export default function SettingsDialog({ site, handleSiteUpdate }: SettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [changed, setChanged] = useState(false);

  const siteURL = `https://${site.subdomain}.market.dev`;

  const handleFormAction = async (formData: FormData) => {
    if (!changed) formData.delete("logo"); // Only include logo if changed

    const result = await updateSite(formData);

    if (result.success) {
      setChanged(false);
      setOpen(false);
      toast.success("Store updated");
      await handleSiteUpdate();
    } else {
      toast.error(result.message || "Failed to update store settings");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Landing Page Settings</DialogTitle>
        </DialogHeader>
        <ScrollArea>
          <form
            id="site-settings-form"
            action={handleFormAction}
            className="space-y-6 px-6 pb-6 pt-2"
          >
            <SubdomainField subdomain={site.subdomain} siteURL={siteURL} />
            <NameField name={site.name} />
            <LogoField logo={site.logo} setChanged={setChanged} />
            <div className="flex justify-end">
              <SubmitButton />
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
} 