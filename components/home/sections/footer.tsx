import ClaimStoreForm from "@/components/home/claim-store-form";
import GradientHeading from "@/components/home/gradient-heading";
import Logo from "@/components/common/logo";
import { loginURL } from "@/lib/home/social-urls";
import Link from "../link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-gradient-to-t from-marketing-camo/[25%] pb-8 pt-20">
      <div className="mx-auto w-full max-w-[800px] px-6 lg:max-w-[var(--marketing-max-width)] lg:px-16">
        <div className="flex w-full flex-col items-center">
          <GradientHeading
            as="h2"
            className="mb-4 whitespace-nowrap text-center text-[clamp(30px,12vw,58px)] font-bold leading-[0.9] tracking-[-0.035em] md:mb-5 md:text-marketing-4xl md:tracking-[-0.045em] lg:mb-7 lg:text-marketing-5xl"
          >
            Sta<span className="tracking-normal">r</span>t building
            <br /> your business
          </GradientHeading>
          <p className="mb-6 max-w-[45ch] text-pretty text-center tracking-[-0.035em] md:mb-8 md:text-[clamp(19px,12vw,24px)] md:leading-[clamp(20px,12vw,28px)] md:tracking-tight">
            Get started for free, no credit card required.
          </p>
          <div className="md:mx-6 md:pt-1">
            <ClaimStoreForm id="footer" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 w-full border-t border-black/10 pt-5 divide-y divide-black/[7%] text-marketing-primary xs:grid-cols-3 xs:divide-y-0 lg:grid-cols-5 mt-44">
          <div className="col-span-full flex-col flex lg:flex-col justify-between gap-4 lg:col-span-2">
            <Logo color="black" className="h-[30px] w-fit" />
            <div className="h-fit hidden lg:block">
              <p className="text-xs text-marketing-secondary tracking-tight">
                Studio is a{" "}
                <Link href="https://market.dev" className="!text-marketing-primary hover:underline underline-offset-[3px]">
                  market.dev
                </Link>
                {" "}
                company
              </p>
              <p className="text-xs text-marketing-secondary tracking-tight">
                © {new Date().getFullYear()} market.dev. All rights reserved.
              </p>
            </div>
          </div>

          <div className="flex flex-row gap-2 pt-2 xs:flex-col xs:pt-0">
            <h3 className="h-fit w-full text-sm text-marketing-primary">Navigation</h3>
            <div className="flex h-fit w-full flex-col gap-2">
              <Link href={loginURL} className="text-sm">
                Log in
              </Link>
              <Link href="https://explore.market.dev" className="text-sm">
                Explore
              </Link>
            </div>
          </div>

          <div className="flex flex-row gap-2 pt-2 xs:flex-col xs:pt-0">
            <h3 className="h-fit w-full text-sm text-marketing-primary">Legal</h3>
            <div className="flex h-fit w-full flex-col gap-2">
              <Link href="/terms" className="text-sm">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-sm">
                Privacy Policy
              </Link>
            </div>
          </div>

          <div className="flex flex-row gap-2 pt-2 xs:flex-col xs:pt-0">
            <h3 className="h-fit w-full text-sm text-marketing-primary">Follow</h3>
            <div className="flex h-fit w-full flex-col gap-2">
              <Link href="https://discord.gg/ZdSpS4BuGd" target="_blank" className="text-sm">
                Discord
              </Link>
              <Link
                href="https://twitter.com/marketdotdev"
                target="_blank"
                className="flex items-center gap-1 text-sm"
              >
                Twitter
              </Link>
            </div>
          </div>

          <div className="h-fit flex flex-col xs:flex-row gap-x-4 justify-between lg:hidden pt-2 w-full col-span-full">
            <p className="text-xs text-marketing-secondary tracking-tight">
              Studio is a{" "}
              <Link href="https://market.dev" className="!text-marketing-primary hover:underline underline-offset-[3px]">
                market.dev
              </Link>
              {" "}
              company
            </p>
            <p className="text-xs text-marketing-secondary tracking-tight">
              © {new Date().getFullYear()} market.dev. All rights reserved.
            </p>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
