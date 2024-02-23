"use client";

import { useTransition } from "react";
import { createPage } from "@/app/services/PageService";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import LoadingDots from "@/components/icons/loading-dots";
import va from "@vercel/analytics";
import { Button } from "@tremor/react";
import { Page } from "@prisma/client";

export default function CreatePageButton() {
  const router = useRouter();
  // const { id } = useParams() as { id: string };
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
        "flex h-8 items-center justify-center space-x-2 px-4 py-1.5  rounded-lg border text-sm transition-all sm:h-9",
        isPending
          ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400"
          : "border border-black bg-gray-800 hover:bg-gray-900 px-4 py-1.5 text-white active:bg-stone-100",
      )}
      disabled={isPending}
    >
      {isPending ? 
        <>
          <p>Creating Page</p>
          <LoadingDots color="#808080" />
        </> : 
        <p>Create New Page</p>}
    </Button>
  );
}
