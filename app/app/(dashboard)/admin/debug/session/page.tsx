"use client";

import PageHeading from "@/components/common/page-heading";
import { Button, Card } from "@tremor/react";
import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session, status, update } = useSession();

  if (status === "authenticated") {
    return (
      <Card>
        <PageHeading>Session Debug Tool</PageHeading>
        <br/>
        <pre>{JSON.stringify(session, null, 2)}</pre>
        <br/>
        <Button onClick={() => update()}>Refresh session data</Button>
      </Card>
    )
  }

  return <a href="/api/auth/signin">Sign in</a>;
}