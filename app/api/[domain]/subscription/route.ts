import SubscriptionService from "@/app/services/SubscriptionService";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request, res: Response) {
    const session = await getSession();
    
    if (!session?.user?.id) {
        return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
    }

    const body = await req.json();
    const { tierId } = body;

    if(!tierId) {
        return new Response(JSON.stringify({ error: "Tier ID not provided" }), { status: 400 });
    }

    const latestTierVersion = await prisma.tierVersion.findFirst({
        where: { tierId },
        orderBy: { createdAt: "desc" },
    });

    if (!latestTierVersion) {
        return new Response(JSON.stringify({ error: "Tier not found" }), { status: 404 });
    }

    const response = SubscriptionService.createSubscription(session.user.id, latestTierVersion.id);
    
    return new Response(JSON.stringify(response), { status: 200 });
}

export async function DELETE(req: Request, res: Response) {
    const session = await getSession();
    
    if (!session?.user?.id) {
        return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
    }

    const body = await req.json();
    const { subscriptionId } = body;

    if(!subscriptionId) {
        return new Response(JSON.stringify({ error: "Subscription ID not provided" }), { status: 400 });
    }

    const subscription = await prisma.subscription.findUnique({
        where: { id: subscriptionId },
        include: { tierVersion: { include: { tier: true } } },
    });

    if (!subscription) {
        return new Response(JSON.stringify({ error: "Subscription not found" }), { status: 404 });
    }

    if (subscription.userId !== session.user.id) {
        return new Response(JSON.stringify({ error: "Not authorized" }), { status: 403 });
    }

    await prisma.subscription.delete({
        where: { id: subscriptionId },
    });

    return new Response(null, { status: 204 });
}