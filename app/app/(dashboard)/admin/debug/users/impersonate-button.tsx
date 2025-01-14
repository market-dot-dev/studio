'use client';

import { useState } from 'react';
import { Button } from '@tremor/react';
import { useSession } from "next-auth/react";

const ImpersonateButton = ({ userId } : { userId : string}) => {
  const [loading, setLoading] = useState(false);
  const { update } = useSession();

  const handleImpersonation = async () => {
    try {
      setLoading(true);
      
      // Wait for the session update to complete
      await update({
        impersonate: userId,
      });
      
      // Force a full page reload to ensure the layout re-renders with new session
      window.location.href = '/';
      
    } catch (error) {
      console.error('Impersonation failed:', error);
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
