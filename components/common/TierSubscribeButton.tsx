"use client";

import { onClickSubscribe } from '@/app/services/StripeService';
import { getCurrentUserId } from '@/app/services/UserService';
import React, { useState } from 'react';

const TierSubscribeButton = ({ tierId }: { tierId: string }) => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('pending');
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSubscribe = async () => {
    const userId = await getCurrentUserId();

    if (userId) {
      const { status, error } = await onClickSubscribe(userId, tierId);
      setSubscriptionStatus(status);
      setError(error || undefined);
    } else {
      setError('User not logged in');
    }
  };

  return (
    <div>
      <button onClick={handleSubscribe}>Subscribe</button>
      {subscriptionStatus === 'success' && <p>Subscribed successfully!</p>}
      {subscriptionStatus === 'error' && <p>Error: {error}</p>}
      {/* Display additional messages or UI elements based on the subscription status */}
    </div>
  );
};

export default TierSubscribeButton;