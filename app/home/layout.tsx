import Header from "@/components/home/header";

export default function HomePageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="[&_a]: relative overflow-hidden bg-marketing-background pt-[88px] text-marketing-base text-marketing-secondary antialiased"
      style={{
        textRendering: "optimizeLegibility",
        fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
        fontWeight: "bold"
      }}
    >
      <Header />
      <main className="mx-auto flex flex-col gap-[72px] overflow-visible sm:gap-24">
        {children}
      </main>
    </div>
  );
}
