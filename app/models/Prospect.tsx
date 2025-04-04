export type QualificationStatus = 'notQualified' | 'qualified' | 'disqualified';

export interface TimelineActivity {
  type: 'initialContact' | 'startedQualification' | 'completedQualification' | 'followup';
  title: string;
  date: string;
  description?: string;
  notes?: string;
}

export interface CompanyData {
  name?: string;
  industry?: string;
  size?: string;
  website?: string;
  funding?: string;
  series?: string;
  description?: string;
}

export interface ProspectData {
  id: string;
  name: string;
  email: string;
  company?: string;
  jobTitle?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
  bio?: string;
  bioSources?: string[];
  interestedPackage?: string;
  qualificationStatus: QualificationStatus;
  qualificationReason?: string;
  createdAt: string;
  updatedAt: string;
  timeline?: TimelineActivity[];
  companyData?: CompanyData;
}

class Prospect {
  id: string;
  name: string;
  email: string;
  company?: string;
  jobTitle?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
  bio?: string;
  bioSources?: string[];
  interestedPackage?: string;
  qualificationStatus: QualificationStatus;
  qualificationReason?: string;
  createdAt: Date;
  updatedAt: Date;
  timeline?: TimelineActivity[];
  companyData?: CompanyData;

  constructor(data: ProspectData) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.company = data.company;
    this.jobTitle = data.jobTitle;
    this.linkedinUrl = data.linkedinUrl;
    this.twitterUrl = data.twitterUrl;
    this.websiteUrl = data.websiteUrl;
    this.bio = data.bio;
    this.bioSources = data.bioSources;
    this.interestedPackage = data.interestedPackage;
    this.qualificationStatus = data.qualificationStatus;
    this.qualificationReason = data.qualificationReason;
    this.createdAt = new Date(data.createdAt);
    this.updatedAt = new Date(data.updatedAt);
    this.timeline = data.timeline;
    this.companyData = data.companyData;
  }

  get formattedCreatedAt(): string {
    return this.createdAt.toLocaleDateString();
  }

  get isQualified(): boolean {
    return this.qualificationStatus === 'qualified';
  }

  get isDisqualified(): boolean {
    return this.qualificationStatus === 'disqualified';
  }

  get isNotQualified(): boolean {
    return this.qualificationStatus === 'notQualified';
  }
}

export default Prospect; 