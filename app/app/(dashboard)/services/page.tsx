export default function Tiers({ params }: { params: { id: string } }) {
  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-cal text-3xl font-bold dark:text-white">
            Your Services
          </h1>
        </div>

        <div className="flex flex-col space-y-2">
          <h2>Manage your support tiers and services. We&apos;ve added a few to get you started.</h2>
        </div>

      </div>
    </div>
  );
}
