"use server"

import useCurrentSession from "@/app/hooks/use-current-session";

export default function DebugCharges() {
   const { currentUser, refreshSession, isSignedIn  } = useCurrentSession();

  return (
      <div className="space-y-12 p-8">
        <h1>Debug Charges</h1>
        <pre>
        </pre>
      </div>
  );
}