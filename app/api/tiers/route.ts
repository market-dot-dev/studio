import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Get all Tiers
export async function GET() {
    return NextResponse.json({ response: "GET ALL TIERS" });
}

// Create a Tier
export async function POST(req: Request) {
    const { tierName, tierDescription, tierTagline } = await req.json();

    const tier = await prisma.tier.create({
        data: {
            userId: "clpwlg6j90000l5086ubsbv1c",
            name: tierName,
            description: tierDescription,
            tagline: tierTagline
        }
    });

    console.log("Tier created: ", tier)

    return NextResponse.json({ testing: 'ok' });
}