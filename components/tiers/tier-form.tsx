"use client";
import { useState } from 'react';
import PageHeading from '@/components/common/page-heading';
import { updateTier } from '@/lib/tiers/actions';
import { Flex, IconButton } from "@radix-ui/themes";
import { Text, Button, List, ListItem, TextInput } from "@tremor/react"

import { Button as FButton } from 'flowbite-react';
import VersionEditor from './version-editor';


export default function TierForm({tier, label = 'Update', handleSubmit} : {tier: any, label : string, handleSubmit : any}) {
	
	const [name, setName] = useState(tier.name);
	const [tagline, setTagline] = useState(tier.tagline);
	const [description, setDescription] = useState(tier.description);
	const [features, setFeatures] = useState(tier.versions[0].features ?? []);
	
	const [errors, setErrors] = useState<any>({});
	const [isSaving, setIsSaving] = useState(false);


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
			await handleSubmit({ name, tagline, description, features });
		}
		catch (error) {
			console.log(error);
		}
		setIsSaving(false);
	}

	return (
		<div className="flex max-w-screen-xl flex-col p-8">

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
						<input
							id="tierTagline"
							className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
							placeholder="Great for startups and smaller companies."
							required
							value={tagline}
							onChange={(e) => setTagline(e.target.value)}
						/>
					</div>

					<div className="mb-4">
						<label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Tier Description</label>
						<textarea
							id="tierDescription"
							rows={4}
							className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
							placeholder="Describe your tier here. This is for your own use and will not be shown to any potential customers."
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						></textarea>
					</div>
					

					
					<VersionEditor features={features} setFeatures={setFeatures}  />


					<FButton
						type="button"
						disabled={isSaving}
						isProcessing={isSaving}
						// className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-1.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
						onClick={onSubmit}
					>
						{label}
					</FButton>
				</div>

				{/* Preview Section */}
				<div className="md:col-span-1 bg-white border border-gray-100 shadow p-4 rounded-lg">
					<div>
						<p className="text-sm text-gray-800">{name}</p>
						<p className="text-sm text-gray-800">{tagline}</p>
						<p className="text-sm text-gray-800">{description}</p>
					</div>
				</div>
			</div>
		</div>
	);
}