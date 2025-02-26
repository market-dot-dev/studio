import Image from "next/image";
import Link from "../link";
import { loginURL } from "@/lib/home/social-urls";
import GradientHeading from "@/components/home/gradient-heading";
import Button from "@/components/home/button";
import Logo from "@/components/home/logo";

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-gradient-to-t from-marketing-camo/[33%] pb-6 pt-20">
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
          <Link href={loginURL} className="md:mx-6 md:pt-1">
            <Button>
              <Image
                src="/github.svg"
                alt="github logo"
                height={24}
                width={24}
                className="h-[22px] w-auto md:h-6"
              />
              Sign up with Github
            </Button>
          </Link>

          <div className="mt-44 w-full border-t border-black/10 pt-5">
            <div className="grid grid-cols-1 gap-6 divide-y divide-black/[7%] text-marketing-primary xs:grid-cols-3 xs:divide-y-0 lg:grid-cols-5">
              <div className="col-span-full flex flex-col gap-3 lg:col-span-2">
                <Logo color="black" className="h-[25px] w-fit" />
                <p className="text-xs text-marketing-secondary">
                  © {new Date().getFullYear()} market.dev. All rights reserved.
                </p>
              </div>

              <div className="flex flex-row gap-4 pt-2 xs:flex-col xs:pt-0">
                <h3 className="h-fit w-full text-sm text-marketing-secondary">
                  Navigation
                </h3>
                <div className="flex h-fit w-full flex-col gap-2">
                  <Link href={loginURL} className="text-sm">
                    Log in
                  </Link>
                  <Link href="https://explore.market.dev" className="text-sm">
                    Explore
                  </Link>
                </div>
              </div>

              <div className="flex flex-row gap-4 pt-2 xs:flex-col xs:pt-0">
                <h3 className="h-fit w-full text-sm text-marketing-secondary">
                  Legal
                </h3>
                <div className="flex h-fit w-full flex-col gap-2">
                  <Link href="/terms" className="text-sm">
                    Terms of Service
                  </Link>
                  <Link href="/privacy" className="text-sm">
                    Privacy Policy
                  </Link>
                </div>
              </div>

              <div className="flex flex-row gap-4 pt-2 xs:flex-col xs:pt-0">
                <h3 className="h-fit w-full text-sm text-marketing-secondary">
                  Follow
                </h3>
                <div className="flex h-fit w-full flex-col gap-2">
                  <Link
                    href="https://discord.gg/ZdSpS4BuGd"
                    target="_blank"
                    className="text-sm"
                  >
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
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}