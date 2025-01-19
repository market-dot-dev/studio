import Link from "next/link";
import Dropdown from "./dropdown";
import MobileMenu from "../mobile-menu";
import Image from "next/image";
import { getRootUrl } from "@/lib/domain";

export default function Header() {
  return (
    <header className="absolute z-30 w-full">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex h-20 items-center justify-between">
          {/* Site branding */}
          <div className="mr-4 shrink-0">
            {/* Logo */}
            <Link href="/" className="block">
              <Image
                alt="Gitwallet"
                width={50}
                height={50}
                className="relative mx-auto h-10 w-auto"
                src="/gw-logo-white.png"
              />
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:flex">
            {/* Desktop menu links */}
            <ul className="flex grow flex-wrap items-center justify-center gap-4 rounded-full bg-white/25 px-2 text-white ring-1 ring-white/40 filter backdrop-blur-md md:sticky md:top-2">
              <li>
                <Link
                  href="#features"
                  className="flex items-center px-4 py-2 transition duration-150 ease-in-out"
                >
                  Product
                </Link>
              </li>
              <li>
                <Link
                  href={"https://blog.market.dev"}
                  className="flex items-center px-4 py-2 transition duration-150 ease-in-out"
                >
                  Changelog
                </Link>
              </li>
              {/* 1st level: hover */}
              <Dropdown title="Support">
                {/* 2nd level: hover */}
                <li>
                  <Link
                    href="https://discord.gg/ZdSpS4BuGd"
                    className="flex px-4 py-2 text-sm font-medium leading-tight"
                    target="_blank"
                  >
                    Join the Discord
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://x.com/gitwallet"
                    className="flex px-4 py-2 text-sm font-medium leading-tight"
                    target="_blank"
                  >
                    Find us on Twitter
                  </Link>
                </li>
              </Dropdown>
            </ul>

            {/* Desktop sign in links */}
          </nav>
          <div className="hidden md:flex">
            <ul className="flex grow flex-wrap items-center justify-end">
              <li className="group">
                <Link href={getRootUrl("app", "/login")}>
                  <button className="rounded-full bg-white/25 px-4 py-2 ring-1 ring-white/40 transition group-hover:bg-white group-hover:text-gray-800">
                    Login →
                  </button>
                </Link>
              </li>
            </ul>
          </div>

          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
