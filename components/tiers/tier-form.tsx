"use client";
import { useState } from 'react';
import { Flex, Text, Button, TextInput, Card, Title, Bold, Badge, Textarea, Switch, Divider } from "@tremor/react"
import FeaturesEditor from './features-editor';
import { Accordion, AccordionBody, AccordionHeader, AccordionList } from "@tremor/react";
import { e } from '@vercel/blob/dist/put-96a1f07e';

export default function TierForm({ tier, label = 'Update', handleSubmit }: { tier: any, label: string, handleSubmit: any }) {

	const [name, setName] = useState(tier?.name ?? '');
	const [published, setPublished] = useState(tier?.published ?? false);
	const [tagline, setTagline] = useState(tier?.tagline ?? '');
	const [description, setDescription] = useState(tier?.description ?? '');
	const [features, setFeatures] = useState(tier?.versions?.[0]?.features ?? []);
	const [price, setPrice] = useState('99');
	const [offerFreeTrial, setOfferFreeTrial] = useState(false);

	const [errors, setErrors] = useState<any>({});
	const [isSaving, setIsSaving] = useState(false);

	const defaultFreeTrial = '30';

	const handleSwitchChange = (value: boolean) => {
		setPublished(value);
	  };


	const validateForm = () => {
		if (!name) {
			setErrors({ ...errors, name: 'Please enter a name for the tier' });
			return false;
		}
		return true;
	}

	const onSubmit = async () => {
		if (!validateForm()) return;
		setIsSaving(true);
		try {
			await handleSubmit({ name, tagline, description, features, published });
		}
		catch (error) {
			console.log(error);
		}
		setIsSaving(false);
	}

	return (
		<>

			{/* Grid layout for responsiveness */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				{/* Form Fields Section */}
				<div className="md:col-span-2 space-y-6">
					<div className="mb-4">
						<label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Tier Name</label>
						<TextInput
							id="tierName"
							placeholder="Premium"
							required
							value={name}
							onChange={(e) => {
								setErrors({ ...errors, name: null });
								setName(e.target.value)
							}}
						/>
						{errors['name'] ? <Text color="red" >{errors['name']}</Text> : null}
					</div>

					<div className="mb-4">
						<label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Tier Tagline</label>
						<TextInput
							id="tierTagline"
							placeholder="Great for startups and smaller companies."
							required
							value={tagline}
							onChange={(e) => setTagline(e.target.value)}
						/>
					</div>

					<div className="mb-4">
						<label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Tier Description</label>
						<Textarea
							id="tierDescription"
							rows={4}
							placeholder="Describe your tier here. This is for your own use and will not be shown to any potential customers."
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>

					<div className="mb-4">
					<label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Current Status</label>
						<div className='flex'>
						<Switch checked={published} onChange={handleSwitchChange} />
						<Text>
							
						</Text>
						<label htmlFor="switch" className="text-sm text-gray-500 ms-2">
            				This tier is <span className="font-medium text-gray-700">{published ? 'available for sale' : 'not available for sale'}</span>
          				</label>
						</div>
					</div>

					<Divider>Tier Pricing Information</Divider>

					<div className="mb-4">
						<label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Monthly Price</label>
						<TextInput value={price} placeholder="Enter monthly price" onChange={(e) => setPrice(e.target.value)} />
					</div>

					<div className="mb-4">
						<label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Trial Period</label>
						<div className="grid grid-cols-2 gap-4">
						<div className="flex items-center">
							<Switch checked={offerFreeTrial} onChange={() => setOfferFreeTrial(!offerFreeTrial)} />
							<label htmlFor="offerFreeTrial" className="text-sm mx-4">
								{offerFreeTrial ? 'Offer a Free Trial' : 'No free trial is offered'}
							</label>
						</div>
						<div>
						{offerFreeTrial ? (
								<div className="flex flex-row">
								<label className="text-sm font-medium text-gray-900">Trial Length (Days)</label>
								<TextInput value={defaultFreeTrial} placeholder="Enter free trial length" onChange={(e) => setPrice(e.target.value)} />
							</div>
							) : ""}
						</div>
						</div>
					</div>

					<Divider>Tier Features</Divider>

					<FeaturesEditor features={features} setFeatures={setFeatures} />

					<Divider>Past Versions</Divider>

					<AccordionList className="max-w-full">
						<Accordion>
							<AccordionHeader>
								$99 (Created on Sept 30 2023)
								<Badge className="ml-2">3 Active Customers</Badge>
							</AccordionHeader>
							<AccordionBody>
								A previous version of Premium was offered at $99 and you have 3 customers active on this tier.
							</AccordionBody>
						</Accordion>
						<Accordion>
							<AccordionHeader>$79 (Created on August 30 2023)
							<Badge className="ml-2">1 Active Customers</Badge>
							</AccordionHeader>
							<AccordionBody>
							A previous version of Premium was offered at $79 and you have 1 customers active on this tier.
							</AccordionBody>
						</Accordion>
					</AccordionList>

					<Button
						disabled={isSaving}
						loading={isSaving}
						// className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-1.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
						onClick={onSubmit}
					>
						{label}
					</Button>
				</div>

				{/* Preview Section */}
				<div className="md:w-[300px] text-center" >
					<label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Preview</label>
					<div className="bg-white border-2 border-gray-300 shadow p-4 rounded-lg">
						<div className="text-center">
							<h2 className={`text-lg font-bold ${name ? 'text-gray-800' : 'text-gray-300'}`}>{name || "Premium"}</h2>
							<p className={`text-base my-4 ${tagline ? 'text-gray-600' : 'text-gray-300'}`}>{tagline || "Great for startups!"}</p>
							{/* <h3 className="text-base text-gray-500">{tierTagline}</h3> */}
						</div>

						<div>
							<ul className="text-center">
								{features.map((feature: any, index: number) => (
									<li className="flex items-center space-x-3" key={index}>
										<svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
										<span className="text-sm">{feature.content}</span>
									</li>
								))}
							</ul>

							<div className="flex justify-center items-baseline my-4">
								<span className="mr-2 text-3xl font-extrabold">${price}</span>
								<span className="text t-gray-500 dark:text-gray-400">/ month</span>
							</div>

							<div>
								{offerFreeTrial ? (
									<Button variant="primary" className="w-full">Start Free Trial</Button>
								) : (
									<Button variant="primary" className="w-full">Buy Now</Button>
								)}
							</div>
						</div>
					</div>

				</div>
			</div>
		</>
	);
}