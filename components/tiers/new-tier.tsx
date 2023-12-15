'use client'
import TierForm from '@/components/tiers/tier-form';
import { createTier } from '@/lib/tiers/actions';

export default function EditTier() {
    
    const handleSubmit = async (data : any) => {
        
        
          try {
              const result = await createTier(data);
              console.log('result', result);
              // setStatus({message: 'The tier was succesfully saved', timeout: 3000});
          } catch (error) {
              console.log(error);
              // setStatus({message: 'An error occured while saving the page', type: 'error', timeout: 3000});
          }

      };
    
    return (
        <TierForm tier={{}} label="Create" handleSubmit={handleSubmit}  />
    );
  }