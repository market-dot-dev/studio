import TierSubscribeButton from "@/components/common/TierSubscribeButton";

const CheckoutPage = ({params} : {params: { id: string }})=> {
  const { id } = params;

  return (
    <div>
      <h1>Checkout Page</h1>
      
      <TierSubscribeButton tierId={id}/>
    </div>
  )
}

export default CheckoutPage;