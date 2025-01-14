import React from 'react'
import Image from 'next/image';
import clsx from 'clsx';

export default function Logo({ color = 'black', className }: { color?: 'black' | 'white', className?: string }) {
  return (
    <Image
      src={color === "white" ? "/store-dot-dev-logo-white.svg" : "/store-dot-dev-logo.svg"}
      alt="sell.market.dev logo"
      height={32}
      width={164}
      className={clsx(className)}
    />
  );
}
