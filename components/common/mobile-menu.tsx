"use client";

import { Button } from "@tremor/react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { getRootUrl } from "@/lib/domain";

export default function MobileMenu() {
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);

  const trigger = useRef<HTMLButtonElement>(null);
  const mobileNav = useRef<HTMLDivElement>(null);

  // close the mobile menu on click outside
  useEffect(() => {
    const clickHandler = ({ target }: { target: EventTarget | null }): void => {
      if (!mobileNav.current || !trigger.current) return;
      if (
        !mobileNavOpen ||
        mobileNav.current.contains(target as Node) ||
        trigger.current.contains(target as Node)
      )
        return;
      setMobileNavOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close the mobile menu if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: { keyCode: number }): void => {
      if (!mobileNavOpen || keyCode !== 27) return;
      setMobileNavOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <div className="md:hidden">
      {/* Hamburger button */}
      <button
        ref={trigger}
        className={`hamburger ${mobileNavOpen && "active"}`}
        aria-controls="mobile-nav"
        aria-expanded={mobileNavOpen}
        onClick={() => setMobileNavOpen(!mobileNavOpen)}
      >
        <span className="sr-only">Menu</span>
        <svg
          className="h-6 w-6 fill-current text-gray-300 transition duration-150 ease-in-out hover:text-gray-200"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect y="4" width="24" height="2" rx="1" />
          <rect y="11" width="24" height="2" rx="1" />
          <rect y="18" width="24" height="2" rx="1" />
        </svg>
      </button>

      {/*Mobile navigation */}
      <nav
        id="mobile-nav"
        ref={mobileNav}
        className="absolute left-0 top-full z-20 w-full overflow-hidden px-4 transition-all duration-300 ease-in-out sm:px-6"
        style={
          mobileNavOpen
            ? { maxHeight: mobileNav.current?.scrollHeight, opacity: 1 }
            : { maxHeight: 0, opacity: 0.8 }
        }
      >
        <ul className="bg-gray-800 px-4 py-2">
          <li>
            <Link
              href="#features"
              className="flex items-center px-4 py-2 text-gray-300 transition duration-150 ease-in-out hover:text-gray-50"
            >
              Product
            </Link>
          </li>
          <li>
            <Link
              href="https://discord.gg/Wnkhzbb7vD"
              className="flex items-center px-4 py-2 text-gray-300 transition duration-150 ease-in-out hover:text-gray-50"
            >
              Changelog
            </Link>
          </li>
          <li className="my-2 border-b border-t border-gray-700 py-2">
            <span className="flex py-2 text-gray-300">Support</span>
            <ul className="pl-4">
              <li>
                <Link
                  href="https://discord.gg/ZdSpS4BuGd"
                  className="flex px-4 py-2 text-sm font-medium leading-tight text-gray-300 hover:text-gray-50"
                  target="_blank"
                >
                  Join the Discord
                </Link>
              </li>
              <li>
                <Link
                  href="https://x.com/gitwallet"
                  className="flex px-4 py-2 text-sm font-medium leading-tight text-gray-300 hover:text-gray-50"
                  target="_blank"
                >
                  Find us on Twitter
                </Link>
              </li>
            </ul>
          </li>
          <ul className="flex grow flex-wrap items-center justify-end">
            <li>
              <Link href={getRootUrl("app", "/login")}>
                <Button
                  color="green"
                  variant="primary"
                  size="xs"
                  className="w-full"
                >
                  Login →
                </Button>
              </Link>
            </li>
          </ul>
        </ul>
      </nav>
    </div>
  );
}
