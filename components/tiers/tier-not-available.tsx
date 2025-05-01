import Image from "next/image";

export const TierNotAvailable = () => {
  return (
    <div className="mt-20 flex flex-col items-center space-x-4">
      <h1 className="text-4xl">404</h1>
      <Image
        alt="tier not active"
        src="https://illustrations.popsy.co/gray/falling.svg"
        width={400}
        height={400}
      />
      <p className="text-lg text-stone-500">Tier not available</p>
    </div>
  );
};
