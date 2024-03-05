"use client";
// tier-form.tsx

import { ChangeEvent, useEffect, useState } from 'react';
import { Flex, Text, Button, Card, NumberInput, Callout, TextInput, Textarea, Accordion, AccordionHeader, AccordionBody } from "@tremor/react"
import Tier, { newTier } from '@/app/models/Tier';
import { hasSubscribers } from '@/app/services/SubscriptionService';
import { createTier, updateTier, shouldCreateNewVersion, getVersionsByTierId, TierVersionWithFeatures } from '@/app/services/TierService';
import TierCard from './tier-card';
import { userHasStripeAccountIdById } from '@/app/services/StripeService';
import PageHeading from '../common/page-heading';
import { Feature } from '@prisma/client';
import TierFeaturePicker from '../features/tier-feature-picker';
import { attachMany } from '@/app/services/feature-service';

interface TierFormProps {
	tier?: Partial<Tier>;
}

const TierVersionCard = async ({ tierVersion }: { tierVersion: TierVersionWithFeatures }) => {
	return <Card key={tierVersion.id} className="p-2" >
		<Text>Revision: {tierVersion.revision}</Text>
		<Text>Price: {tierVersion.price}</Text>
		<Text>Stripe Id: {tierVersion.stripePriceId}</Text>
		<Text>Features: {JSON.stringify((tierVersion.features || []).map(f => f.name).join(', '))}</Text>
	</Card>
};

interface NewVersionCalloutProps {
  versionedAttributesChanged: boolean;
  featuresChanged: boolean;
	tierHasSubscribers: boolean;
}

const NewVersionCallout: React.FC<NewVersionCalloutProps> = ({ versionedAttributesChanged, featuresChanged, tierHasSubscribers }) => {
	if(tierHasSubscribers && (versionedAttributesChanged || featuresChanged)) {
		const reasons: string[] = [];
		if (versionedAttributesChanged) reasons.push("price");
		if (featuresChanged) reasons.push("features");

		const reasonsText = reasons.join(" and ");

		return (
			<Callout className="mt-2 mb-5" title="New Version" color="red">
				You&apos;re changing the <strong>{reasonsText}</strong> of a tier with subscribers, which will result in a new version.
			</Callout>
		);
	} else {
		return <></>;
	}
};


export default function TierForm({ tier: tierObj }: TierFormProps) {
	const [tier, setTier] = useState<Tier>((tierObj ? tierObj : newTier()) as Tier);
	const [selectedFeatures, setSelectedFeatures] = useState<Record<string, Feature[]>>({});
	const [versionedAttributesChanged, setVersionedAttributesChanged] = useState(false);
	const [tierHasSubscribers, setTierHasSubscribers] = useState(false);
	const [versions, setVersions] = useState<TierVersionWithFeatures[]>([]);
	const [featuresChanged, setFeaturesChanged] = useState(false);

	const newRecord = !tier?.id;

	const label = newRecord ? 'Create Tier' : 'Update Tier';

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
      let savedTier;
      if (newRecord) {
        savedTier = await createTier(tier);
        const featureIds = (selectedFeatures[tier.id] || []).map(f => f.id);
        await attachMany({ referenceId: savedTier.id, featureIds: featureIds }, 'tier');
      } else {
        const newFeatures = featuresChanged ? selectedFeatures[tier.id] : undefined;
        savedTier = await updateTier(tier.id as string, tier, newFeatures);
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

	useEffect(() => {
		if(tier.id){
			getVersionsByTierId(tier.id).then(setVersions);
			hasSubscribers(tier.id).then(setTierHasSubscribers);
		}
	}, [tier.id]);

	useEffect(() => {
		if(tier && tierObj){
			shouldCreateNewVersion(tierObj as Tier, tier).then(ret => {
				setVersionedAttributesChanged(ret);
			});
		}
	}, [tier, tierObj]);

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

			<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4 pb-20">
				<div className="md:col-span-2 space-y-6">
					<div className="mb-4">
						<NewVersionCallout
							tierHasSubscribers={tierHasSubscribers}
							versionedAttributesChanged={versionedAttributesChanged}
							featuresChanged={featuresChanged}
						/>

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

								{canPublishLoading && <Text>(checking stripe eligiblity)</Text>}
								{!canPublishLoading && <>
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
							{(!canPublish && !canPublishLoading) && <>
								<Callout className="my-2" title="Payment Setup Required" color="red">You need to connect your Stripe account to publish a tier. Visit <a href="/settings/payment" className="underline">Payment Settings</a> to get started.</Callout>
							</>}
						</label>
					</div>

					<div className="mb-4">
						<label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Monthly Price (USD)</label>
						<Flex className='gap-2' justifyContent='start'>
							<NumberInput value={tier.price} name="price" placeholder="Enter price" enableStepper={false} onChange={handleInputChange} />
						</Flex>
					</div>
					{ versions && versions.length > 0 && 
					<div className="mb-4">
						<label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Old Versions</label>
						<Flex className='gap-2' justifyContent='start'>
							<Accordion className="my-2">
								<AccordionHeader className="my-0 py-1">
									Expand for past versions ({versions.length})
								</AccordionHeader>
								<AccordionBody>
									{ versions.map((version) => <TierVersionCard tierVersion={version} key={version.id} />) }
								</AccordionBody>
							</Accordion>
						</Flex>
					</div> }
					<div className="mb-4">
						<label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Features</label>
						{tier?.id ?
							<TierFeaturePicker tierId={tier.id} selectedFeatures={selectedFeatures} setSelectedFeatures={setSelectedFeatures} setFeaturesChanged={setFeaturesChanged} /> :
							<TierFeaturePicker newTier={tier} selectedFeatures={selectedFeatures} setSelectedFeatures={setSelectedFeatures} />}
					</div>
				</div>

				{/* Preview Section */}
				<div className="md:w-[300px] text-center mb-auto" >
					<label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Preview</label>
					<TierCard tier={tier} />
				</div>
			</div>
		</>
	);
}