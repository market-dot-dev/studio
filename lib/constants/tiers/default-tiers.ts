type tierData = {
  name: string;
  tagline: string;
  price: number;
  cadence: string;
  description: string;
  checkoutType: "gitwallet" | "contact-form";
};
export type defaultTier = {
  data: tierData;
  metaDescription: string;
};

const defaultTiers = [
  {
    data: {
      name: "Blank",
      tagline: "",
      price: 0,
      cadence: "month",
      description: "",
      checkoutType: "contact-form",
    },
    metaDescription: "A blank package to start from scratch.",
  },
];

const supportTiers = [
  {
    data: {
      name: "Basic Support",
      tagline: "This tier provides base-level project maintainence.",
      price: 3000,
      cadence: "month",
      description: `- Basic open source project maintenance
- Access to private support channels
- Assistance with bug fixes and minor issues
`,
      checkoutType: "contact-form",
    },
    metaDescription: "Provide essential support for your project.",
  },
  {
    data: {
      name: "Premium Support",
      tagline:
        "Ideal for teams that need quicker response times and premium support.",
      price: 5000,
      cadence: "month",
      description: `- All features of Basic Support, plus
- 24 hour response time guarantee
- Monthly office hours for your team
- Regular project status updates and performance monitoring
`,
      checkoutType: "contact-form",
    },
    metaDescription: "Provide premium support and quicker response times.",
  },
  {
    data: {
      name: "Enterprise Support",
      tagline:
        "Comprehensive support ideal for enterprises and larger scale projects",
      price: 8000,
      cadence: "month",
      description: `- All features of Premium Support, plus
- Response time 12 hours across time zones
- Presence in your Slack or Discord server
- Dedicated phone number for support
- Dedicated support engineer
- 1:1 training sessions
- Assistance with major issues and project optimization
- Monthly performance reviews and strategic planning sessions
`,
      checkoutType: "contact-form",
    },
    metaDescription:
      "Provide the highest level of support & rapid response to your customers.",
  },
] as defaultTier[];

const trainingTiers = [
  {
    data: {
      name: "1:1 Training Sessions",
      tagline: "Office-hours style support for teams and individuals",
      price: 3000,
      cadence: "month",
      description: `- Monthly office hours
- Upto 5 hours of training sessions per month
- Access to private repos and training materials
`,
      checkoutType: "contact-form",
    },
    metaDescription:
      "Offer training sessions for users of your open source project.",
  },
  {
    data: {
      name: "Team Training",
      tagline: "Comprehensive training for your entire team",
      price: 5000,
      cadence: "month",
      description: `- Monthly office hours for your team
- Upto 10 hours of pair programming or 1:1 training sessions per month
- Access to private repos and training materials
- Availability in your Slack server
`,
      checkoutType: "contact-form",
    },
    metaDescription:
      "Offer a comprehensive training package to larger companies.",
  },
] as defaultTier[];

const consultingTiers = [
  {
    data: {
      name: "Performance Consulting",
      tagline: "Optimize your project's performance",
      price: 10000,
      cadence: "once",
      description: `This package will help you optimize your web or mobile app performance. It includes:
- Guidance on how to instrument your code for performance monitoring
- Performance audits
- Recommendations for performance enhancements
- Regular performance reports`,
      checkoutType: "contact-form",
    },
    metaDescription:
      "Offer performance optimization services for a specific ecosystem.",
  },
  {
    data: {
      name: "Security Audits",
      tagline: "Regular security audits and vulnerability assessments",
      price: 15000,
      cadence: "once",
      description: `This package will help you optimize your project's performance. It includes:
- One time vulnerability assessment for your codebase
- Package dependency scanning
- License compliance checks
- Penetration testing
- Setting up security monitoring tools
`,
      checkoutType: "contact-form",
    },
    metaDescription: "Offer security auditing services for a specific .",
  },
] as defaultTier[];

export const categorizedTiers = [
  {
    name: "Default",
    tiers: defaultTiers,
  },
  {
    name: "Support",
    tiers: supportTiers,
  },
  {
    name: "Training",
    tiers: trainingTiers,
  },
  {
    name: "Consulting",
    tiers: consultingTiers,
  },
];

export default categorizedTiers.map(({ tiers }) => tiers).flat();
