"use client";

import useCurrentSession from "@/app/hooks/use-current-session";
import { useSession } from "next-auth/react";
import PageHeading from "@/components/common/page-heading";
import { Button, Card } from "@tremor/react";

export default function Page() {
  const { refreshSession, currentUser, isSignedIn } = useCurrentSession();

  if (isSignedIn()) {
    return (
      <Card>
        <PageHeading>Session Debug Tool</PageHeading>
        <br/>
        <pre>{JSON.stringify(currentUser, null, 2)}</pre>
        <br/>
        <Button onClick={async () => await refreshSession()}>Refresh session data</Button>
      </Card>
    )
  }

  return <a href="/api/auth/signin">Sign in</a>;
}