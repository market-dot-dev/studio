import React, { type JSX } from "react";
import prisma from "@/lib/prisma";
import type { Feature } from "@prisma/client";

export default async function ServiceEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const feature: Feature | null = await prisma.feature.findUnique({
    where: { id },
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
