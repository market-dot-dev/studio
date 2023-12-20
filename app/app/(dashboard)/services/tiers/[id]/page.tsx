import PageHeading from '@/components/common/page-heading';
import EditTier from '@/components/tiers/edit-tier';
import { getTier } from '@/lib/tiers/fetchers';

export default async function EditTierPage({params} : {params: { id: string }}) {

  const result = await getTier(params.id) as any;

  const tier = result.errors ? null : result as any;
  
  return (
    <div className="flex max-w-screen-xl flex-col p-8">
      <PageHeading title="Edit Tier" />
      { tier ? <EditTier tier={tier} /> : null }

    </div>
  )
}