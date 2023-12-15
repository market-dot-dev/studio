'use client'
import TierForm from '@/components/tiers/tier-form';
import { updateTier } from '@/lib/tiers/actions';

export default function EditTier({tier} : {tier: any}) {
    
    const handleSubmit = async ({name, tagline, description, features} : any) => {
  
          try {
              const result = await updateTier({id: tier.id, versionId: tier.versions[0].id, name, tagline, description, features });
              console.log('result', result);
              // setStatus({message: 'The tier was succesfully saved', timeout: 3000});
          } catch (error) {
              console.log(error);
              // setStatus({message: 'An error occured while saving the page', type: 'error', timeout: 3000});
          }

      };
    
    return (
        <TierForm tier={tier} label="Update" handleSubmit={handleSubmit}  />
    );
  }