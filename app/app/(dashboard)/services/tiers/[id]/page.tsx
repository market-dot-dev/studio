import PageHeading from '@/components/common/page-heading';

export default function EditTier() {
  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <PageHeading title="Edit Tier" />

      <div className="flex flex-col space-y-6">
        <section className="bg-white dark:bg-gray-900">
          <div className="mx-auto max-w-screen-xl">
            Edit Tier
          </div>
        </section>
      </div>
    </div>
  );
}
