export default function LegalPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="[&_a]: bg-marketing-background text-marketing-base text-marketing-secondary xs:pt-[56px] relative min-h-screen overflow-hidden pt-[52px] font-sans font-bold antialiased"
      style={{ textRendering: "optimizeLegibility" }}
    >
      <main className="mx-auto flex flex-col gap-[72px] overflow-visible sm:gap-24">
        {children}
      </main>
    </div>
  );
}
