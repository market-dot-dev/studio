"use client";

import { useState } from "react";
import { Page, Site } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/page-header";
import PageEditor from "@/components/site/page-editor";
import { setHomepage, deletePage, updatePage } from "@/app/services/PageService";
import { useFullscreen } from "../dashboard/dashboard-context";
import { ArrowUpCircle, Home, EyeOff, MoreVertical, Trash } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
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
import { cn } from "@/lib/utils";

export default function PageContainer({
  site,
  page,
  siteUrl,
  homepageId,
  hasActiveFeatures,
  lastUpdateDate
}: {
  site: Partial<Site>;
  page: Partial<Page>;
  siteUrl: string | null;
  homepageId: string | null;
  hasActiveFeatures?: boolean;
  lastUpdateDate: string;
}) {
  const router = useRouter();
  const isHome = page.id === homepageId;
  const { fullscreen } = useFullscreen();
  
  const [inProgress, setInProgress] = useState<boolean>(false);
  const [isMakingHomepage, setIsMakingHomepage] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isDraft, setIsDraft] = useState<boolean>(!!page.draft);
  const [isPublishingInProgress, setIsPublishingInProgress] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  
  const handleSave = async (pageData: Partial<Page>) => {
    if (inProgress || isPublishingInProgress || !pageData?.id) return;
    setInProgress(true);
    
    try {
      const { title, slug, content } = pageData;
      
      const result = await updatePage(pageData.id, { 
        title, 
        slug, 
        content,
        draft: isDraft
      });
      
      toast.success("The page was successfully saved");
      
      if(window?.hasOwnProperty('refreshOnboarding')) {
        (window as any)['refreshOnboarding']();
      }
      
      router.refresh();
    } catch (error) {
      console.error('Error saving page:', error);
      toast.error("Failed to save the page");
    } finally {
      setInProgress(false);
    }
  };
  
  const handleDelete = async () => {
    if (inProgress || isPublishingInProgress || !page?.id) return;
    setIsDeleting(true);
    
    try {
      const result = await deletePage(page.id) as any;
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("The page was successfully deleted");
        router.push(`/site/${site.id}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting the page");
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleMakeHomepage = async () => {
    if (inProgress || isPublishingInProgress || !page?.siteId || !page?.id) return;
    setIsMakingHomepage(true);
    
    try {
      const result = await setHomepage(page.siteId, page.id) as any;
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("This is your new homepage");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while promoting the page");
    } finally {
      setIsMakingHomepage(false);
    }
  };
  
  const handleDraftToggle = async () => {
    if (isPublishingInProgress || !page?.id) return;
    setIsPublishingInProgress(true);
    
    const newDraftState = !isDraft;
    
    try {
      const result = await updatePage(page.id, { draft: newDraftState });
      
      setIsDraft(newDraftState);
      toast.success(
        `${newDraftState ? "Unpublished" : "Published"} page`,
      );
      
      router.refresh();
    } catch (error) {
      console.error('Error updating draft status:', error);
      toast.error("Failed to update page status");
    } finally {
      setIsPublishingInProgress(false);
    }
  };
  
  // Actions for PageHeader
  const headerActions = [
    <DropdownMenu key="more-options">
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          disabled={
            inProgress || isPublishingInProgress || isMakingHomepage || isHome
          }
          onClick={handleMakeHomepage}
          className="md:hidden"
        >
          <Home />
          {isHome ? "Is Homepage" : "Make Homepage"}
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={
            inProgress || isPublishingInProgress || isDeleting || isHome
          }
          onClick={() => setDeleteDialogOpen(true)}
          destructive
        >
          <Trash />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>,
    <Button
      key="make-homepage"
      variant="outline"
      onClick={handleMakeHomepage}
      disabled={
        inProgress || isPublishingInProgress || isMakingHomepage || isHome
      }
      className="hidden items-center gap-2 md:inline-flex"
    >
      <Home />
      {isHome ? "Is Homepage" : "Make Homepage"}
    </Button>,
    <Button
      key="toggle-draft"
      variant="outline"
      onClick={handleDraftToggle}
      disabled={inProgress || isPublishingInProgress}
      loading={isPublishingInProgress}
      loadingText={isDraft ? "Publishing" : "Unpublishing"}
      tooltip={isDraft ? "Make page visible to public" : "Hide page from public"}
    >
      {isDraft ? (
        <>
          <ArrowUpCircle />
          Publish
        </>
      ) : (
        <>
          <EyeOff />
          Unpublish
        </>
      )}
    </Button>,
    <Button
      key="save"
      loading={inProgress}
      loadingText="Saving"
      onClick={() => handleSave(page)}
    >
      Save
    </Button>,
  ].filter(Boolean);

  return (
    <>
      {/* Only show PageHeader in normal mode or if in fullscreen mode */}
      <PageHeader 
        title={page?.title || "New Page"} 
        backLink={{
          href: `/site/${site.id}`,
          title: "Storefront"
        }}
        description={`Last updated ${lastUpdateDate}`}
        status={{
          title: isDraft ? "Draft" : "Live",
          variant: isDraft ? "secondary" : "success",
          tooltip: isDraft ? "This page is not publicly visible" : "This page is publicly visible"
        }}
        actions={[ ...headerActions ]}
        className={cn("mb-8", fullscreen && "fullscreen-header")}
      />
      <PageEditor
        site={site}
        page={{...page, draft: isDraft}}
        siteUrl={siteUrl}
        homepageId={homepageId}
        hasActiveFeatures={hasActiveFeatures}
        onSave={handleSave}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Page</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-stone-500">
              Are you sure you want to delete this page?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                onClick={handleDelete}
                loading={isDeleting}
                loadingText="Deleting"
              >
                Delete Page
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 