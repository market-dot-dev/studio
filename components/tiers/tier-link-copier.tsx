import Tier from "@/app/models/Tier";
import { Button } from "@/components/ui/button";
import { getRootUrl } from "@/lib/domain";
import { formatUrlForDisplay } from "@/lib/utils";
import { Check, LinkIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface TierLinkCopierProps {
  tier: Tier;
  savedPublishedState: boolean;
  className?: string;
}

/**
 * Component for displaying and copying a tier's checkout link
 */
const TierLinkCopier: React.FC<TierLinkCopierProps> = ({
  tier,
  savedPublishedState,
  className
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [shouldCopy, setShouldCopy] = useState(false);
  const link = getRootUrl("app", `/checkout/${tier.id}`);

  useEffect(() => {
    if (!shouldCopy) return;

    const copyToClipboard = async () => {
      try {
        // Check if the Clipboard API is available
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(link);
        } else {
          // Fallback for browsers without clipboard API
          const textarea = document.createElement("textarea");
          textarea.value = link;
          textarea.style.position = "fixed"; // Prevent scrolling to bottom
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();

          // Try the execCommand as fallback (works in more browsers)
          const successful = document.execCommand("copy");
          if (!successful) {
            throw new Error("Fallback clipboard copy failed");
          }

          document.body.removeChild(textarea);
        }

        setIsCopied(true);

        const timer = setTimeout(() => {
          setIsCopied(false);
          setShouldCopy(false);
        }, 2000);

        return () => clearTimeout(timer);
      } catch (err) {
        console.error("Failed to copy text: ", err);
        toast.error("Failed to copy the link. Please try again.");
        setShouldCopy(false);
      }
    };

    copyToClipboard();
  }, [shouldCopy, link]);

  const handleCopy = () => {
    setShouldCopy(true);
  };

  if (!link || !savedPublishedState) {
    return null;
  }

  return (
    <Button variant="outline" onClick={handleCopy} tooltip={formatUrlForDisplay(link, 30)}>
      <AnimatePresence mode="wait" initial={false}>
        {isCopied ? (
          <motion.div
            key="check"
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
            transition={{ duration: 0.1, type: "easeInOut" }}
          >
            <Check />
          </motion.div>
        ) : (
          <motion.div
            key="link"
            initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: -10 }}
            transition={{ duration: 0.1, type: "easeInOut" }}
          >
            <LinkIcon />
          </motion.div>
        )}
      </AnimatePresence>
      Copy checkout link
    </Button>
  );
};

export default TierLinkCopier;
