'use client'

import { useState } from 'react'
import { Transition } from '@headlessui/react'
import { ChevronDown } from 'lucide-react'

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
    <div
      className="group relative w-fit"
      onMouseEnter={() => setDropdownOpen(true)}
      onMouseLeave={() => setDropdownOpen(false)}
      onFocus={() => setDropdownOpen(true)}
      onBlur={() => setDropdownOpen(false)}
    >
      <button
        aria-expanded={dropdownOpen}
        onClick={(e) => e.preventDefault()}
        className="p-2 -m-2 text-marketing-secondary group-hover:text-marketing-primary duraton-200 flex items-center gap-1 whitespace-nowrap transition-all"
      >
        {title}
        <ChevronDown
          size={16}
          className="mt-0.5 opacity-70 group-hover:opacity-100"
          strokeWidth={3}
        />
      </button>
      <Transition
        show={dropdownOpen}
        as="ul"
        className="[&>*]:px-[18px] [&>*]:py-1  absolute -bottom-[84px] -left-[18px] z-50 flex w-[7rem] origin-top flex-col items-start rounded-lg bg-white py-2 shadow-md ring-1 ring-black/10"
        enter="transition ease-out duration-200 transform"
        enterFrom="opacity-0 -translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        {children}
      </Transition>
    </div>
  );
}
