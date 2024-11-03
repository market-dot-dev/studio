import Header from "@/components/design/Header";

export default function HomePageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative overflow-hidden bg-marketing-background pt-[57px] font-sans text-[19px] font-bold leading-6 tracking-[-0.02em] text-marketing-secondary antialiased"
      style={{ textRendering: "optimizeLegibility" }}
    >
      <Header />
      <main className="mx-auto flex w-full max-w-[800px] flex-col gap-32 overflow-visible px-6 lg:px-12 pb-32 pt-16 lg:pt-32 lg:max-w-[1300px] lg:gap-y-32 xl:col-span-8 2xl:col-span-8 2xl:col-start-5">
        {children}
      </main>
    </div>
  );
}
