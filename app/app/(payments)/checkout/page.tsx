import { StripeServerComponent } from '@/app/services/StripeService';

const CheckoutPage = () => {
  return (
    <div>
      <h1>Debug</h1>
      
      <StripeServerComponent tierId={'clqwyjune000w8145gn7ip4q4'}/>
    </div>
  )
}

export default CheckoutPage;