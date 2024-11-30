import Image from "next/image";
import Link from "../link";
import { loginURL } from "@/lib/home/social-urls";
import GradientHeading from "@/components/home/gradient-heading";
import Button from "@/components/home/button";

export default function Footer() {
  return (
    <footer className="relative mx-auto w-full overflow-hidden bg-gradient-to-t from-marketing-camo/[25%] px-6 pb-36 pt-16 lg:px-12 lg:pb-48">
      <div className="container relative mx-auto">
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
        </div>
      </div>
    </footer>
  );
}
