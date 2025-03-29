"use client";

import { useState, useCallback, useEffect } from "react";
import { Page, Site } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/page-header";
import PageEditor from "@/components/site/page-editor";
import { setHomepage, deletePage, updatePage, createPage } from "@/app/services/PageService";
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
  
  // Shared state that will be passed to the PageEditor
  const [pageData, setPageData] = useState<Partial<Page>>(page);
  const [slugVirgin, setSlugVirgin] = useState<boolean>(!page.slug);
  
  // UI state
  const [inProgress, setInProgress] = useState<boolean>(false);
  const [isMakingHomepage, setIsMakingHomepage] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isDraft, setIsDraft] = useState<boolean>(!!page.draft);
  const [isPublishingInProgress, setIsPublishingInProgress] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  
  // Form validation state
  const [titleError, setTitleError] = useState<string | null>(null);
  const [slugError, setSlugError] = useState<string | null>(null);
  
  // Update pageData when props change
  useEffect(() => {
    setPageData(page);
  }, [page]);
  
  // Automatically generate slug from title if slug is virgin
  useEffect(() => {
    if (!slugVirgin) return;

    const slug = pageData.title 
      ? pageData.title
          .toLowerCase()
          .replace(/ /g, "-")
          .replace(/[^a-z0-9-]/g, "") 
      : "";
    
    setPageData(prevData => ({ ...prevData, slug }));
    setSlugError(null);
  }, [pageData.title, slugVirgin]);
  
  // State update handlers
  const handleTitleChange = useCallback((title: string) => {
    setTitleError(null);
    setPageData(prevData => ({ ...prevData, title }));
  }, []);
  
  const handleSlugChange = useCallback((slug: string) => {
    setSlugError(null);
    setSlugVirgin(false);
    setPageData(prevData => ({ ...prevData, slug }));
  }, []);
  
  const handleContentChange = useCallback((content: string) => {
    setPageData(prevData => ({ ...prevData, content }));
  }, []);
  
  // Validation function
  const validate = useCallback(() => {
    let isValid = true;

    // Validate title
    if (!pageData.title || pageData.title.trim() === "") {
      setTitleError("Title is required.");
      isValid = false;
    } else {
      setTitleError(null);
    }

    // Validate slug
    if (!pageData.slug || pageData.slug.trim() === "") {
      setSlugError("Slug is required.");
      isValid = false;
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(pageData.slug)) {
      setSlugError(
        "Slug is not valid. Only lowercase alphanumeric characters and hyphens are allowed.",
      );
      isValid = false;
    } else {
      setSlugError(null);
    }

    return isValid;
  }, [pageData.title, pageData.slug]);
  
  const handleSave = async () => {
    if (inProgress || isPublishingInProgress || !pageData?.id) {
      console.log('Save aborted:', { 
        inProgress, 
        isPublishingInProgress, 
        'pageData?.id': pageData?.id 
      });
      return;
    }
    
    // Validate input data
    if (!validate()) {
      return;
    }
    
    setInProgress(true);
    
    try {
      console.log('Save initiated with page data:', { 
        id: pageData.id, 
        title: pageData.title, 
        slug: pageData.slug,
        contentLength: pageData.content?.length || 0,
        isDraft
      });
      
      const { title, slug, content } = pageData;
      
      console.log('Calling updatePage with:', { 
        id: pageData.id, 
        title, 
        slug, 
        contentLength: content?.length || 0,
        draft: isDraft 
      });
      
      const result = await updatePage(pageData.id, { 
        title, 
        slug, 
        content,
        draft: isDraft
      });
      
      console.log('Update page result:', result);
      
      // Check if result contains an error
      if (result && 'error' in result) {
        toast.error(`Failed to save the page: ${result.error}`);
        console.error('Error saving page:', result.error);
        return;
      }
      
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
    if (inProgress || isPublishingInProgress || !pageData?.id) return;
    setIsDeleting(true);
    
    try {
      const result = await deletePage(pageData.id) as any;
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
    if (inProgress || isPublishingInProgress || !pageData?.siteId || !pageData?.id) return;
    setIsMakingHomepage(true);
    
    try {
      const result = await setHomepage(pageData.siteId, pageData.id) as any;
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("This is your new homepage");
        router.refresh()
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while promoting the page");
    } finally {
      setIsMakingHomepage(false);
    }
  };
  
  const handleDraftToggle = async () => {
    if (isPublishingInProgress || !pageData?.id) return;
    setIsPublishingInProgress(true);
    
    const newDraftState = !isDraft;
    
    try {
      await updatePage(pageData.id, { draft: newDraftState });
      
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
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleSaveShortcut = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };

    document.addEventListener("keydown", handleSaveShortcut);

    return () => {
      document.removeEventListener("keydown", handleSaveShortcut);
    };
  }, [pageData]);
  
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
      className="md:mr-2"
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
      onClick={handleSave}
    >
      Save
    </Button>,
  ].filter(Boolean);

  const linkWithSlug = (siteUrl || '') + (isHome ? '' : pageData.slug || '');

  return (
    <>
      {/* Only show PageHeader in normal mode or if in fullscreen mode */}
      {!fullscreen && (
        <PageHeader 
          title={pageData?.title || "New Page"} 
          backLink={{
            href: `/site/${site.id}`,
            title: "Landing Page"
          }}
          description={`Last updated ${lastUpdateDate}`}
          status={{
            title: isDraft ? "Draft" : "Live",
            variant: isDraft ? "secondary" : "success",
            tooltip: isDraft ? "This page is not publicly visible" : "This page is publicly visible"
          }}
          actions={[ ...headerActions ]}
          className="mb-8"
        />
      )}
      <PageEditor
        site={site}
        page={pageData}
        siteUrl={siteUrl}
        homepageId={homepageId}
        hasActiveFeatures={hasActiveFeatures}
        isDraft={isDraft}
        titleError={titleError}
        slugError={slugError}
        slugVirgin={slugVirgin}
        onTitleChange={handleTitleChange}
        onSlugChange={handleSlugChange}
        onContentChange={handleContentChange}
        onSave={handleSave}
        inProgress={inProgress}
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