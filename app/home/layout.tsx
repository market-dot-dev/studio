import Header from "@/components/home/new/header";

export default function HomePageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="bg-marketing-background text-marketing-base text-marketing-secondary relative overflow-hidden pt-[50px] md:pt-[56px] font-sans font-bold antialiased"
      style={{ textRendering: "optimizeLegibility" }}
    >
      <Header />
      <main className="mx-auto flex flex-col gap-[72px] sm:gap-24 overflow-visible pt-9 xs:pt-12 md:pt-[72px]">
        {children}
      </main>
    </div>
  );
}
