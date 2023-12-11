import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Get all Tiers
export async function GET() {
    return NextResponse.json({ response: "GET ALL TIERS" });
}

// Create a Tier
export async function POST(req: Request) {
    const { name, description } = await req.body.json();

    const tier = await prisma.tier.create({
        data: {
            name,
            description,
        },
    });

    return NextResponse.json({ response: tier });
}
