"use client";

import { useEffect, useState } from 'react';
import { validatePayment } from '@/app/services/StripeService';

const SuccessPage = () => {
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validateAndProcessPayment = async () => {
      console.log("===== validating");
      const urlParams = new URLSearchParams(window.location.search);
      const paymentIntent = urlParams.get('payment_intent');
      const clientSecret = urlParams.get('payment_intent_client_secret');
      const redirectStatus = urlParams.get('redirect_status');

      if (redirectStatus !== 'succeeded' || !paymentIntent || !clientSecret) {
        setPaymentStatus('failed');
        console.error('Payment did not succeed or missing data.');
        return;
      }

      try {
        const isValid = await validatePayment(paymentIntent, clientSecret);
        if (isValid) {
          setPaymentStatus('succeeded');
        } else {
          setPaymentStatus('failed');
          console.error('Payment validation failed.');
        }
      } catch (error) {
        setPaymentStatus('errored');
        setError(error as string);
        console.error('Error validating payment:', error);
      }
    };

    validateAndProcessPayment();
  }, []);

  return (
    <div>
      <h1>Payment {paymentStatus}</h1>
      {/* Additional success message or redirection can go here */}
    </div>
  )
}

export default SuccessPage;