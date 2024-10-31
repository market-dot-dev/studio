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
      <div className="relative mx-auto grid max-w-[800px] grid-cols-12 lg:max-w-none">
        <aside className="left-0 top-0 z-10 col-span-full flex flex-col items-start p-6 md:pt-9 lg:sticky lg:col-span-4 lg:h-screen lg:p-12 lg:pr-0 xl:p-16 2xl:fixed 2xl:max-w-[500px]">
          <Image
            src="/logotype.svg"
            alt="gitwallet logo"
            height={32}
            width={164}
            className="mb-12 h-7 w-auto xl:mb-14 xl:h-8"
          />
          <h1 className="mb-5 whitespace-nowrap text-[clamp(40px,7vw,48px)] font-bold leading-[1] tracking-[-0.035em] lg:text-[clamp(40px,4vw,48px)] xl:text-[clamp(40px,3.25vw,48px)]">
            Business Toolkit
            <br />
            for Open Source
          </h1>
          <p className="mb-7 max-w-[50ch] text-[#8C8C88]">
            One place to sell services, find customers & market everywhere —
            purpose-built for open source.
          </p>
          <button className="flex w-full items-center justify-center gap-3 whitespace-nowrap rounded-lg bg-[#BBC4A2] px-12 py-3 text-[18px] font-bold">
            <Image
              src="/github.svg"
              alt="github logo"
              height={24}
              width={24}
              className="h-[22px] w-auto"
            />
            Sign up with Github
          </button>
          <ul className="mt-8 w-full lg:mt-12">
            {links.map((link) => (
              <li
                key={link.text}
                className="flex items-center justify-between border-t border-[#D8D8D7] py-1.5 text-[#8C8C88] last:border-b"
              >
                <a href={link.href}>{link.text}</a>
                <ChevronRight
                  size={20}
                  strokeWidth={2}
                  className="-mr-0.5 text-[#b8b8b3]"
                />
              </li>
            ))}
          </ul>
        </aside>
        <main className="2xl:col-span-8 2xl:col-start-5 col-span-full flex w-full max-w-[1000px] flex-col gap-y-16 overflow-visible p-6 lg:col-span-8 lg:p-12 lg:pl-[72px] xl:p-16 2xl:px-0">
          {children}
        </main>
      </div>
    </div>
  );
}
