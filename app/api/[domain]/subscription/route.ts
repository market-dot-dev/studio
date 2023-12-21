import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth_customer";
import prisma from "@/lib/prisma";
import exp from "constants";

export async function POST(req: Request, res: Response) {
    const session = await getSession();
    
    if (!session?.user?.id) {
        return { error: "Not authenticated" };
    }

    const body = await req.json();
    const { tierId } = body;

    if(!tierId) {
        return { error: "Tier ID not provided" };
    }

    const latestTierVersion = await prisma.tierVersion.findFirst({
        where: { tierId },
        orderBy: { createdAt: "desc" },
    });

    if (!latestTierVersion) {
        return { error: "Tier not found" };
    }

    const response = await prisma.subscription.create({
        data: {
            userId: session.user.id,
            tierVersionId: latestTierVersion.id,
        }
    });
    
    return NextResponse.json(response);
}

export async function DELETE(req: Request, res: Response) {
    const session = await getSession();
    
    if (!session?.user?.id) {
        return { error: "Not authenticated" };
    }

    const body = await req.json();
    const { subscriptionId } = body;

    if(!subscriptionId) {
        return { error: "Subscription ID not provided" };
    }

    const subscription = await prisma.subscription.findUnique({
        where: { id: subscriptionId },
        include: { tierVersion: { include: { tier: true } } },
    });

    if (!subscription) {
        return { error: "Subscription not found" };
    }

    if (subscription.userId !== session.user.id) {
        return { error: "Not authorized" };
    }

    const response = await prisma.subscription.delete({
        where: { id: subscriptionId },
    });

    return NextResponse.json(response);
}