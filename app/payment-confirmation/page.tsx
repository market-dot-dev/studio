"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, Title, Text, Button } from '@tremor/react';

const PaymentConfirmationPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const setup_intent = searchParams.get('setup_intent');
    const setup_intent_client_secret = searchParams.get('setup_intent_client_secret');
    const redirect_status = searchParams.get('redirect_status');

    if (redirect_status === 'succeeded') {
      setStatus('success');
      setMessage('Your payment method has been saved successfully!');
    } else if (setup_intent && setup_intent_client_secret) {
      // We could verify the setup intent here with an API call if needed
      setStatus('success');
      setMessage('Your payment method has been set up successfully!');
    } else {
      setStatus('error');
      setMessage('There was an issue processing your payment method. Please try again.');
    }
  }, [searchParams]);

  const handleContinue = () => {
    // Redirect to previous page or a specific checkout page
    // We could store the original URL in localStorage before redirect if needed
    router.back();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="p-8 mt-12">
        {status === 'loading' && (
          <div className="text-center">
            <Title>Processing your payment method...</Title>
            <div className="mt-6 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <Title>Payment Method Saved</Title>
            <Text className="mt-4">{message}</Text>
            <Button className="mt-6" onClick={handleContinue}>
              Continue
            </Button>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <Title>Payment Method Setup Failed</Title>
            <Text className="mt-4">{message}</Text>
            <Button className="mt-6" onClick={handleContinue}>
              Try Again
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PaymentConfirmationPage; 