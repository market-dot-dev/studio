'use client';

import { Accordion, AccordionBody, AccordionHeader, AccordionList, Card } from "@tremor/react";
import { StripeEvent } from "@prisma/client";
import LinkButton from "@/components/common/link-button";

import { processEvent } from "@/app/services/stripe-event";

const AdminStripeEvents = ({ events }: { events: StripeEvent[] }) => {
  return (
    <div className="px-3">
      <h1>Stripe Events</h1>
      <Card decoration="top" decorationColor="indigo">
        <h2>Events</h2>
        <AccordionList>
        {events.map((event: StripeEvent) => (<>
          <Accordion key={event.id}>
            <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
              {event.type}
              { event.processed ? <span className="text-sm text-tremor-content-muted dark:text-dark-tremor-content-muted"> - Processed</span> : null }
              <LinkButton onClick={() => processEvent(event.eventId)} className="ml-2">Process</LinkButton>
            </AccordionHeader>
            <AccordionBody className="leading-6">
              <pre>{JSON.stringify(event, null, 2)}</pre>
            </AccordionBody>
          </Accordion>
        </>))}
        </AccordionList>
      </Card>
    </div>
  );
};

export default AdminStripeEvents;