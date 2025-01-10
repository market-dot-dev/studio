import React from 'react'
import Image from 'next/image';
import clsx from 'clsx';

export default function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/sell-dot-market-dot-dev-logo.svg"
      alt="sell.market.dev logo"
      height={32}
      width={164}
      className={clsx(className)}
    />
  );
}
