"use client";

import useCurrentSession from "@/app/hooks/use-current-session";

export default function DebugPage() {
  const { currentUser } = useCurrentSession();

  return (
    <div className="space-y-12 p-8">
      <h1>Debug</h1>
      <pre>{JSON.stringify(currentUser, null, 2)}</pre>
    </div>
  );
}
