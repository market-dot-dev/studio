import ClaimStoreForm from "@/components/home/claim-store-form";
import GradientHeading from "@/components/home/gradient-heading";
import Image from "next/image";

export default function Hero() {
  return (
    <>
      <div className="mx-auto flex w-full max-w-[800px] flex-col items-center gap-12 px-6 pt-6 md:pt-10 lg:pt-11 tracking-tight md:gap-y-16 lg:max-w-[var(--marketing-max-width)] lg:px-16 ">
        <div className="flex size-full flex-col items-center">
          <GradientHeading className="mb-3 whitespace-nowrap text-center text-[clamp(24px,8vw,37px)] font-bold !leading-[0.9] tracking-[-0.0525em] text-marketing-primary xs:text-marketing-lg sm:mb-4 sm:text-marketing-xl md:text-marketing-2xl md:tracking-[-0.045em] lg:mb-5 lg:text-marketing-2xl xl:text-marketing-3xl">
            Sales and marketing tools <br />for developer experts.
          </GradientHeading>
          <p className="mb-4 max-w-[44ch] text-pretty text-center text-marketing-sm !leading-tight xs:mb-5 xs:text-balance sm:mb-6 sm:text-[clamp(16px,12vw,20px)] lg:text-marketing-md">
            The AI-native marketing, CRM and payment toolkit for freelancers.{" "}
            <br className="xs:hidden" />{" "}Let's grow your business, today.
          </p>
          <div>
            <ClaimStoreForm id="hero" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 sm:gap-5 md:gap-7 lg:gap-8">
          <div className="-mr-60 h-full w-[calc(100vw+192px)] overflow-visible sm:rounded-md md:-mr-72 md:mt-0 lg:mx-auto lg:mt-0 lg:w-full lg:max-w-[var(--marketing-max-width)] lg:rounded-xl">
            <Image
              src="/home.png"
              alt="market.dev logo"
              height={1600}
              width={2400}
              className="drop-shadow"
            />
          </div>
        </div>
      </div>
      <span id="product" className="hidden"></span>
    </>
  );
}
