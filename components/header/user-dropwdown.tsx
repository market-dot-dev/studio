"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { Transition } from "@headlessui/react";
import { getRootUrl, domainCopy } from "@/lib/domain";

export default function UserDropwdown({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div
      className="relative h-7 w-7"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={() => setIsOpen(false)}
    >
      <Suspense
        fallback={
          <span className="border-box h-7 w-7 rounded-full ring-1 ring-inset ring-white/10"></span>
        }
      >
        <button
          className="hover:opacity-95"
          aria-expanded={isOpen}
          onClick={(e) => e.preventDefault()}
        >
          <Image
            src={user.image ?? `https://avatar.vercel.sh/${user.id}`}
            width={32}
            height={32}
            alt={user.name ?? "User avatar"}
            className="h-7 w-7 rounded-full ring-1 ring-inset ring-white/10"
          />
        </button>
        <Transition
          show={isOpen}
          as="div"
          className="shadow-border-lg absolute right-0 top-full ml-4 w-[250px] origin-top-right rounded-md bg-white text-sm font-medium"
          enter="transition ease-out duration-200 transform"
          enterFrom="opacity-0 -translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-out duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="flex items-center gap-2.5 border-b border-stone-200 p-4">
            <Image
              src={user.image ?? `https://avatar.vercel.sh/${user.id}`}
              width={32}
              height={32}
              alt={user.name ?? "User avatar"}
              className="h-7 w-7 rounded-full"
            />
            <h3 className="font-bold tracking-tight">{user.name}</h3>
          </div>
          <ul className="px-2 py-2.5 text-stone-500">
            <li>
              <Link
                href={getRootUrl()}
                target="_blank"
                className="hover:shadow-border focus-visible:shadow-border block w-full rounded-md px-2 py-1.5 transition-all hover:text-stone-900 focus-visible:text-stone-900"
              >
                Explore {domainCopy()}
              </Link>
            </li>
            <li>
              <button
                onClick={() =>
                  signOut({
                    callbackUrl:
                      user.roleId === "maintainer"
                        ? "/login"
                        : "/customer-login",
                  })
                }
                className="hover:shadow-border focus-visible:shadow-border block w-full rounded-md px-2 py-1.5 text-left transition-all hover:text-red-800 focus-visible:text-red-800"
              >
                Logout
              </button>
            </li>
          </ul>
        </Transition>
      </Suspense>
    </div>
  );
}
