import { Package, HandPlatter } from "lucide-react";
import Image from "next/image";
import Hero from "@/components/design/Hero";

export default function HomePage() {
  return (
    <>
      <Hero />
      <div>
        <div className="mb-5 flex gap-2 text-[#7d8861]">
          <Package size={24} />
          <p className="">Offerings</p>
        </div>
        <h2 className="mb-5 text-[clamp(40px,7vw,46px)] font-bold leading-[1] tracking-[-0.035em] lg:text-[clamp(40px,3.5vw,46px)]">
          Sell se<span className="tracking-normal">r</span>vices & products
          <br /> in seconds
        </h2>
        <p className="mb-7 max-w-[50ch] text-[#8C8C88]">
          One place to sell services, find customers & market everywhere —
          purpose-built for open source.
        </p>
        <div className="flex flex-col gap-6 md:mx-0">
          <div className="rounded-lg relative flex h-full max-h-[400px] w-full flex-col items-start justify-between gap-x-6 gap-y-4 overflow-hidden pl-6 pt-5 ring-1 ring-inset ring-black/[8%] sm:max-h-[500px] md:max-h-[300px] md:flex-row lg:max-h-[275px] 2xl:max-h-[300px]">
            <div className="pointer-events-none absolute inset-0 z-[-2]">
              <div className="pointer-events-none absolute inset-0">
                <div
                  className="absolute inset-0 -bottom-8 right-[25%] -ml-px bg-[url('/circuit-pattern.svg?height=50&width=50')] bg-repeat opacity-[7%]"
                  style={{
                    maskImage:
                      "radial-gradient(ellipse 220% 140% at bottom left, black, transparent 45%)",
                    WebkitMaskImage:
                      "radial-gradient(ellipse 220% 140% at bottom left, black, transparent 45%)",
                  }}
                />
                <div
                  className="absolute inset-0 -bottom-6 bg-gradient-to-tr from-[#BBC4A2]/[20%] from-[10%] via-[#BBC4A2]/[3%] to-transparent"
                  style={{
                    maskImage:
                      "radial-gradient(ellipse 340% 120% at bottom left, black, black 60%, transparent 80%)",
                    WebkitMaskImage:
                      "radial-gradient(ellipse 340% 120% at bottom left, black, black 60%, transparent 80%)",
                    mixBlendMode: "overlay",
                  }}
                />
              </div>
            </div>
            <div className="z-10 flex max-w-[25ch] flex-col gap-3">
              <HandPlatter size={24} className="text-[#7d8861]" />
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-semibold tracking-tight text-gray-900">
                  List Services
                </h3>
                <p className="text-balance text-[15px] leading-5 tracking-normal text-black/40">
                  Offer services to your customers. Get paid for your time and
                  expertise.
                </p>
              </div>
            </div>
            <div className="z-[-1] ml-auto w-[90%] overflow-visible pt-3 md:w-[50%] lg:w-[45%]">
              <Image
                src="/package-cards.png"
                alt="Package cards illustration"
                height={800}
                width={600}
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
