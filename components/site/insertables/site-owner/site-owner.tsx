"use client";

import Image from "next/image";

export default function SiteOwner({ site, page }: { site: any; page: any }) {
  return (
    <div className="flex items-center justify-start gap-4">
      {site?.user ? (
        <Image
          src={site.user.image}
          width={80}
          height={80}
          alt={site.user.name}
          className="size-12 rounded-full"
        />
      ) : (
        <div className="size-12 rounded-full bg-gray-200"></div>
      )}
      <span className="truncate text-lg">{site?.user.name ?? "John Doe"}</span>
    </div>
  );
}
