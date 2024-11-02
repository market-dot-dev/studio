"use client";

import React, { useState } from "react";
import { Globe, ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Logo from "./Logo";
import clsx from "clsx";

export default function Header({ className }: { className?: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <header
        className={clsx(
          "fixed left-0 right-0 top-0 z-50 w-full bg-[#F5F5F4] px-6 pt-[18px] trackning-[0.02em]",
          className,
        )}
      >
        <div className="relative flex items-center justify-between pb-2.5">
          <Logo className="h-6 md:h-7" />
          <div className="absolute left-1/2 top-[calc(50%-6px)] hidden -translate-x-1/2 -translate-y-1/2 gap-9 text-[#8C8C88] lg:flex">
            <Link href="#" className="whitespace-nowrap">
              Product
            </Link>
            <Link href="#" className="whitespace-nowrap">
              Why we exist
            </Link>
            <Link href="#" className="whitespace-nowrap">
              Changelog
            </Link>
            <button className="flex items-center gap-1 whitespace-nowrap">
              Follow
              <ChevronDown
                size={16}
                className="mt-0.5 opacity-70"
                strokeWidth={3}
              />
            </button>

            {/* <div className="w-48 rounded-md bg-white p-4 shadow-lg">
              <div className="flex flex-col gap-2">
                <Link href="#" className="flex items-center gap-2">
                  Discord
                </Link>
                <Link href="#" className="flex items-center gap-2">
                  Twitter
                </Link>
              </div>
            </div> */}
          </div>
          <div className="flex w-fit items-center gap-6">
            <Link href="#" className="-mt-0.5">
              Log in
            </Link>
            <button onClick={toggleMenu} className="lg:hidden">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#F5F5F4] lg:hidden">
          <div className="flex h-full flex-col items-center justify-center gap-6 text-[#8C8C88]">
            <Link href="#" className="text-2xl" onClick={toggleMenu}>
              Product
            </Link>
            <Link href="#" className="text-2xl" onClick={toggleMenu}>
              Why we exist
            </Link>
            <Link href="#" className="text-2xl" onClick={toggleMenu}>
              Changelog
            </Link>
            <Link href="#" className="flex items-center gap-2">
              Discord
            </Link>
            <Link href="#" className="flex items-center gap-2">
              Twitter
            </Link>
            <Link href="#" className="text-2xl" onClick={toggleMenu}>
              Log in
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
