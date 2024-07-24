export type defaultTier = {
	name: string;
	tagline: string;
	description: string;
}

const defaultTiers = [
	{
		name: "Support",
		tagline: "Support for your project",
		description: 
`- Professional support
- Working hours: 9:00 - 17:00
- Response time: 24 hours
- Support via email
- Support via chat
`
	},
	{
		name: "Training",
		tagline: "Training for your team",
		description: 
`- Professional training
- Working hours: 9:00 - 17:00
- Response time: 24 hours
- Training via email
- Training via chat
`
	},
	{
		name: "Consulting",
		tagline: "Consulting for your project",
		description: 
`- Professional consulting
- Working hours: 9:00 - 17:00
- Response time: 24 hours
- Consulting via email
- Consulting via chat
`
	}
] as defaultTier[];

export default defaultTiers;