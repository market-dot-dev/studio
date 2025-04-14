import prisma from "@/lib/prisma";
import type { Feature, Service } from "@prisma/client";

interface Props {
  services: Service[];
  feature: Feature | null; // Adjusted to acknowledge nullable feature for safety
}

export default async function ServiceEditPage({
  params
}: {
  params: { id: string };
}): Promise<JSX.Element | null> {
  const services: Service[] = await prisma.service.findMany();
  const feature: Feature | null = await prisma.feature.findUnique({
    where: { id: params.id }
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
