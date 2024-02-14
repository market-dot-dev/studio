"use client";
// tier-form.tsx

import { ChangeEvent, Suspense, useEffect, useState } from 'react';
import { Flex, Text, Button, Card, Title, Bold, NumberInput, Callout, TextInput, Textarea } from "@tremor/react"
import Tier, { newTier } from '@/app/models/Tier';
import { createTier, updateTier } from '@/app/services/TierService';
import { useRouter } from 'next/navigation';
import TierCard from './tier-card';
import { userHasStripeAccountIdById } from '@/app/services/StripeService';
import PageHeading from '../common/page-heading';
import { Feature } from '@prisma/client';
import TierFeaturePicker from '../features/tier-feature-picker';
import { attachMany } from '@/app/services/feature-service';

interface TierFormProps {
	tier?: Partial<Tier>;
}

export default function TierForm({ tier: tierObj }: TierFormProps) {
	const router = useRouter();
	const [tier, setTier] = useState<Tier>((tierObj ? tierObj : newTier()) as Tier);
	const [selectedFeatures, setSelectedFeatures] = useState<Record<string, Feature[]>>({});

	const newRecord = !tier?.id;

	const label = newRecord ? 'Create Tier' : 'Update Tier';
	
	//const [features, setFeatures] = useState(tier.features ?? []);
	const [errors, setErrors] = useState<any>({});
	const [isSaving, setIsSaving] = useState(false);

	const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const updatedTier = { ...tier, [name]: value } as Tier;
    setTier(updatedTier);
  };

	const validateForm = () => {
		if (!tier.name) {
			setErrors({ ...errors, name: 'Please enter a name for the tier' });
			return false;
		}
		return true;
	}

	const onSubmit = async () => {
		if (!validateForm()) return;
		setIsSaving(true);

		try {
			const savedTier = newRecord ? await createTier(tier) : await updateTier(tier.id as string, tier);

			if(newRecord) {
				await attachMany({ referenceId: savedTier.id, featureIds: Object.values(selectedFeatures).flat().map(f => f.id) }, 'tier');
			}
			window.location.href = `/tiers/${savedTier.id}`;
		} catch (error) {
			console.log(error);
		} finally {
			setIsSaving(false);
		}
	}

	const [canPublish, setCanPublish] = useState(false);
	const [canPublishLoading, setCanPublishLoading] = useState(true);

	useEffect(() => {
		userHasStripeAccountIdById().then((value: boolean) => {
			setCanPublish(value)
			setCanPublishLoading(false);
		});
	}, []);

	const canPublishDisabled = !canPublish || canPublishLoading;

	return (
		<>
			{/* Grid layout for responsiveness */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				{/* Form Fields Section */}
				<div className="md:col-span-2 space-y-6">
				<div className="flex justify-between">
						<div>
							<PageHeading title={label} />
						</div>
						<div>
							<Button
								disabled={isSaving}
								loading={isSaving}
								onClick={onSubmit}
							>
								{label}
							</Button>
						</div>
					</div>

				</div>

				<div>
					&nbsp;
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
				<div className="md:col-span-2 space-y-6">

					<div className="mb-4">
						<label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Tier Name</label>
						<TextInput
							id="tierName"
							placeholder="Premium"
							required
							name="name"
							value={tier.name}
							onChange={handleInputChange}
							
						/>
						{errors['name'] ? <Text color="red" >{errors['name']}</Text> : null}
					</div>

					<div className="mb-4">
						<label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Tier Tagline</label>
						<TextInput
							id="tierTagline"
							placeholder="Great for startups and smaller companies."
							required
							name="tagline"
							value={tier.tagline || ''}
							onChange={handleInputChange}
						/>
					</div>

					<div className="mb-4">
						<label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Tier Description</label>
						<Textarea
							id="tierDescription"
							rows={4}
							placeholder="Describe your tier here. This is for your own use and will not be shown to any potential customers."
							name="description"
							value={tier.description || ''}
							onChange={handleInputChange}
						/>
					</div>

					<div className="mb-4">
						<label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Tier Status</label>
						<label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">
							<Flex className='gap-2' justifyContent='start'>

							{ canPublishLoading && <Text>(checking stripe eligiblity)</Text> }
							{ !canPublishLoading && <>
								<input type="checkbox"
									checked={tier.published}
									disabled={canPublishDisabled}
									onChange={(e) => {
										setTier({ ...tier, published: e.target.checked } as Tier);
									}} /> 
								<span>
									<label htmlFor="switch" className="text-sm text-gray-500 ms-2">
										Make this tier <span className="font-medium text-gray-700">available for sale.</span>
									</label>
								</span>
							</>}
							</Flex>
							{ (!canPublish && !canPublishLoading) && <>
								<Callout className="my-2" title="Payment Setup Required" color="red">You need to connect your Stripe account to publish a tier. Visit <a href="/settings/payment" className="underline">Payment Settings</a> to get started.</Callout>
							</>}
						</label>
					</div>

					<div className="mb-4">
						<label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Monthly Price</label>
						<Flex className='gap-2' justifyContent='start'>
							<NumberInput value={tier.price} name="price" placeholder="Enter price" enableStepper={false} onChange={handleInputChange} />
						</Flex>
					</div>

					{ tier?.id ?
						<TierFeaturePicker tierId={tier.id} selectedFeatures={selectedFeatures} setSelectedFeatures={setSelectedFeatures} /> :
						<TierFeaturePicker newTier={tier} selectedFeatures={selectedFeatures} setSelectedFeatures={setSelectedFeatures} /> }
				</div>

				{/* Preview Section */}
				<div className="md:w-[300px] text-center" >
					<label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Preview</label>
					<TierCard tier={tier} />
				</div>
			</div>
		</>
	);
}