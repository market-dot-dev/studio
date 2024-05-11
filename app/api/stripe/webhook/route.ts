import { type NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import StripeEventService from '@/app/services/stripe-event';


const STRIPE_API_VERSION = '2023-10-16';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: STRIPE_API_VERSION });

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  const { STRIPE_WEBHOOK_SECRET } = process.env;

  if(STRIPE_WEBHOOK_SECRET === undefined) {
    throw new Error('Missing STRIPE_WEBHOOK_SECRET');
  }

  if(!STRIPE_WEBHOOK_SECRET.startsWith('whsec_')) {
    throw new Error('Invalid STRIPE_WEBHOOK_SECRET. It should start with whsec_');
  }

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
    const localEvent = await StripeEventService.createEvent(event);

    if(process.env.PROCESS_STRIPE_SYNC === 'true') {
      await StripeEventService.processEvent(localEvent);
    }
  } catch (err) {
    console.error('Error saving event to database:', err);
    return NextResponse.json({ error: 'Error saving event' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}