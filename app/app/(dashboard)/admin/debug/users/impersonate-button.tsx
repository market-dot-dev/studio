'use client';

import { useState } from 'react';
import { Button } from '@tremor/react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

const ImpersonateButton = ({ userId } : { userId : string}) => {
  const [loading, setLoading] = useState(false);
  const { update } = useSession();
  const router = useRouter();

  const handleImpersonation = async () => {
    try {
      setLoading(true);
      // Wait for the session update to complete
      await update({
        impersonate: userId,
      });
      
      // Add a small delay to ensure the session is updated
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Force a hard refresh when redirecting to ensure new session is picked up
      window.location.href = '/';
    } catch (error) {
      console.error('Impersonation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button size="xs" onClick={handleImpersonation} disabled={loading}>
      {loading ? 'Impersonating...' : 'Impersonate'}
    </Button>
  );
};

export default ImpersonateButton;
