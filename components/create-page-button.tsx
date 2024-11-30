"use client";

import { useTransition } from "react";
import { createPage } from "@/app/services/PageService";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import LoadingDots from "@/components/icons/loading-dots";
import va from "@vercel/analytics";
import { Button } from "@tremor/react";

export default function CreatePageButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
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
      className={cn(
        "flex h-8 items-center justify-center space-x-2 rounded-lg border px-4 py-1.5 text-sm transition-all sm:h-9",
        isPending
          ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400"
          : "border border-black bg-gray-800 px-4 py-1.5 text-white hover:bg-gray-900 active:bg-stone-100",
      )}
      disabled={isPending}
    >
      {isPending ? (
        <>
          <p>Creating Page</p>
          <LoadingDots color="#808080" />
        </>
      ) : (
        <p>Create New Page</p>
      )}
    </Button>
  );
}
