import Header from "@/components/home/header";

export default function HomePageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="[&_a]: bg-marketing-background text-marketing-base text-marketing-secondary relative overflow-hidden pt-[88px] antialiased"
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
