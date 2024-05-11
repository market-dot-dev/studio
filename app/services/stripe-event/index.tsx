'use server';

import Stripe from "stripe";
import { Prisma, StripeEvent } from '@prisma/client';
import prisma from "@/lib/prisma";
import ChargeService from "../charge-service";
import SubscriptionService from "../SubscriptionService";
import StripeEventHandlers from "./stripe-event-handlers";


class StripeEventService {
  static STRIPE_HANDLED_EVENTS = [
    'charge.succeeded',
    'charge.failed',
    'customer.subscription.deleted',
    'payment_intent.payment_failed',
  ];

  static async createEvent(event: Stripe.Event) {
    return prisma.stripeEvent.create({
      data: {
        eventId: event.id,
        type: event.type,
        data: event as unknown as Prisma.InputJsonValue,
        processed: false,
      },
    });
  }

  static async getLast(limit: number = 20, eventType?: string) {
    return prisma.stripeEvent.findMany({
      where: {
        type: eventType ? { contains: eventType } : undefined,
      },
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  static async getEvent(eventId: string) {
    return prisma.stripeEvent.findUnique({
      where: {
        eventId,
      },
    });
  }

  static async markError(eventId: string, error: string) {
    return prisma.stripeEvent.update({
      where: {
        eventId,
      },
      data: {
        error,
      },
    });
  }

  static async markEventProcessed(eventId: string) {
    return prisma.stripeEvent.update({
      where: {
        eventId,
      },
      data: {
        processed: true,
      },
    });
  }

  static async getEvents() {
    return prisma.stripeEvent.findMany();
  }

  static async getUnprocessedEvents() {
    return prisma.stripeEvent.findMany({
      take: 10,
      where: {
        processed: false,
        type: {
          in: StripeEventService.STRIPE_HANDLED_EVENTS,
        }
      },
    });
  }

  static async processEvent(event: StripeEvent) {
    if (event.processed) {
      throw new Error(`Event already processed: ${event.id}`);
    }

    if(!event.data) {
      throw new Error(`Event data missing: ${event.id}`);
    }

    const e = event.data as unknown as Stripe.Event;

    try {
      await StripeEventHandlers.onEvent(e);
    } catch (err) {
      console.error(`[StripeEvent] Error processing event: ${e.type}`, err);
      await StripeEventService.markError(e.id, (err as Error).message);
    } finally {
      await StripeEventService.markEventProcessed(e.id);
    }
  }
}

export const processEvent = (eventId: string) => {
  return StripeEventService.getEvent(eventId)
    .then((event) => {
      if (!event) {
        throw new Error('Event not found');
      }

      return StripeEventService.processEvent(event);
    });
}

export const processEvents = () => {
  return StripeEventService.getUnprocessedEvents()
    .then((events) => {
      return Promise.all(events.map((event) => StripeEventService.processEvent(event)));
    });
}

export default StripeEventService;