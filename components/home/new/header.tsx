"use client";

import React, { useState } from "react";
import Link from "@/components/home/new/link";
import Logo from "@/components/home/new/logo";
import clsx from "clsx";
import { ChevronDown, Menu, X } from "lucide-react";

const loginURL = process.env.NODE_ENV === 'development'
  ? "http://app.gitwallet.local:3000/login"
  : "https://app.gitwallet.co/login";

const discordURL = "https://discord.gg/ZdSpS4BuGd";
const blogURL = "https://blog.gitwallet.co";

export default function Header({ className }: { className?: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <header
        className={clsx(
          "fixed left-0 right-0 top-0 z-50 w-full bg-[#F5F5F4] px-5 md:px-6 pt-4 md:pt-[18px] trackning-[0.02em]",
          className,
        )}
      >
        <div className="relative flex items-center justify-between pb-2.5">
          <Logo className="h-6 md:h-7 w-fit" />
          <div className="absolute left-1/2 top-[calc(50%-6px)] hidden -translate-x-1/2 -translate-y-1/2 gap-9  lg:flex">
            <Link href="#product" className="whitespace-nowrap">
              Product
            </Link>
            <Link href={blogURL} target="_blank" className="whitespace-nowrap">
              Changelog
            </Link>
            <Link href={discordURL} target="_blank" className="whitespace-nowrap">
              Discord
            </Link>
          </div>
          <div className="flex w-fit items-center gap-[22px] md:gap-6">
            <Link href={loginURL} className="-mt-0.5 text-marketing-primary">
              Log in
            </Link>
            <button onClick={toggleMenu} className="lg:hidden text-marketing-primary">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#F5F5F4] lg:hidden">
          <div className="flex h-full flex-col items-center justify-center gap-6 ">
            <Link href="#" className="text-2xl" onClick={toggleMenu}>
              Product
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
