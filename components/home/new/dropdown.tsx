'use client'

import { useState } from 'react'
import { Transition } from '@headlessui/react'

type DropdownProps = {
  children: React.ReactNode
  title: string
}

export default function Dropdown({
  children,
  title
}: DropdownProps) {

  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false)

  return (
    <li
      className="relative"
      onMouseEnter={() => setDropdownOpen(true)}
      onMouseLeave={() => setDropdownOpen(false)}
      onFocus={() => setDropdownOpen(true)}
      onBlur={() => setDropdownOpen(false)}
    >
      <a
        className=" px-4 py-2 flex items-center transition duration-150 ease-in-out"
        href="#0"
        aria-expanded={dropdownOpen}
        onClick={(e) => e.preventDefault()}
      >
        {title}
        <svg className="w-2 h-2 fill-current  cursor-pointer ml-2 shrink-0 mb-px" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.28 4.305L5.989 8.598 1.695 4.305A1 1 0 00.28 5.72l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z" />
        </svg>
      </a>
      <Transition
        show={dropdownOpen}
        as="ul"
        className="origin-top-right absolute top-full right-0 -mt-1 w-40 bg-white ring-1 ring-black/10 text-neutrla-900 font-medium text-gray-800 py-2 ml-4 rounded-md backdrop-blur shadow-md"
        enter="transition ease-out duration-200 transform"
        enterFrom="opacity-0 -translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        {children}
      </Transition>
    </li>
  )
}
