import Link from "next/link"
import { Button } from "@tremor/react";
import CurvedUnderline from "../common/curved-underline";

const maintainerLoginUrl = process.env.NODE_ENV === 'development'
  ? "http://app.gitwallet.local:3000/login"
  : "https://app.gitwallet.co/login";

export default function HeroHome() {
  return (
    <section>
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero content */}
        <div className="relative pb-10 pt-32 md:pb-4 md:pt-36">
          {/* Section header */}
          <div className="mx-auto max-w-3xl pb-12 text-center md:pb-16">
            <Link href="https://blog.gitwallet.co">
              <Button
                className="mb-6 rounded-full bg-white/25 px-4 py-1 ring-1 ring-white/40 transition group-hover:bg-white group-hover:text-gray-800 border-none"
                variant="primary"
                color="gray"
                size="xs"
              >
                Read our Launch Post →
              </Button>
            </Link>
            <h1 className="mb-6 text-4xl font-bold leading-none tracking-tight text-white md:text-5xl lg:text-6xl">
              Build a business from an{" "}
              <CurvedUnderline>open source project.</CurvedUnderline>
            </h1>
            <p className="mb-6 font-light text-gray-200 dark:text-gray-400 md:text-lg lg:mb-8 lg:text-xl max-w-[50ch] mx-auto">
              Gitwallet is a commerce platform made for open source developers.
              Build premium products and services, sell across channels, and
              grow your business - all in one place.
            </p>
            <div className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center">
              <div data-aos="fade-up">
                <Link href={maintainerLoginUrl}>
                  <Button color="green" className="w-full">
                    Get Started →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
