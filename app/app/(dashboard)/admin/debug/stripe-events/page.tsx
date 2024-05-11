
"use server";

import UserService from "@/app/services/UserService";
import StripeEventService from "@/app/services/stripe-event";
import StripeEventIndex from "./stripe-event-index";
import { Suspense } from "react";

const AdminStripeEvents = async () => {
  const user = await UserService.getCurrentUser();

  if(!user) {
    return <div>Not logged in</div>;
  }

  const events = await StripeEventService.getLast(20, 'charge');

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StripeEventIndex events={events} />
    </Suspense>
  );
};

export default AdminStripeEvents;