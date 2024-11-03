import Header from "@/components/design/Header";
import Aside from "@/components/design/Aside";
import Link from "next/link";

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

export default function HomePageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative overflow-hidden bg-marketing-background pt-[57px] font-sans text-[19px] font-bold leading-6 tracking-[-0.02em] text-marketing-secondary antialiased"
      style={{ textRendering: "optimizeLegibility" }}
    >
      <Header />
      {/* <main className="mx-auto flex w-full max-w-[800px] flex-col gap-24 overflow-visible px-6 pb-24 pt-[86px] lg:max-w-[1130px] lg:gap-y-32 lg:pt-40 xl:col-span-8 2xl:col-span-8 2xl:col-start-5"> */}
      <main className="mx-auto flex w-full max-w-[800px] flex-col gap-32 overflow-visible px-6 pb-32 pt-32 lg:max-w-[1300px] lg:gap-y-32 xl:col-span-8 2xl:col-span-8 2xl:col-start-5">
        {children}
      </main>
    </div>
  );
}
