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
      className="relative overflow-hidden bg-[#F5F5F4] font-sans text-[19px] font-bold leading-6 tracking-[-0.01em] text-[#222214] antialiased"
      style={{ textRendering: "optimizeLegibility" }}
    >
      <div className=" md:gap-x-12">
        <Header className="col-span-full " />
        {/* <Aside className="col-span-4 hidden xl:flex" /> */}
        {/* <Link href="#" className="fixed top-12 right-12">Login</Link> */}
        <main className="col-span-full flex w-full flex-col overflow-visible xl:col-span-8 2xl:col-span-8 2xl:col-start-5">
          {children}
        </main>
      </div>
    </div>
  );
}
