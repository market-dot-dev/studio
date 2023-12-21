"use client";
import { useState } from 'react';
import { Flex, Text, Button, TextInput, Card, Title, Bold } from "@tremor/react"
import FeaturesEditor from './features-editor';



export default function TierForm({tier, label = 'Update', handleSubmit} : {tier: any, label : string, handleSubmit : any}) {
	
	const [name, setName] = useState(tier?.name ?? '');
	const [published, setPublished] = useState(tier?.published ?? false);
	const [tagline, setTagline] = useState(tier?.tagline ?? '');
	const [description, setDescription] = useState(tier?.description ?? '');
	const [features, setFeatures] = useState(tier?.versions?.[0]?.features ?? []);
	const [price, setPrice] = useState('99');
	
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

					<div className="mb-4">
						<label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">
							<Flex className='gap-2' justifyContent='start'>
								<input type="checkbox" checked={published} onChange={(e) => {
									setPublished(e.target.checked)
								}} /> 
								<span>Published</span>
							</Flex>
						</label>
					</div>

					<Card>
						<Flex flexDirection="col" alignItems="start" className="gap-4">
							<Title>Current Version</Title>
							
							<Flex flexDirection="col" alignItems="start" className="gap-1">
								<Bold>Price</Bold>
								<TextInput value={price} placeholder="Enter price" onChange={(e) => setPrice(e.target.value)}/>
							</Flex>
							
							<FeaturesEditor features={features} setFeatures={setFeatures}  />
						</Flex>
					</Card>


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
							{features.map((feature : any, index : number) => (
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

						{/* <PrimaryLinkButton
							label={name ? "Get Started with " + name : "Get Started"}
							href="" /> */}
							<Button>{name ? "Get Started with " + name : "Get Started"}</Button>
						</div>
					</div>

				</div>
			</div>
		</>
	);
}