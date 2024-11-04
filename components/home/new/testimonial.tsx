import type { ReactElement } from 'react'
import React from 'react'
import Image from 'next/image';
import Link from './link';

interface TestimonialProps {
  quote: ReactElement | string;
  quotee: {
    name: string;
    title: string;
    company: {
      name: string;
      url?: string;
    };
    image?: {
      src: string;
      alt?: string;
    };
  }
}

const CompanyName = ({ name, url }: { name: string; url?: string }) =>
  url ? (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {name}
    </Link>
  ) : (
    name
  );

export default function Testimonial({ quote, quotee }: TestimonialProps) {
  return (
    // <div className="mx-auto md:border-l md:pl-12 border-black/[15%] lg:border-none lg:pl-0 mb-6 sm:mb-12 lg:my-12 flex flex-col gap-4 text-pretty md:max-w-[100ch] lg:items-center md:gap-6 lg:text-center ">
    <div className="mx-auto  flex flex-col gap-4 text-pretty border-black/[15%] sm:gap-6 my-6 sm:my-9 sm:border-l sm:pl-6 md:pl-12 ">
      <blockquote className="text-marketing-md sm:text-marketing-lg lg:text-marketing-xl text-pretty md:max-w-[100ch] lg:max-w-none sm:text-balance">
        {quote}
      </blockquote>
      <div className="flex w-fit items-center gap-3">
        {quotee.image && (
          <Image
            src={quotee.image.src}
            width={32}
            height={32}
            className="rounded-full"
            alt={
              quotee.image.alt ||
              `${quotee.name}, ${quotee.title} at ${quotee.company.name}`
            }
          />
        )}
        <p>
          {`${quotee.name}, ${quotee.title} at `}
          <CompanyName {...quotee.company} />
        </p>
      </div>
    </div>
  );
}
