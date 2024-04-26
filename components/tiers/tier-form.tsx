"use client";

import { useEffect, useState } from 'react';
import { Flex, Text, Button, Bold, Badge, NumberInput, Callout, TextInput, Textarea, Accordion, AccordionHeader, AccordionBody, Icon, Tab, Card } from "@tremor/react"
import Tier, { newTier } from '@/app/models/Tier';
import { subscriberCount } from '@/app/services/SubscriptionService';
import { createTier, destroyTier, updateTier, getVersionsByTierId, TierVersionWithFeatures, TierWithFeatures } from '@/app/services/TierService';
import TierCard from './tier-card';
import { userHasStripeAccountIdById } from '@/app/services/StripeService';
import PageHeading from '../common/page-heading';
import TierFeaturePicker from '../features/tier-feature-picker';
import { attachMany } from '@/app/services/feature-service';
import Link from 'next/link';
import DashboardCard from '../common/dashboard-card';
import { Feature } from '@prisma/client';
import LoadingDots from "@/components/icons/loading-dots";
import {
	Select,
	SelectItem,
	Table,
	TableHead,
	TableHeaderCell,
	TableBody,
	TableRow,
	TableCell,
} from "@tremor/react";
import useCurrentSession from '@/app/hooks/use-current-session';
import LinkButton from '../common/link-button';
import { getRootUrl } from '@/app/services/domain-service';
import { findUser } from '@/app/services/UserService';
import { Copy } from 'lucide-react';


interface TierFormProps {
	tier?: Partial<Tier>;
}

const TierVersionCard = ({ tierVersion }: { tierVersion: TierVersionWithFeatures }) => {
	const features = tierVersion.features || [];
	const [versionSubscribers, setVersionSubscribers] = useState(0);

	useEffect(() => {
		subscriberCount(tierVersion.tierId, tierVersion.revision).then(setVersionSubscribers);
	}, [tierVersion.tierId, tierVersion.revision]);

	return (
		<TableRow>
			<TableCell className="p-1 ps-0 m-0">{tierVersion.createdAt.toDateString()}</TableCell>
			<TableCell className="p-1 ps-0 m-0">
				{features.length > 0 ?
					<>
						<ul>
							{(features || []).map(f => <li key={f.id}>· {f.name}</li>)}
						</ul>
					</> :
					<>&nbsp;none</>
				}
			</TableCell>
			<TableCell className="text-center p-1 ps-0 m-0">
				${tierVersion.price}
			</TableCell>
			<TableCell className="p-1 ps-0 m-0 text-center">
				{versionSubscribers}
			</TableCell>
		</TableRow>
	);
};

interface NewVersionCalloutProps {
	versionedAttributesChanged: boolean;
	featuresChanged: boolean;
	tierHasSubscribers: boolean;
}

const NewVersionCallout: React.FC<NewVersionCalloutProps> = ({ versionedAttributesChanged, featuresChanged, tierHasSubscribers }) => {
	if (tierHasSubscribers && (versionedAttributesChanged || featuresChanged)) {
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

const TierLinkCopier = ({ tier }: { tier: Tier }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
	const [link, setLink] = useState('');

	useEffect(() => {
		findUser(tier.userId).then(user => {
			const rootUrlPromise = getRootUrl(user?.gh_username || 'app', `/checkout/${tier.id}`) as unknown as Promise<string>;
			return rootUrlPromise.then(val => {
				setLink(val);
			})
		}).catch(err => {
			setErrorMessage(err.message);
		})
	}, [tier.id, tier.userId])
	

  const copyToClipboard = async () => {
    if (window.location.protocol !== 'https:') {
      setErrorMessage('Copying to clipboard is only supported on HTTPS sites.');
      return;
    }

    try {
      await navigator.clipboard.writeText(link);
      setIsCopied(true);
      setErrorMessage('');
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setErrorMessage('Failed to copy the link. Please try again.');
    }
  };

return (
	<div className="mt-4 flex flex-col bg-gray-100 rounded-lg border border-gray-400 px-2 py-4 text-gray-700">
		<Bold>Checkout Link</Bold>
		<Text>You can send this link directly to any potential customers.</Text>
		<div className="mt-4 flex flex-row justify-center items-center">
			
			<TextInput
				id="checkoutLink"
				className="rounded-r-none"
				readOnly
				defaultValue=''
				value={link}
			/>
			<Button
				icon={Copy}
				onClick={copyToClipboard}
				disabled={isCopied}
				className={`rounded-l-none`+`${isCopied ? 'opacity-50 cursor-not-allowed' : ''}`}
			>
				{isCopied ? 'Copied!' : ''}
			</Button>
			
		</div>
		{errorMessage && (
			<Text className="text-red-500 mt-2">{errorMessage}</Text>
		)}
	</div>
);
};

const calcDiscount = (price: number, annualPrice: number) => {
	if (price === 0) return 0;
	if (annualPrice === 0) return 100;
	const twelveMonths = price * 12;
	return Math.round(((twelveMonths - annualPrice) / twelveMonths * 100) * 10) / 10;
}

export default function TierForm({ tier: tierObj }: TierFormProps) {
	const [tier, setTier] = useState<TierWithFeatures>((tierObj ? tierObj : newTier()) as Tier);

	const [selectedFeatureIds, setSelectedFeatureIds] = useState<Set<string>>(new Set<string>());
	const [versionedAttributesChanged, setVersionedAttributesChanged] = useState(false);
	const [tierSubscriberCount, setTierSubscriberCount] = useState(0);
	const [currentRevisionSubscriberCount, setCurrentRevisionSubscriberCount] = useState(0);
	const [versions, setVersions] = useState<TierVersionWithFeatures[]>([]);
	const [featuresChanged, setFeaturesChanged] = useState(false);
	const [featureObjs, setFeatureObjs] = useState<Feature[]>([]);
	const [trialEnabled, setTrialEnabled] = useState(tier?.trialDays > 0);
	const [annualPlanEnabled, setAnnualPlanEnabled] = useState(tier?.priceAnnual ? tier.priceAnnual > 0 : false);
	const [annualDiscountPercent, setAnnualDiscountPercent] = useState(calcDiscount(tier.price, tier.priceAnnual || 0));

	const newRecord = !tier?.id;
	const tierHasSubscribers = currentRevisionSubscriberCount > 0;

	const formTitle = newRecord ? 'Create New Tier' : tier.name;
	const buttonLabel = newRecord ? 'Create Tier' : 'Update Tier';

	const [errors, setErrors] = useState<any>({});
	const [isSaving, setIsSaving] = useState(false);

	const { isAdmin } = useCurrentSession();

	const handleInputChange = (
		name: string,
		value: number | string | null,

	) => {
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
				await attachMany({ referenceId: savedTier.id, featureIds: Array.from(selectedFeatureIds) }, 'tier');
			} else {
				savedTier = await updateTier(tier.id as string, tier, Array.from(selectedFeatureIds));
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
		if (tierObj) {
			// call the refreshOnboarding function if it exists
			if (window?.hasOwnProperty('refreshOnboarding')) {
				(window as any)['refreshOnboarding']();
			}
		}
		userHasStripeAccountIdById().then((value: boolean) => {
			setCanPublish(value)
			setCanPublishLoading(false);
		});
	}, []);

	useEffect(() => {
		if (tier.id) {
			getVersionsByTierId(tier.id).then(setVersions);
			subscriberCount(tier.id).then(setTierSubscriberCount);

			subscriberCount(tier.id, tier.revision).then(setCurrentRevisionSubscriberCount);
		}
	}, [tier.id, tier.revision]);

	useEffect(() => {
		if (tier && tierObj) {
			if (tierObj.published === true && Number(tierObj.price) !== Number(tier.price)) {
				setVersionedAttributesChanged(true);
			}
			// shouldCreateNewVersion(tierObj as Tier, tier).then(ret => {
			// 	setVersionedAttributesChanged(ret);
			// });
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
							<Link href="/tiers" className="underline">← All Tiers</Link>
							<PageHeading title={formTitle} />
						</div>
						<div>
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
							onValueChange={(v) => handleInputChange('name', v)}

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
							onValueChange={(v) => handleInputChange('tagline', v)}
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
							onValueChange={(v) => handleInputChange('tierDescription', v)}
						/>
					</div>

					<div className="mb-4">
						<div className="mb-4">
							<label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Billing type</label>
							<Select
								id="cadence"
								placeholder="Billing type"
								required
								name="cadence"
								value={tier.cadence || 'month'}
								onValueChange={(v) => handleInputChange('cadence', v)}
							>
								<SelectItem value="month">Recurring</SelectItem>
								{/*
								<SelectItem value="year">year</SelectItem>
								<SelectItem value="quarter">quarter</SelectItem>
								*/}
								<SelectItem value="once">One Time</SelectItem>
							</Select>
						</div>

						<div className="mb-4">
							<label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Monthly Price (USD)</label>
							<Flex className='gap-2' justifyContent='start'>
								<NumberInput value={tier.price} name="price" placeholder="Enter price" enableStepper={false} onValueChange={(v) => {

									const updatedTier = {
										...tier,
										price: v,

									} as Tier;

									if (annualPlanEnabled) {
										setAnnualDiscountPercent(calcDiscount(v, tier.priceAnnual || 0));
									}

									setTier(updatedTier);
								}} />
							</Flex>
						</div>

						{tier.cadence === 'month' && <>
							<div className="flex gap-2 mb-4">
								<input type="checkbox"
									className="border-gray-600 rounded-md p-3 accent-green-400"
									id="annualPlanEnabled" checked={annualPlanEnabled} onChange={(e) => {
										setAnnualPlanEnabled(e.target.checked);

										if (e.target.checked) {
											handleInputChange('priceAnnual', tier.priceAnnual || tier.price * 12);
											setAnnualDiscountPercent(0);
										} else {
											handleInputChange('priceAnnual', 0);
											setAnnualDiscountPercent(0);
										}
									}} />
								<label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Offer Annual Plan</label>
							</div>

							{annualPlanEnabled &&
								<div className="mb-4">
									<label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">
										Annual Price
										&nbsp;
									</label>
									<NumberInput
										id="priceAnnual"
										placeholder="Annual price (dollars)"
										required
										name="priceAnnual"
										disabled={!annualPlanEnabled}
										enableStepper={false}
										error={!!tier.priceAnnual && tier.price * 12 < (tier.priceAnnual || 0)}
										errorMessage={`Your annual plan is equal to or more expensive than the Monthly Plan x 12 (${tier.price * 12}). Please adjust.`}
										value={tier.priceAnnual || undefined}
										onValueChange={(v) => {
											handleInputChange('priceAnnual', v)
											setAnnualDiscountPercent(calcDiscount(tier.price, v));
										}}
									/>
									<label className="block my-1 text-sm font-medium text-gray-600">
										Effective Discount Rate: {annualDiscountPercent ? annualDiscountPercent + "%" : "0%"} (compared to annualized monthly {<>${tier.price * 12}</>})
									</label>
								</div>
							}


							<div className="mb-4">
								{/* <NumberInput
										id="annualDiscountPercent"
										placeholder="Annual Discount (%)"
										readOnly={true}
										disabled={!annualPlanEnabled}
										required
										name="annualDiscountPercent"
										value={annualDiscountPercent}
									/> */}
							</div>

							<div className="flex gap-2 mb-4">
								<input type="checkbox"
									className="border-gray-600 rounded-md p-3 accent-green-400"
									id="trialEnabled" checked={trialEnabled} onChange={(e) => setTrialEnabled(e.target.checked)} />
								<label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Offer Trial Period</label>
							</div>

							{trialEnabled &&
								<div className="mb-4">
									<label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Trial Length (Days)</label>
									<NumberInput
										id="trialDays"
										placeholder="Annual price (dollars)"
										required
										name="trialDays"
										disabled={!trialEnabled}
										value={tier.trialDays || 0}
										onValueChange={(v) => handleInputChange('trialDays', v)}
									/>
								</div>
							}
						</>}
					</div>


					<div className="mb-4">
						<label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Tier Status</label>
						<label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">
							<Flex className='gap-2' justifyContent='start'>

								{canPublishLoading &&
									<>
										<LoadingDots />
										<Text>Checking Stripe Eligiblity</Text>
									</>
								}
								{!canPublishLoading && <>
									<input type="checkbox"
										checked={tier.published}
										className="border-gray-600 rounded-md p-3 accent-green-400"
										disabled={canPublishDisabled}
										onChange={(e) => {
											setTier({ ...tier, published: e.target.checked } as Tier);
										}} />
									<span>
										<label htmlFor="switch" className="text-sm text-gray-900">
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
						<label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Features</label>
						<DashboardCard>

							{tier?.id ?
								<TierFeaturePicker tierId={tier.id} newTier={tier} selectedFeatureIds={selectedFeatureIds} setSelectedFeatureIds={setSelectedFeatureIds} setFeaturesChanged={setFeaturesChanged} setFeatureObjs={setFeatureObjs} /> :
								<TierFeaturePicker newTier={tier} selectedFeatureIds={selectedFeatureIds} setSelectedFeatureIds={setSelectedFeatureIds} setFeatureObjs={setFeatureObjs} />
							}

						</DashboardCard>
					</div>

					{ isAdmin() && tier?.id && <>
						<div className="mb-4">
							<label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Admin Panel</label>
							<DashboardCard>
								View admin-only options: <LinkButton href={`/admin/tiers/${tier.id}`}>Go</LinkButton>
							</DashboardCard>
						</div>
					</>}



					<div className="mb-4">
						<label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Tier Version History</label>

						{!!versions && versions.length === 0 && <Text>{tier.name} has {currentRevisionSubscriberCount === 0 ? "no customers yet" : currentRevisionSubscriberCount + " customers"}. If you make any price or feature changes for a tier that has customers, your changes to the previous tier will be kept as a tier version. Customers will be charged what they originally purchased.</Text>}

						{!!versions && versions.length > 0 &&
							<>
								<Text className="my-4">{tier.name} has {currentRevisionSubscriberCount === 0 ? "no customers yet" : currentRevisionSubscriberCount + " customers"} for the most recent version. There are {versions.length} versions and {tierSubscriberCount} customers across versions.</Text>
								<DashboardCard>
									<Table>
										<TableHead>
											<TableRow className="border-b-2 border-gray-400">
												<TableHeaderCell className="p-1 ps-0 m-0 text-xs font-medium text-gray-500 text-gray-500 uppercase tracking-wider">Created</TableHeaderCell>
												<TableHeaderCell className="p-1 ps-0 m-0 text-xs font-medium text-gray-500 text-gray-500 uppercase tracking-wider">Features</TableHeaderCell>
												<TableHeaderCell className="p-1 ps-0 m-0 text-xs font-medium text-center text-gray-500 text-gray-500 uppercase tracking-wider">Price</TableHeaderCell>
												<TableHeaderCell className="p-1 ps-0 m-0 text-xs font-medium text-center text-gray-500 text-gray-500 uppercase tracking-wider">#Customers</TableHeaderCell>
											</TableRow>
										</TableHead>
										<TableBody>
											<TableRow>
												<TableCell className="p-1 ps-0 m-0">
													{tier.createdAt.toDateString()}
													<Badge color="gray" size="xs" className="ms-1 text-xs font-medium uppercase">Current</Badge>

												</TableCell>
												<TableCell className="p-1 ps-0 m-0">
													{tier.features && tier.features.length > 0 ?
														<>
															<ul>
																{(tier.features || []).map(f => <li key={f.id}>· {f.name}</li>)}
															</ul>
														</> :
														<>&nbsp;None</>
													}
												</TableCell>
												<TableCell className="text-center p-1 ps-0 m-0">
													${tier.price}
												</TableCell>
												<TableCell className="p-1 ps-0 m-0 text-center">
													{currentRevisionSubscriberCount}
												</TableCell>
											</TableRow>
											{versions.map((version) => <TierVersionCard tierVersion={version} key={version.id} />)}
										</TableBody>
									</Table>
								</DashboardCard>

								<Text className="my-4">Please note that tier versions are only recorded when you make feature or price changes to a tier where you have existing customers. Customers will be charged what they originally purchased.</Text>
							</>
						}
					</div>

					{/* TODO: RE-ENABLE DELETING TIERS - CURRENT UX IS TRASH */}
					{/* <label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Admin</label>
					<Button variant="secondary" disabled={tier.id ? false : true} className="w-full" onClick={() => destroyTier(tier.id as string)}>Delete Tier</Button> */}
					<Button
						disabled={isSaving}
						loading={isSaving}
						onClick={onSubmit}
					>
						{buttonLabel}
					</Button>

				</div>

				{/* Preview Section */}
				<div className="md:w-[300px] text-center mb-auto" >
					<label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Preview</label>
					<TierCard tier={tier} features={featureObjs} buttonDisabled={newRecord} />
					{tier.id && tier.published ? <Text className="mt-2">This tier is currently published and available for sale.</Text>
						: <Text className="mt-2">This tier is not published and is not available for sale.</Text>}
					<TierLinkCopier tier={tier} />
				</div>
			</div>
		</>
	);
}