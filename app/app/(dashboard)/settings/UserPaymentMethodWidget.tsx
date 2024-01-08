"use client";

import { attachPaymentMethod } from '@/app/services/StripeService';
import { User } from '@prisma/client';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { TextInput } from '@tremor/react';
import { useState } from 'react';

const stripePromise = loadStripe('pk_test_ki6H49wdOldcE2KR7m5p8ulH00rsY96tmR');

const CheckoutForm = ({ user }: { user: User; }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [stripePaymentMethodId, setStripePaymentMethodId] = useState(user?.stripePaymentMethodId || '');

  if (!stripe || !elements) {
    // Stripe.js has not yet loaded.
    console.log('Stripe not loaded');
    return;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cardElement = elements.getElement(CardElement);

    if(!cardElement) {
      return null;
    }

    // Use your StripeService to create a PaymentIntent
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      console.log(error.message);
    } else {
      console.log('[PaymentMethod]', paymentMethod);
      if (!!paymentMethod) {
        console.log('Payment succeeded', paymentMethod);
        attachPaymentMethod(paymentMethod.id);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        name="stripePaymentMethodId"
        placeholder={"Stripe Payment Method ID"}
        value={stripePaymentMethodId || ''}
      />
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Save
      </button>
    </form>
  );
};

const StripeCheckoutFormWrapper = ({ user }: { user: User }) => {
  return <Elements stripe={stripePromise}>
    <CheckoutForm user={user} />
  </Elements>;
};

export default StripeCheckoutFormWrapper;
