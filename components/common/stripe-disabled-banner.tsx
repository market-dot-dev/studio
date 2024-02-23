import LinkButton from "./link-button";

const StripeDisabledBanner = () => {
  return (
    <>
      <div
        className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
        role="alert"
      >
        <strong className="font-bold">Stripe account error</strong>
        <br />
        <span className="block sm:inline">
          Please visit settings for more details.
          <LinkButton href="/settings/payment" label="Go There" />
        </span>
      </div>
    </>
  );
};

export default StripeDisabledBanner;