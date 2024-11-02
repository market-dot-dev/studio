import type { ReactElement } from 'react'
import React from 'react'
import Image from 'next/image';
import clsx from 'clsx';

interface TestimonialProps {
  quote: ReactElement | string;
  quotee: {
    name: string;
    role: string;
    company: {
      name: string;
      url?: string;
    };
    image?: {
      src: string;
      alt: string;
    };
  }
}

const CompanyName = ({ name, url }: { name: string; url?: string }) => (
  url ? (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#8C8C88] hover:underline"
    >
      {name}
    </a>
  ) : name
)

export default function Testimonial({ quote, quotee }: TestimonialProps) {
  return (
    <div className="my-9 flex basis-1/2 flex-col gap-4 text-pretty md:my-24 md:max-w-[1000px] md:items-center md:gap-6 md:text-center lg:max-w-none">
      <blockquote
        className={clsx(
          "text-2xl leading-7 tracking-tight text-[#8C8C88] sm:text-[32px] sm:leading-9 lg:text-[40px] lg:leading-[44px]",
        )}
        style={{ hangingPunctuation: "first" }}
      >
        Gitwallet helped our collective of core maintainers{" "}
        <span className="text-[#222214]">
          set up our first commercial se
          <span className="tracking-[-0.005em]">r</span>vices tiers in under a
          week
        </span>
        . Their perspective working in and around engineering and creator
        communities was instrumental in helping us think through the messaging
        that would resonate most.
      </blockquote>
      <div className="flex w-fit items-center gap-3 text-[#8C8C88]">
        <Image
          src="/bc-avatar.jpg"
          width={32}
          height={32}
          className="rounded-full"
          alt="Bethany, a GM at Shipyard"
        />
        {`${quotee.name}, ${quotee.role} at Shipyard`}
      </div>
    </div>
  );
}
