import PageHeading from '@/components/common/page-heading';
import NewTier from '@/components/tiers/new-tier';

export default function EditTierPage({params} : {params: { id: string }}) {


  return (
    <div className="flex max-w-screen-xl flex-col p-8">
      <PageHeading title="New Tier" />
      <NewTier />
    </div>
  )
}