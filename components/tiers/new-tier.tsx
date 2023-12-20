'use client'
import TierForm from '@/components/tiers/tier-form';
import { createTier } from '@/lib/tiers/actions';
import { useRouter } from 'next/navigation';

export default function EditTier() {
    const router = useRouter();
    const handleSubmit = async (data : any) => {
        
        
          try {
              const result = await createTier(data) as any;
              if(result.id) {
                router.push(`${result.id}`);
              }

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