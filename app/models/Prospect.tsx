export type QualificationStatus = 'unqualified' | 'qualified' | 'disqualified';

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
  interestedPackage?: string;
  qualificationStatus: QualificationStatus;
  qualificationReason?: string;
  createdAt: string;
  updatedAt: string;
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
  interestedPackage?: string;
  qualificationStatus: QualificationStatus;
  qualificationReason?: string;
  createdAt: Date;
  updatedAt: Date;

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
    this.interestedPackage = data.interestedPackage;
    this.qualificationStatus = data.qualificationStatus;
    this.qualificationReason = data.qualificationReason;
    this.createdAt = new Date(data.createdAt);
    this.updatedAt = new Date(data.updatedAt);
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

  get isUnqualified(): boolean {
    return this.qualificationStatus === 'unqualified';
  }
}

export default Prospect; 