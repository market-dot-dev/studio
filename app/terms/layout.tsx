import Header from "@/components/home/header";

export default function TermsOfServicePageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen bg-marketing-background text-marketing-base text-marketing-secondary relative overflow-hidden pt-[52px] xs:pt-[56px] font-sans font-bold antialiased [&_a]:"
      style={{ textRendering: "optimizeLegibility" }}
    >
      <Header />
      <main className="mx-auto flex flex-col gap-[72px] sm:gap-24 overflow-visible">
        {children}
      </main>
    </div>
  );
}
