import React from 'react'
import clsx from 'clsx';
import { ChevronRight } from "lucide-react";

const links = [
  {
    href: "#",
    text: "Why we exist",
  },
  {
    href: "#",
    text: "Changelog",
  },
  {
    href: "#",
    text: "Discord",
  },
  {
    href: "#",
    text: "Twitter",
  },
];

const Item = ({ href, text, className }: { href: string, text: string, className?: string }) => (
  <li
    className={clsx("flex items-center justify-between border-t border-[#D8D8D7] last:border-b py-1.5", className)}
  >
    <a href={href}>{text}</a>
    <ChevronRight
      size={20}
      strokeWidth={2}
      className="-mr-0.5 opacity-80"
    />
  </li>
);

export default function NavLinks({ className }: { size?: 'sm' | 'lg', className?: string }) {
  return (
    <ul className={clsx("w-full text-[#8C8C88]", className)}>
      <Item {...{ href: "#", text: "Login", className: "hidden lg:flex" }} />
      {links.map((link) => (
        <Item key={link.text} {...link} />
      ))}
    </ul>
  );
}
