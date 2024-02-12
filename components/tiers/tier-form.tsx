"use client";

import { ChangeEvent, useEffect, useState } from 'react';
import { Flex, Text, Button, TextInput, Card, Title, Bold, NumberInput, Textarea, Callout, Switch } from "@tremor/react"
import Tier from '@/app/models/Tier';
import { createTier, updateTier } from '@/app/services/TierService';
import { useRouter } from 'next/navigation';
import TierCard from './tier-card';
import { userCanSellById } from '@/app/services/StripeService';
import DashboardCard from '../common/dashboard-card';
import PageHeading from '../common/page-heading';
import { d } from '@vercel/blob/dist/put-96a1f07e';
import { Checkbox } from '@radix-ui/themes';

interface TierFormProps {
	tier: Partial<Tier>;
	handleSubmit: (tier: Tier) => void;
}

export default function TierForm({ tier: tierObj, handleSubmit }: TierFormProps) {
	const router = useRouter();
	const [tier, setTier] = useState<Tier>(tierObj as Tier);

	const newRecord = !tier.id;

	const label = newRecord ? 'Create Tier' : `Update Tier`;

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
			handleSubmit(savedTier);
		} catch (error) {
			console.log(error);
		} finally {
			setIsSaving(false);

		}
	}

	const [canPublish, setCanPublish] = useState(false);

	useEffect(() => {
		userCanSellById().then(setCanPublish);
	}, []);

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
							// className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
							// className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
							// className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
							placeholder="Describe your tier here. This is for your own use and will not be shown to any potential customers."
							name="description"
							value={tier.description || ''}
							onChange={handleInputChange}
						/>
					</div>

					<div className="mb-4">
						<label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Tier Status</label>

						<input type="checkbox"
								className='rounded-md border-2 disabled:opacity-25 h-5 w-5'
								disabled={!canPublish}
								checked={tier.published}
								onChange={(e) => {
									setTier({ ...tier, published: e.target.checked } as Tier);
								}} />

							<label htmlFor="switch" className="text-sm text-gray-500 ms-2">
								Make this tier <span className="font-medium text-gray-700">available for sale.</span>
							</label>

							{!canPublish && <Callout className="my-2" title="Payment Setup Required" color="red">You need to connect your Stripe account to publish a tier. Visit <a href="/settings/payment" className="underline">Payment Settings</a> to get started.</Callout>}

					</div>

					<div className="mb-4">
						<label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Monthly Price</label>
						<Flex className='gap-2' justifyContent='start'>
							<NumberInput value={tier.price} name="price" placeholder="Enter price" enableStepper={false} onChange={handleInputChange} />
						</Flex>
					</div>
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