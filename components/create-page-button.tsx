"use client";

import { createPage } from "@/app/services/page-service";
import { Button } from "@/components/ui/button";
import va from "@vercel/analytics";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function CreatePageButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      loading={isPending}
      loadingText="Creating Page"
      onClick={() =>
        startTransition(async () => {
          try {
            const page = await createPage();
            va.track("Created Page");
            router.refresh();
            router.push(`/page/${page.id}`);
          } catch (error) {
            console.error(error);
          }
        })
      }
    >
      New Page
    </Button>
  );
}
