"use client";

import { ChangeEvent, useState } from 'react';
import { Flex, Text, Button, TextInput, Card, Title, Bold, NumberInput } from "@tremor/react"
import Tier from '@/app/models/Tier';
import { createTier, updateTier } from '@/app/services/TierService';
import TierPriceWidget from './TierPriceWidget';
import { useRouter } from 'next/navigation';

interface TierFormProps {
	tier: Partial<Tier>;
	handleSubmit: (tier: Tier) => void;
}

export default function TierForm({ tier: tierObj, handleSubmit } : TierFormProps) {
	const router = useRouter();
	const [tier, setTier] = useState<Tier>(tierObj as Tier);

	const newRecord = !tier.id;

	const label = newRecord ? 'Create' : 'Update';
	
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
			await newRecord ? createTier(tier) : updateTier(tier.id as string, tier);
		} catch (error) {
			console.log(error);
		} finally	{
			setIsSaving(false);
			handleSubmit(tier as Tier);
		}
	}

	return (
		<>
			{/* Grid layout for responsiveness */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				{/* Form Fields Section */}
				<div className="md:col-span-2 space-y-6">
					<div className="mb-4">
						<label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Tier Name</label>
						<input
							id="tierName"
							className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
						<input
							id="tierTagline"
							className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
							placeholder="Great for startups and smaller companies."
							required
							name="tagline"
							value={tier.tagline || ''}
							onChange={handleInputChange}
						/>
					</div>

					<div className="mb-4">
						<label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Tier Description</label>
						<textarea
							id="tierDescription"
							rows={4}
							className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
							placeholder="Describe your tier here. This is for your own use and will not be shown to any potential customers."
							name="description"
							value={tier.description || ''}
							onChange={handleInputChange}
						></textarea>
					</div>

					<div className="mb-4">
						<label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">
							<Flex className='gap-2' justifyContent='start'>
								<input type="checkbox" checked={tier.published} onChange={(e) => {
									setTier({ ...tier, published: e.target.checked } as Tier);
								}} /> 
								<span>Published</span>
							</Flex>
						</label>
					</div>

					{/* Current version */}
					<Card>
						<Flex flexDirection="col" alignItems="start" className="gap-4">
							<Title>Current Version</Title>
							
							<Flex flexDirection="col" alignItems="start" className="gap-1">
								<Bold>Price</Bold>
								<NumberInput value={tier.price} name="price" placeholder="Enter price" onChange={handleInputChange}/>
							</Flex>

							<Flex flexDirection="col" alignItems="start" className="gap-1">
								<Bold>Stripe Price Id</Bold>
								<TextInput value={tier.stripePriceId || ''} name="stripePriceId" placeholder="Stripe Price Id" onChange={handleInputChange}/>
							</Flex>
							
							{/* <FeaturesEditor features={tier.features} setFeatures={setFeatures}  /> */}
						</Flex>
					</Card>

					<Button
						disabled={isSaving}
						loading={isSaving}
						onClick={onSubmit}
					>
						{label}
					</Button>

					<br />
					{ tier?.id && <>
						<Card>
							<h2>Stripe price object</h2>
							<TierPriceWidget tierId={tier.id} price={tier.price} stripePriceId={tier.stripePriceId || '' } />
						</Card> </> }
				</div>

				{/* Preview Section */}
				<div className="md:w-[300px] text-center" >
					<label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Preview</label>
					<div className="bg-white border-2 border-gray-300 shadow p-4 rounded-lg">
						<div className="text-center">
						<h2 className={`text-lg font-bold ${tier.name ? 'text-gray-800' : 'text-gray-300'}`}>{tier.name || "Premium"}</h2>
						<p className={`text-base my-4 ${tier.tagline ? 'text-gray-600' : 'text-gray-300'}`}>{tier.tagline || "Great for startups!"}</p>
						</div>

						
						<div>
							{/*
							<ul className="text-center">
								{features.map((feature : any, index : number) => (
									<li className="flex items-center space-x-3" key={index}>
										<svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
										<span className="text-sm">{feature.content}</span>
									</li>
								))}
							</ul>
								*/}

							<div className="flex justify-center items-baseline my-4">
								<span className="mr-2 text-3xl font-extrabold">${tier.price}</span>
								<span className="text t-gray-500 dark:text-gray-400">/ month</span>
							</div>

							<Button
								onClick={() => router.push(`/checkout/${tier.id}`)}
							>{tier.name ? "Get Started with " + tier.name : "Get Started"}</Button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}