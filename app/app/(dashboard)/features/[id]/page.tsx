import React from "react";
import prisma from "@/lib/prisma";
import type { Feature } from "@prisma/client";

export default async function ServiceEditPage({
  params,
}: {
  params: { id: string };
}): Promise<JSX.Element | null> {
  const feature: Feature | null = await prisma.feature.findUnique({
    where: { id: params.id },
  });

  if (!feature) {
    return null;
  }

  return (
    <div>
      <h1>Edit Service</h1>
      {/* <FeatureForm service={services} initialFeature={feature} /> */}
    </div>
  );
}
