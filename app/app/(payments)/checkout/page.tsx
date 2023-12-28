import { StripeServerComponent } from '@/app/services/StripeService';

const CheckoutPage = () => {
  const clientSecret = <StripeServerComponent />;

  return (
    <div>
      <h1>Debug</h1>
      
      <StripeServerComponent />
    </div>
  )
}

export default CheckoutPage;