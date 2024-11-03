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
    <div className="mx-auto md:border-l md:pl-12 border-black/[15%] lg:border-none lg:pl-0 mb-6 flex flex-col gap-4 text-pretty md:max-w-[100ch] lg:items-center md:gap-6 lg:text-center ">
      <blockquote className="text-pretty md:text-balance text-2xl leading-7 tracking-tight sm:text-[32px] sm:leading-9 lg:text-[40px] lg:leading-[44px]">
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
