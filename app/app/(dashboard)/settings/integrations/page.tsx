import { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import CalIntegration from "./cal-integration";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Integrations",
};

export default async function IntegrationsPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }

  // Check if user has Cal.com integration
  const calIntegration = await prisma.calIntegration.findUnique({
    where: { userId: session.user.id },
  });

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <h1 className="font-cal text-2xl font-bold">Integrations</h1>
        <p className="text-muted-foreground mt-1">
          Connect external services to enhance your application.
        </p>
      </div>

      <div className="flex flex-col space-y-6">
        <CalIntegration isConnected={!!calIntegration} />
      </div>
    </div>
  );
} 