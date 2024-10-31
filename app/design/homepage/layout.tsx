import Image from "next/image";
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
]

export default function HomePageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="bg-[#F5F5F4] font-sans text-[19px] font-bold leading-6 tracking-[-0.01em] text-[#222214] antialiased"
      style={{ textRendering: "optimizeLegibility" }}
    >
      <div className="relative mx-auto grid max-w-[700px] grid-cols-12 lg:max-w-[1600px]">
        <aside className="left-0 top-0 z-10 col-span-full flex flex-col items-start p-6 lg:sticky lg:col-span-4 lg:h-screen lg:p-12 lg:pr-0 xl:p-16">
          <Image
            src="/logotype.svg"
            alt="gitwallet logo"
            height={32}
            width={164}
            className="mb-12 h-7 w-auto xl:mb-16 xl:h-8"
          />
          <h1 className="mb-5 whitespace-nowrap text-[clamp(40px,7vw,48px)] font-bold leading-[clamp(40px,7vw,48px)] tracking-[-0.035em] lg:text-[clamp(40px,3.5vw,48px)] lg:leading-[clamp(40px,3.5vw,48px)]">
            Business Toolkit
            <br />
            for Open Source
          </h1>
          <p className="mb-7 max-w-[55ch] text-[#8C8C88]">
            One place to sell services, find customers & market everywhere —
            purpose-built for open source.
          </p>
          <button className="mb-8 flex w-full items-center justify-center gap-3 whitespace-nowrap rounded-lg bg-[#BBC4A2] px-12 py-3 font-bold xl:px-16 xl:py-4">
            <Image
              src="/github.svg"
              alt="github logo"
              height={24}
              width={24}
              className="h-5 w-auto xl:h-6"
            />
            Sign up with Github
          </button>
          <ul className="w-full">
            {links.map((link) => (
              <li
                key={link.text}
                className="flex items-center justify-between border-t border-[#D8D8D7] py-1.5 text-[#8C8C88] last:border-b"
              >
                <a href={link.href}>{link.text}</a>
                <ChevronRight
                  size={20}
                  strokeWidth={2}
                  className="text-[#b8b8b3] -mr-0.5"
                />
              </li>
            ))}
          </ul>
        </aside>
        <main className="col-span-full flex w-full flex-col gap-y-16 overflow-visible p-6 lg:col-span-8 lg:p-12 lg:pl-24 xl:p-16">
          {children}
        </main>
      </div>
    </div>
  );
}
