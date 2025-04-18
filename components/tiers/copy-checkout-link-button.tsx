"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Link as LinkIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function CopyCheckoutLinkButton({ tierId }: { tierId: string }) {
  const [isCopied, setIsCopied] = useState(false);
  const [shouldCopy, setShouldCopy] = useState(false);

  useEffect(() => {
    if (!shouldCopy) return;

    const copyText = async () => {
      try {
        const baseUrl = window.location.origin;
        const checkoutUrl = `${baseUrl}/checkout/${tierId}`;

        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(checkoutUrl);
        } else {
          // Fallback for browsers without clipboard API
          const textarea = document.createElement("textarea");
          textarea.value = checkoutUrl;
          textarea.style.position = "fixed"; // Prevent scrolling to bottom
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          const successful = document.execCommand("copy");
          if (!successful) {
            throw new Error("Fallback clipboard copy failed");
          }
          document.body.removeChild(textarea);
        }

        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
          setShouldCopy(false);
        }, 2000);
      } catch (err) {
        console.error("Failed to copy text:", err);
        setShouldCopy(false);
      }
    };

    copyText();
  }, [shouldCopy, tierId]);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setShouldCopy(true)}
      tooltip={isCopied ? "Copied checkout link!" : "Copy checkout link"}
      className="flex size-6 items-center justify-center gap-1.5 rounded text-sm font-medium transition-colors duration-200 ease-in-out hover:bg-stone-200 active:bg-stone-300"
      disabled={isCopied}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isCopied ? (
          <motion.div
            key="check"
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
            transition={{ duration: 0.1, type: "easeInOut" }}
          >
            <Check className="size-3.5" strokeWidth={2.25} />
          </motion.div>
        ) : (
          <motion.div
            key="link"
            initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: -10 }}
            transition={{ duration: 0.1, type: "easeInOut" }}
          >
            <LinkIcon className="size-3.5" strokeWidth={2.25} />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}
