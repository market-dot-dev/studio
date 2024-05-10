import { type NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from "@/lib/prisma";
import { Prisma } from '@prisma/client';


const STRIPE_API_VERSION = '2023-10-16';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: STRIPE_API_VERSION });

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Error verifying webhook signature:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    await prisma.stripeEvent.create({
      data: {
        eventId: event.id,
        type: event.type,
        data: event as unknown as Prisma.InputJsonValue,
      },
    });
  } catch (err) {
    console.error('Error saving event to database:', err);
    return NextResponse.json({ error: 'Error saving event' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}