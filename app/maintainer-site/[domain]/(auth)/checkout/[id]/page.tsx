import CheckoutPage from "@/app/app/(payments)/checkout/[id]/page";

export default async function CheckoutPageWrapper({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return <CheckoutPage id={id} />;
}
