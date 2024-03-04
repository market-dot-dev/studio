"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const SessionRefresher = () => {
  const { data: session, status, update } = useSession();
  const [ranEffect, setRanEffect] = useState(false);


  useEffect(() => {
    if (status === "authenticated" && !!update && !ranEffect) {
      update().then(() => setRanEffect(true));
    }
  }, [status, update, ranEffect]);

  return null;
}

export default SessionRefresher;