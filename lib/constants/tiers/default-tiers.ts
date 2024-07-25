export type defaultTier = {
	name: string;
	tagline: string;
	price: number;
	cadence: string;
	description: string;
}

const supportTiers = [
	// Support Tiers
	{
		name: "Basic Support",
		tagline: "Basic support for your project",
		price: 3000,
		cadence: "month",
		description: 
`- Basic support
- Working hours: 10:00 - 16:00
- Response time: 48 hours
- Support via email
`
	},
	{
		name: "Standard Support",
		tagline: "Standard support for your project",
		price: 5000,
		cadence: "month",
		description: 
`- Standard support
- Working hours: 9:00 - 17:00
- Response time: 24 hours
- Support via email
- Support via chat
`
	},
	{
		name: "Premium Support",
		tagline: "Premium support for your project",
		price: 8000,
		cadence: "month",
		description: 
`- Premium support
- Working hours: 8:00 - 18:00
- Response time: 12 hours
- Support via email
- Support via chat
- Support via phone
`
	}
] as defaultTier[];

const trainingTiers = [
	// Training Tiers
	{
		name: "Basic Training",
		tagline: "Basic training for your team",
		price: 3000,
		cadence: "month",
		description: 
`- Basic training
- Working hours: 10:00 - 16:00
- Response time: 48 hours
- Training via email
`
	},
	{
		name: "Standard Training",
		tagline: "Standard training for your team",
		price: 5000,
		cadence: "month",
		description: 
`- Standard training
- Working hours: 9:00 - 17:00
- Response time: 24 hours
- Training via email
- Training via chat
`
	},
	{
		name: "Premium Training",
		tagline: "Premium training for your team",
		price: 8000,
		cadence: "month",
		description: 
`- Premium training
- Working hours: 8:00 - 18:00
- Response time: 12 hours
- Training via email
- Training via chat
- Training via video calls
`
	}
] as defaultTier[];

const consultingTiers = [
	// Consulting Tiers
	{
		name: "Basic Consulting",
		tagline: "Basic consulting for your project",
		price: 3000,
		cadence: "month",
		description: 
`- Basic consulting
- Working hours: 10:00 - 16:00
- Response time: 48 hours
- Consulting via email
`
	},
	{
		name: "Standard Consulting",
		tagline: "Standard consulting for your project",
		price: 5000,
		cadence: "month",
		description: 
`- Standard consulting
- Working hours: 9:00 - 17:00
- Response time: 24 hours
- Consulting via email
- Consulting via chat
`
	},
	{
		name: "Premium Consulting",
		tagline: "Premium consulting for your project",
		price: 8000,
		cadence: "month",
		description: 
`- Premium consulting
- Working hours: 8:00 - 18:00
- Response time: 12 hours
- Consulting via email
- Consulting via chat
- Consulting via video calls
`
	}
] as defaultTier[];

export const categorizedTiers = [
	{
		name: "Support",
		tiers: supportTiers
	},
	{
		name: "Training",
		tiers: trainingTiers
	},
	{
		name: "Consulting",
		tiers: consultingTiers
	}
]

export default categorizedTiers.map(({tiers}) => tiers).flat();


