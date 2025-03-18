"use client";

import { useParams, useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { deletePost } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import va from "@vercel/analytics";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function DeletePostForm({ postName }: { postName: string }) {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  
  const handleSubmit = (data: FormData) => {
    setFormData(data);
    setConfirmDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!formData) return;
    
    const res = await deletePost(formData, id, "delete");
    if (res.error) {
      toast.error(res.error);
    } else {
      va.track("Deleted Post");
      router.refresh();
      router.push(`/site/${res.siteId}`);
      toast.success(`Successfully deleted post!`);
    }
    
    setConfirmDialogOpen(false);
  };
  
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(new FormData(e.currentTarget));
        }}
        className="rounded-lg border border-red-600 bg-white dark:bg-black"
      >
        <div className="relative flex flex-col space-y-4 p-5 sm:p-10">
          <h2 className="font-cal text-xl dark:text-white">Delete Post</h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Deletes your post permanently. Type in the name of your post{" "}
            <b>{postName}</b> to confirm.
          </p>
          <Input
            name="confirm"
            type="text"
            required
            pattern={postName}
            placeholder={postName}
            className="w-full max-w-md"
          />
        </div>

        <div className="flex flex-col items-center justify-center space-y-2 rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800 sm:flex-row sm:justify-between sm:space-y-0 sm:px-10">
          <p className="text-center text-sm text-stone-500 dark:text-stone-400">
            This action is irreversible. Please proceed with caution.
          </p>
          <div className="w-32">
            <FormButton />
          </div>
        </div>
      </form>
      
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-stone-500">
              Are you sure you want to delete your post?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                onClick={confirmDelete}
              >
                Delete Post
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function FormButton() {
  const { pending } = useFormStatus();
  return (
    <Button variant="destructive" loading={pending} loadingText="Deleting" type="submit">
      Delete Post
    </Button>
  );
}
