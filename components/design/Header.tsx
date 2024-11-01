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
          "fixed left-0 right-0 top-0 z-50 w-full bg-[#F5F5F4] px-6 pt-[18px]",
          className,
        )}
      >
        <div className="border- flex items-center justify-between border-[#d2d2cf] pb-2.5">
          <Logo className="h-6 md:h-7" />
          <div className="flex gap-6 lg:gap-12 text-[#8C8C88]">
            <Link href="#" className="">
              Product
            </Link>
            <Link href="#" className="">
              Pricing
            </Link>
            <Link href="#" className="">
              Changelog
            </Link>
          </div>
          <div className="mb-0.5 flex w-fit gap-6">
            <Link href="#" className="">
              Log in
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
