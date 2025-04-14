export default function LegalPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="[&_a]: relative min-h-screen overflow-hidden bg-marketing-background pt-[52px] font-sans text-marketing-base font-bold text-marketing-secondary antialiased xs:pt-[56px]"
      style={{ textRendering: "optimizeLegibility" }}
    >
      <main className="mx-auto flex flex-col gap-[72px] overflow-visible sm:gap-24">
        {children}
      </main>
    </div>
  );
}
