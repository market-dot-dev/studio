import Prospect, { ProspectData, QualificationStatus, TimelineActivity, CompanyData } from "../models/Prospect";

// Mock prospect database
const mockProspects: ProspectData[] = [
  {
    id: "prospect-123",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    company: "Acme Corp",
    jobTitle: "VP of Engineering",
    linkedinUrl: "https://linkedin.com/in/janesmith",
    twitterUrl: "https://twitter.com/janesmith",
    websiteUrl: "https://janesmith.com",
    bio: "Experienced tech leader with 15+ years in SaaS. Looking for solutions to scale our engineering team.",
    bioSources: ["linkedin", "twitter", "website"],
    interestedPackage: "Enterprise Plan",
    qualificationStatus: "qualified",
    qualificationReason: "Large enterprise with over 500 employees. Already using our competitor's product and looking to switch.",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),  // 2 days ago
    timeline: [
      {
        type: "initialContact",
        title: "Reached out",
        date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Submitted contact form on your website",
        notes: "Looking for a solution to manage our growing engineering team of 50+ developers. Currently using XYZ but experiencing scaling issues."
      },
      {
        type: "startedQualification",
        title: "Started qualifying",
        date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Pulling & analyzing their info to see if they're a fit",
      },
      {
        type: "completedQualification",
        title: "Finished qualifying",
        date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000 + 2 * 60 * 1000).toISOString(),
        notes: "Has budget approval for Q1 implementation. Decision committee includes CTO and 2 engineering directors."
      }
    ],
    companyData: {
      name: "Acme Corporation",
      industry: "Enterprise Software",
      size: "501-1000 employees",
      website: "https://acmecorp.example.com",
      funding: "$75M",
      series: "C",
      description: "Acme Corporation is a leading provider of cloud-based enterprise software solutions. Founded in 2010, they specialize in data analytics and business intelligence tools for Fortune 500 companies."
    }
  },
  {
    id: "prospect-456",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    company: "TechStart Inc",
    jobTitle: "Founder & CEO",
    linkedinUrl: "https://linkedin.com/in/alexjohnson",
    twitterUrl: "https://twitter.com/alexj",
    websiteUrl: "https://techstart.io",
    bio: "Serial entrepreneur with 3 successful exits. Building a new SaaS platform for remote teams.",
    interestedPackage: "Growth Plan",
    qualificationStatus: "notQualified",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "prospect-789",
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    company: "Global Innovations",
    jobTitle: "CTO",
    linkedinUrl: "https://linkedin.com/in/sarahw",
    bio: "Technology leader focused on AI and machine learning solutions.",
    interestedPackage: "Enterprise Plan",
    qualificationStatus: "disqualified",
    qualificationReason: "Budget constraints - looking for a solution under $5k/year",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days ago
  },
  {
    id: "prospect-101",
    name: "Michael Chen",
    email: "mchen@example.com",
    company: "DevOps Pro",
    jobTitle: "Lead Developer",
    linkedinUrl: "https://linkedin.com/in/michaelchen",
    websiteUrl: "https://michaelchen.dev",
    bio: "Full-stack developer with expertise in cloud infrastructure and DevOps pipelines.",
    interestedPackage: "Team Plan",
    qualificationStatus: "qualified",
    qualificationReason: "Perfect fit for our developer tools. Has budget approval and ready to start implementation.",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  },
  {
    id: "prospect-202",
    name: "Emily Rodriguez",
    email: "emily.r@example.com",
    company: "Marketing Masters",
    jobTitle: "Product Manager",
    qualificationStatus: "notQualified",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    timeline: [
      {
        type: "initialContact",
        title: "Initial Contact",
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Submitted contact form on website"
      },
      {
        type: "startedQualification",
        title: "Started Qualifying",
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
        description: "Pulling & analyzing their info to see if they're a fit"
      },
      {
        type: "completedQualification",
        title: "Finished Qualifying",
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 32 * 60 * 1000).toISOString(),
        notes: "Small company with limited budget"
      }
    ]
  },
  {
    id: "prospect-303",
    name: "David Kim",
    email: "dkim@example.com",
    company: "FinTech Solutions",
    jobTitle: "Head of Engineering",
    linkedinUrl: "https://linkedin.com/in/davidkim",
    twitterUrl: "https://twitter.com/dkim_tech",
    bio: "Building scalable financial technology platforms with a focus on security and reliability.",
    interestedPackage: "Enterprise Plan",
    qualificationStatus: "qualified",
    qualificationReason: "Enterprise client with immediate need and budget already allocated.",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
  },
  {
    id: "prospect-404",
    name: "Olivia Thompson",
    email: "olivia.t@example.com",
    company: "Marketing Wizards",
    jobTitle: "Digital Marketing Director",
    interestedPackage: "Standard Plan",
    qualificationStatus: "disqualified",
    qualificationReason: "Not a good fit - looking for more marketing-focused tools than we provide.",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days ago
  }
];

class MockProspectService {
  // Get all prospects
  static async getAllProspects(): Promise<Prospect[]> {
    return mockProspects.map(data => new Prospect(data));
  }

  // Get a prospect by ID
  static async getProspectById(id: string): Promise<Prospect | null> {
    const prospectData = mockProspects.find(p => p.id === id);
    return prospectData ? new Prospect(prospectData) : null;
  }

  // Get prospects by qualification status
  static async getProspectsByStatus(status: QualificationStatus): Promise<Prospect[]> {
    return mockProspects
      .filter(p => p.qualificationStatus === status)
      .map(data => new Prospect(data));
  }

  // Update a prospect (mock implementation)
  static async updateProspect(id: string, updates: Partial<ProspectData>): Promise<Prospect | null> {
    const index = mockProspects.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    // In a real app, this would update the database
    mockProspects[index] = {
      ...mockProspects[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return new Prospect(mockProspects[index]);
  }

  // Add a new prospect (mock implementation)
  static async addProspect(data: Omit<ProspectData, 'id' | 'createdAt' | 'updatedAt'>): Promise<Prospect> {
    const now = new Date().toISOString();
    const newProspect: ProspectData = {
      ...data,
      id: `prospect-${Math.floor(Math.random() * 1000)}`,
      createdAt: now,
      updatedAt: now
    };
    
    // In a real app, this would insert to the database
    mockProspects.push(newProspect);
    
    return new Prospect(newProspect);
  }
}

export default MockProspectService; 