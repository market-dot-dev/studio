"use client";

import React from 'react';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

interface CheckoutFormProps {
  clientSecret: string;
  returnUrl: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ clientSecret, returnUrl }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      console.log('Stripe not loaded');
      return;
    }
  
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
      },
    });
  
    if (result.error) {
      console.log(result.error.message);
    } else {
      console.log("Payment processing.");
      // Check result.paymentIntent.status to confirm the payment status
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit" disabled={!stripe}>
        Submit
      </button>
    </form>
  );
};

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_ki6H49wdOldcE2KR7m5p8ulH00rsY96tmR');

interface StripeCheckoutFormProps {
  clientSecret: string;
  returnUrl: string;
}

const StripeCheckoutForm: React.FC<StripeCheckoutFormProps> = ({ clientSecret, returnUrl }) => {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm clientSecret={clientSecret} returnUrl={returnUrl} />
    </Elements>
  );
};

export default StripeCheckoutForm;
