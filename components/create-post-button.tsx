"use client";

import { useTransition } from "react";
import { createPost } from "@/lib/actions";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import va from "@vercel/analytics";

export default function CreatePostButton() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      loading={isPending}
      loadingText="Creating Post"
      onClick={() =>
        startTransition(async () => {
          const post = await createPost(null, id, null);
          va.track("Created Post");
          router.refresh();
          router.push(`/post/${post.id}`);
        })
      }
    >
      Create Post
    </Button>
  );
}
