"use server";

import LoadingDots from "@/components/icons/loading-dots";

export default async function Loading() {
  return (
    <>
      <div className="flex size-full items-center justify-center">
        <LoadingDots />
      </div>
    </>
  );
}
