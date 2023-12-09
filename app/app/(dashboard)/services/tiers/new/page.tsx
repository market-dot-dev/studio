import PageHeading from '@/components/common/page-heading';

export default function NewTier() {
  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <PageHeading title="New Tier" />

      <div className="flex flex-col space-y-6">
        <section className="bg-white dark:bg-gray-900">
          <div className="mx-auto max-w-screen-xl">
                New Tier: Name, Description, Tagline, Services, Pricing
          </div>
        </section>
      </div>
    </div>
  );
}
