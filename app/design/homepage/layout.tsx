import Header from "@/components/design/Header";
import Aside from "@/components/design/Aside";

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
      className="bg-[#F5F5F4] font-sans text-[19px] font-bold leading-6 tracking-[-0.01em] text-[#222214] antialiased overflow-hidden"
      style={{ textRendering: "optimizeLegibility" }}
    >
      <div className="relative mx-auto grid grid-cols-12 gap-x-12 ">
        <Header className="col-span-full xl:hidden" />
        <Aside className="hidden xl:flex col-span-4 " />
        <main className="col-span-full flex w-full flex-col overflow-visible xl:col-span-8 2xl:col-span-8 2xl:col-start-5">
          {children}
        </main>
      </div>
    </div>
  );
}
