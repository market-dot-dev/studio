"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "./Logo";
import clsx from "clsx";

export default function Header({ className }: { className?: string }) {
  return (
    <>
      <header
        className={clsx(
          "sticky top-0 z-50 w-full bg-[#F5F5F4] px-6 pt-[18px]",
          className,
        )}
      >
        <div className="flex items-center justify-between border-b border-[#D8D8D7] pb-2.5">
          <Logo className="h-6 md:h-7" />
          <div className="flex gap-6 w-fit mb-0.5">
            <Link href="#" className="tracking-tight ">
              Log in
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
