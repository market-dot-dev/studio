export default function LegalPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="bg-marketing-background text-marketing-base text-marketing-secondary relative overflow-hidden pt-[52px] xs:pt-[56px] font-sans font-bold antialiased [&_a]: min-h-screen"
      style={{ textRendering: "optimizeLegibility" }}
    >
      <main className="mx-auto flex flex-col gap-[72px] sm:gap-24 overflow-visible">
        {children}
      </main>
    </div>
  );
}