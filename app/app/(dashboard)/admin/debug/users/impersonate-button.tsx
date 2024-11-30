"use client";

import { useState } from "react";
import { Button } from "@tremor/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const ImpersonateButton = ({ userId }: { userId: string }) => {
  const [loading, setLoading] = useState(false);
  const { update } = useSession();

  const router = useRouter();

  const handleImpersonation = async () => {
    setLoading(true);
    await update({
      impersonate: userId,
    });

    router.push("/");

    setLoading(false);
  };

  return (
    <Button size="xs" onClick={handleImpersonation} disabled={loading}>
      {loading ? "Impersonating..." : "Impersonate"}
    </Button>
  );
};

export default ImpersonateButton;
