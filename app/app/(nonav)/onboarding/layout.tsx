import Image from "next/image";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-150 px-6 pb-12 pt-6">
      <div className="mx-auto max-w-md">
        {/* Market.dev logo */}
        <div className="mb-6 text-center">
          <Image
            alt="market.dev logo"
            width={36}
            height={36}
            className="mx-auto size-9"
            src="/gw-logo-nav.png"
            priority
          />
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}
