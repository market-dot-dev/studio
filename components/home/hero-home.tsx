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
        <div className="relative pb-10 pt-32 md:pb-4 md:pt-40">
          {/* Section header */}
          <div className="mx-auto max-w-3xl pb-12 text-center md:pb-16">
            <Link href="https://blog.gitwallet.co">
              <Button
                className="mb-6 rounded-full py-1.5 bg-gray-700 hover:bg-gray-600 px-4 border-none transition"
                variant="primary"
                size="xs"
              >
                Read our Launch Post →
              </Button>
            </Link>
            <h1 className="mx-auto mb-6 text-4xl md:text-5xl font-bold leading-none tracking-tight text-white lg:text-6xl">
              Build a business from an
              <br /> <CurvedUnderline>open source project</CurvedUnderline>
            </h1>
            <p className="mb-6 max-w-[50ch] text-gray-400 dark:text-gray-400 md:text-lg lg:mb-8 lg:text-xl mx-auto">
              Gitwallet is a commerce platform made for open source developers.
              Build premium products and services, sell across channels, and
              grow your business - all in one place.
            </p>
            <div className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center">
              <div data-aos="fade-up">
                <Link href={maintainerLoginUrl}>
                  <Button className="w-full bg-green-500 hover:bg-green-400 transition">
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
