"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Feature } from "@prisma/client";
import { Check, Send } from "lucide-react";
import { useState } from "react";
import styles from "./features.module.css";

export default function CustomerPackageFeatures({
  features,
  maintainerEmail
}: {
  features: Partial<Feature>[];
  maintainerEmail: string | null;
}) {
  const [open, setOpen] = useState(false);

  const isEmail = (uri: string) => uri.includes("@");
  const isPhoneNumber = (uri: string) => /^\+?[1-9]\d{1,14}$/.test(uri);

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        <Send />
        Contact
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Package Features & Contact</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2 text-sm">
            {[{ id: 0, name: "Contact", uri: maintainerEmail }, ...features].map((feature) =>
              feature.uri ? (
                <div key={feature.id} className={styles.feature_item + " flex flex-col gap-2"}>
                  <h2 className="text-xl font-bold">{feature.name}</h2>
                  <div className="flex items-center justify-between gap-4 rounded-sm border p-2 text-sm">
                    {isEmail(feature.uri) ? (
                      <a href={`mailto:${feature.uri}`} className="flex items-center gap-2">
                        <span>{feature.uri}</span>
                      </a>
                    ) : isPhoneNumber(feature.uri) ? (
                      <a href={`tel:${feature.uri}`} className="flex items-center gap-2">
                        <span>{feature.uri}</span>
                      </a>
                    ) : (
                      <a href={feature.uri} target="_blank" className="flex items-center gap-2">
                        <span>{feature.uri}</span>
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="start flex gap-2 text-stone-600" key={feature.id}>
                  <Check strokeWidth={2.75} className="text-swamp-500 my-0.5 size-4" /> &nbsp;{" "}
                  {feature.name}
                </div>
              )
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
