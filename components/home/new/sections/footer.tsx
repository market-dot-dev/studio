import Image from "next/image";
import Link from "../link";
import { loginURL } from "@/lib/home/social-urls";
import GradientHeading from "@/components/home/new/gradient-heading";
import Button from "@/components/home/new/button";

export default function Footer() {
  const svgs = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 6l9 4 9-4-9-4-9 4zm0 6l9 4 9-4-9-4-9 4zm9 4l-9 4 9 4 9-4-9-4z" />
    </svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>`,
  ];

  return (
    <footer className="relative w-full overflow-hidden pb-24 pt-12 sm:pb-[144px] sm:pt-[72px] lg:pb-48">
      <div className="container relative mx-auto px-4">
        <div className="flex w-full flex-col items-center">
          <GradientHeading
            as="h2"
            className="lg:text-marketing-5xl md:text-marketing-4xl mb-5 whitespace-nowrap text-center text-[clamp(30px,12vw,58px)] font-bold leading-[0.9] tracking-[-0.035em] md:mb-6 md:tracking-[-0.045em] lg:mb-8"
          >
            Sta<span className="tracking-normal">r</span>t building
            <br /> your business
          </GradientHeading>
          <p className="mb-6 max-w-[45ch] text-pretty text-center md:mb-8 md:text-[clamp(19px,12vw,24px)] md:leading-[clamp(20px,12vw,28px)]">
            Get started for free, no credit card required.
          </p>
          <Link href={loginURL} className="md:py-3.5 md:mx-6">
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