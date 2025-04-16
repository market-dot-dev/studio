"use client";

import { loginURL } from "@/lib/home/social-urls";
import { StoreIcon } from "lucide-react";
import React, { useState } from "react";
import Button from "./button";
import Link from "./link";

export default function ClaimStoreForm({
  id,
  initialValue = ""
}: {
  id: string;
  initialValue?: string;
}) {
  const placeholder = "yourstorename";
  const [storeInput, setStoreInput] = useState(initialValue);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStoreInput(e.target.value);
  };

  return (
    <div className="xs:w-[320px] flex w-[272px] flex-col items-center rounded-lg bg-black/[4%] ring-1 ring-black/[15%] sm:w-[420px] sm:flex-row md:w-[500px]">
      <div className="relative flex w-full items-center justify-between pl-3.5 pr-4 md:pl-[18px] md:pr-5">
        <div className="flex items-center gap-3 md:gap-3.5">
          <StoreIcon className="text-marketing-green size-5 md:size-7" />
          <input
            id={`${id}-store-name`}
            type="text"
            value={storeInput}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="text-marketing-sm text-marketing-secondary placeholder:text-marketing-secondary/[66%] md:text-marketing-base size-full appearance-none overflow-hidden text-clip border-none bg-transparent !px-0 py-3 focus:outline-none focus:ring-0"
          />
        </div>
        <span className="text-marketing-sm text-marketing-secondary md:text-marketing-base whitespace-nowrap">
          .market.dev
        </span>
      </div>
      <Link href={loginURL} className="flex w-full sm:w-fit">
        <Button fullWidth={true} className="!gap-2">
          Setup For Free
        </Button>
      </Link>
    </div>
  );
}
