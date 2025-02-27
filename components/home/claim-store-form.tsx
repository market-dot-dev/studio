"use client";

import React, { useState } from 'react';
import Link from './link';
import Button from './button';
import { loginURL } from '@/lib/home/social-urls';
import { ChevronRight, StoreIcon } from 'lucide-react';

export default function ClaimStoreForm({ 
  id, 
  initialValue = '' 
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
    <div className="flex w-[272px] flex-col items-center rounded-lg bg-black/[4%] ring-1 ring-black/[15%] xs:w-[320px] sm:w-[420px] sm:flex-row md:w-[550px]">
      <div className="relative flex w-full items-center justify-between px-4 md:px-5">
        <div className="flex items-center gap-3 md:gap-4">
          <StoreIcon className="h-5 w-5 text-marketing-green md:h-7 md:w-7" />
          <input
            id={`${id}-store-name`}
            type="text"
            value={storeInput}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="h-full w-full appearance-none overflow-hidden text-clip border-none bg-transparent !px-0 py-3 text-marketing-sm text-marketing-secondary placeholder:opacity-[55%] focus:outline-none focus:ring-0 md:text-marketing-base"
          />
        </div>
        <span className="whitespace-nowrap text-marketing-sm text-marketing-secondary md:text-marketing-base">
          .market.dev
        </span>
      </div>
      <Link href={loginURL} className="flex w-full sm:w-fit">
        <Button fullWidth={true} className='!gap-2'>
          Start your store
        </Button>
      </Link>
    </div>
  );
} 