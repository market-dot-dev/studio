"use client";

import useCurrentSession from "@/app/hooks/use-current-session";
import PageHeader from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function Page() {
  const { refreshSession, currentUser, isSignedIn } = useCurrentSession();

  if (isSignedIn()) {
    return (
      <Card className="p-6">
        <PageHeader title="Session Debug Tool" />
        <br />
        <pre>{JSON.stringify(currentUser, null, 2)}</pre>
        <br />
        <Button onClick={async () => await refreshSession()}>Refresh session data</Button>
      </Card>
    );
  }

  return <Link href="/api/auth/signin">Sign in</Link>;
}
