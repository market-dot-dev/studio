"use client";

import { useTransition } from "react";
import { createPage } from "@/app/services/PageService";
import { useRouter } from "next/navigation";
import va from "@vercel/analytics";
import { Button } from "@/components/ui/button";

export default function CreatePageButton() {
  const router = useRouter();
  // const { id } = useParams() as { id: string };
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
