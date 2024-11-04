"use client";

import React, { useState, createContext, useContext } from "react";
import Link from "@/components/home/new/link";
import Button from "@/components/home/new/button";
import { Transition } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type DropdownContextType = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const DropdownContext = createContext<DropdownContextType | undefined>(
  undefined,
);

type DropdownProps = {
  children: React.ReactNode;
  title: string;
  orientation?: "horizontal" | "vertical";
  className?: string;
};

export default function Dropdown({
  children,
  title,
  orientation = "vertical",
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
      <div
        className="group relative w-fit"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
      >
        <button
          aria-expanded={isOpen}
          onClick={(e) => e.preventDefault()}
          className="text-marketing-secondary group-hover:text-marketing-primary duraton-[175ms] group -mx-6 -my-5 flex items-center gap-1 whitespace-nowrap px-6 py-5 transition-all"
        >
          {title}
          <ChevronDown
            size={16}
            className="-mr-[11px] mt-0.5 opacity-60 group-hover:opacity-100"
            strokeWidth={3}
          />
        </button>
        <Transition
          show={isOpen}
          as="ul"
          className={cn(
            "absolute -bottom-[84px] -left-[18px] z-50 flex w-fit min-w-[7rem] origin-top items-start rounded-lg bg-white py-2 text-marketing-sm shadow-md ring-1 ring-black/10",
            orientation === "horizontal" ? "flex-row" : "flex-col",
            className,
          )}
          enter="transition ease-out duration-200 transform"
          enterFrom="opacity-0 -translate-y-2"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-out duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {children}
        </Transition>
      </div>
    </DropdownContext.Provider>
  );
}

type DropdownItemProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
};

Dropdown.Item = function DropdownItem({
  children,
  href,
  onClick,
}: DropdownItemProps) {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error("Dropdown.Item must be used within a Dropdown");
  }

  if (href && onClick) {
    throw new Error("Dropdown.Item should only have one of href or onClick");
  }

  const { setIsOpen } = context;

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    setIsOpen(false);
  };

  const className = "px-[18px] py-1 whitespace-nowrap w-full inline-block";

  return (
    <li className="w-full">
      {href ? (
        <Link href={href} className={className}>
          {children}
        </Link>
      ) : onClick ? (
        <Button
          size="sm"
          variant="link"
          onClick={handleClick}
          className={className}
        >
          {children}
        </Button>
      ) : (
        children
      )}
    </li>
  );
};
