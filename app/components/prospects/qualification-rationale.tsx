"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { CircleCheck, CircleSlash, Globe, Clock } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ShimmerText } from "@/components/ui/shimmer-text";

interface QualificationRationaleProps {
  isQualified: boolean;
  isDisqualified: boolean;
  isFetchingExternalData?: boolean;
  qualificationReason?: string;
  timeEstimate?: string;
  handleEnrichment?: () => void;
  hasNoLinks?: boolean;
}

const LinkedInIcon = () => (
  <svg
    className="h-[16px] w-[16px]"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const XIcon = () => (
  <svg
    className="h-[16px] w-[16px]"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const icons = [
  { component: LinkedInIcon, id: "linkedin" },
  { component: XIcon, id: "x" },
  { component: () => <Globe size={16} />, id: "globe" },
  { component: LinkedInIcon, id: "linkedin2" },
  { component: XIcon, id: "x2" },
  { component: () => <Globe size={16} />, id: "globe2" },
  { component: LinkedInIcon, id: "linkedin3" },
  { component: XIcon, id: "x3" },
];

// Animated ellipsis component
const AnimatedEllipsis = () => {
  const dotVariants: Variants = {
    initial: { opacity: 0.5 },
    animate: { 
      opacity: 1,
      transition: {
        repeat: Infinity,
        repeatType: "reverse",
        duration: 0.4,
      }
    },
  };

  const containerVariants: Variants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <motion.span
      className="inline-flex [&>*]:-ml-px [&>*:first-child]:ml-0"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <motion.span variants={dotVariants}>.</motion.span>
      <motion.span variants={dotVariants}>.</motion.span>
      <motion.span variants={dotVariants}>.</motion.span>
    </motion.span>
  );
};

export function QualificationRationale({
  isQualified,
  isDisqualified,
  isFetchingExternalData = false,
  qualificationReason,
  timeEstimate = "2 min",
}: QualificationRationaleProps) {
  const [currentIconIndex, setCurrentIconIndex] = useState(0);

  useEffect(() => {
    if (!isFetchingExternalData) return;

    const interval = setInterval(() => {
      setCurrentIconIndex((prev) => (prev + 1) % icons.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isFetchingExternalData]);

  // Animation variants
  const iconVariants = {
    initial: {
      opacity: 0,
      x: -20,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 2,
        type: "spring",
        stiffness: 140,
        damping: 15,
      },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 140,
        damping: 15,
      },
    },
  };

  return (
    <div
      className={cn(
        "rounded px-4 pb-3.5 pt-3",
        isFetchingExternalData
          ? "border border-black/8 bg-stone-150"
          : "bg-white shadow-border-sm",
      )}
    >
      <div
        className={cn(
          "mb-1.5 flex gap-3",
          isFetchingExternalData ? "text-stone-600" : "text-white",
        )}
      >
        {isFetchingExternalData ? (
          <div className="relative my-0.5 h-[16px] w-[16px]">
            <AnimatePresence>
              {icons.map((icon, index) => {
                const IconComponent = icon.component;
                if (index === currentIconIndex) {
                  return (
                    <motion.div
                      key={icon.id}
                      className="absolute inset-0"
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      variants={iconVariants}
                    >
                      <IconComponent />
                    </motion.div>
                  );
                }
                return null;
              })}
            </AnimatePresence>
          </div>
        ) : isQualified ? (
          <CircleCheck size={20} className="-mx-0.5 fill-swamp" />
        ) : (
          <CircleSlash size={20} className="-mx-0.5 fill-stone-500" />
        )}
        <div className="z-10 w-full text-sm/5 font-semibold tracking-tightish text-stone-800">
          {isFetchingExternalData && (
            <div className="flex w-full flex-wrap justify-between gap-x-4 gap-y-1">
              <ShimmerText text="Seeing if they're a fit..." className="" />
              {timeEstimate && (
                <div className="-my-0.5 flex items-center gap-1.5 text-xs font-semibold text-stone-500">
                  <Clock size={14} />
                  <span>Done in ~{timeEstimate}</span>
                </div>
              )}
            </div>
          )}
          {!isFetchingExternalData && isQualified && "Looks like a fit!"}
          {!isFetchingExternalData &&
            isDisqualified &&
            "Doesn't look like a fit"}
        </div>
      </div>
      {isFetchingExternalData ? (
        <p className="max-w-screen-md text-sm text-stone-600">
          We're analyzing this prospect's data from various sources to determine
          if they're a good fit for your business. This includes their company
          size, role, and engagement level.
        </p>
      ) : (
        qualificationReason && (
          <p className="mt-2 text-sm text-stone-600">{qualificationReason}</p>
        )
      )}
    </div>
  );
} 