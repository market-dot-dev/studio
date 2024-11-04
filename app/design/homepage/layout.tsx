import Header from "@/components/home/new/header";

export default function HomePageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="bg-marketing-background text-marketing-base text-marketing-secondary relative overflow-hidden pt-[50px] md:pt-[56px] font-sans font-bold antialiased"
      style={{ textRendering: "optimizeLegibility" }}
    >
      <Header />
      <main className="mx-auto flex max-w-[800px] flex-col gap-12 sm:gap-[72px] lg:gap-24 overflow-visible px-6 pt-9 lg:pt-[72px] lg:max-w-[1300px] lg:px-12 xl:col-span-8 2xl:col-span-8 2xl:col-start-5">
        {children}
      </main>
    </div>
  );
}
