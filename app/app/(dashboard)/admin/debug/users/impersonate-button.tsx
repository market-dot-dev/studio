"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ImpersonateButton = ({ userId }: { userId: string }) => {
  const [loading, setLoading] = useState(false);
  const { update } = useSession();

  const router = useRouter();

  const handleImpersonation = async () => {
    setLoading(true);
    await update({
      impersonate: userId
    });

    router.push("/");

    setLoading(false);
  };

  return (
    <Button size="sm" variant="outline" onClick={handleImpersonation} disabled={loading}>
      {loading ? "Impersonating..." : "Impersonate"}
    </Button>
  );
};

export default ImpersonateButton;
