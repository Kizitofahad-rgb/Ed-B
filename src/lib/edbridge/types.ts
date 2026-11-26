export type CollegeCode =
  "CoCIS" | "CEDAT" | "CHUSS" | "CAES" | "CONAS" | "CEES" | "COBAMS" | "CHS";

export type CommunityKind = "college" | "course" | "school-alumni" | "organization" | "club";

export interface Community {
  id: string;
  name: string;
  short: string;
  kind: CommunityKind;
  tagline: string;
  members: number;
  studentsHelped: number;
  mentorshipSessions: number;
  opportunitiesCreated: number;
  resourcesShared: number;
  accent: "primary" | "connection" | "cyan" | "success";
}

export type PersonRole = "student" | "supporter" | "mentor" | "alumni" | "organization";

export interface Person {
  id: string;
  name: string;
  role: PersonRole;
  headline: string;
  college?: CollegeCode;
  course?: string;
  year?: number;
  secondarySchool?: string;
  communities: string[];
  skills: string[];
  offers: SupportType[];
  verified: boolean;
  trustScore: number;
  bio: string;
  photoKey?: string;
}

export type SupportType =
  "financial" | "mentorship" | "resource" | "opportunity" | "referral" | "amplification";

export type DisclosureLevel = "shielded-alias" | "circle-trusted" | "public-verified";

export type AudienceScope = "alumni-mentors-only" | "my-communities" | "full-network";

export type DisbursementMode = "direct-bursar" | "direct-vendor" | "milestone-stipend";

export interface RequestUpdate {
  id: string;
  authorLabel: string;
  date: string;
  milestoneTag: string;
  message: string;
  isGratitude?: boolean;
}

export type RequestCategory =
  | "Tuition"
  | "Academic Resources"
  | "Laptop / Equipment"
  | "Medical / Emergency"
  | "Accommodation"
  | "Mentorship"
  | "Career / Internship"
  | "Other";

export type VerificationState = "pending" | "verified" | "needs-info" | "rejected";

export interface SupportRequest {
  id: string;
  personId: string;
  title: string;
  category: RequestCategory;
  need: string;
  why: string;
  amountNeeded?: number;
  amountRaised?: number;
  resourceNeeded?: string;
  deadlineDays: number;
  supporters: number;
  supportTypes: SupportType[];
  status: VerificationState;
  checks: { identity: boolean; studentStatus: boolean; documents: boolean; humanReview: boolean };
  createdAt: string;
  disclosureLevel: DisclosureLevel;
  audienceScope: AudienceScope;
  disbursementMode: DisbursementMode;
  aliasLabel: string;
  matchingSponsor?: string;
  updates: RequestUpdate[];
  referringPartnerId?: string;
  referringPartnerName?: string;
  consentRecord?: {
    informedOfPurpose: boolean;
    nonGuaranteeAcknowledged: boolean;
    consentedAt: string;
  };
}

export interface Opportunity {
  id: string;
  title: string;
  org: string;
  kind:
    | "Student Business"
    | "Internship"
    | "Scholarship"
    | "Mentorship"
    | "Competition"
    | "Part-time"
    | "Training"
    | "Hackathon";
  location: string;
  compensation: string;
  closesInDays: number;
  deadlineDate?: string;
  summary: string;
  matchReason: string;
  communities: string[];
  fundingPartner?: string;
  eligibilityCriteria?: string[];
  applicationSteps?: string[];
  fairAccessNotice?: string;
  partnerId?: string;
  businessCategory?: string;
  founderLabel?: string;
  patronsCount?: number;
  boostedCount?: number;
  hiringStudents?: boolean;
  hiringNote?: string;
  productsOrServices?: string[];
  imageUrl?: string;
}

export interface Organization {
  id: string;
  name: string;
  kind: string;
  studentsReached: number;
  campaigns: number;
  mentorshipSessions: number;
  opportunitiesCreated: number;
  blurb: string;
  planTier: string;
}

export type PartnerAgreementStatus = "proposed-framework" | "pilot-active" | "mou-signed";

export interface PartnerCommitment {
  area:
    | "Transparency"
    | "Accountability"
    | "Student welfare"
    | "Data protection"
    | "Fair access"
    | "Institutional respect"
    | "Sustainability";
  mutualCommitment: string;
  platformControl: string;
}

export interface PartnerNextStep {
  id: string;
  label: string;
  done: boolean;
}

export interface StakeholderPartner {
  id: string;
  name: string;
  shortName: string;
  kind: string;
  blurb: string;
  planTier: string;
  status: PartnerAgreementStatus;
  authorization: {
    nameAndLogoAuthorized: boolean;
    databaseAccessProhibited: true;
    zeroFinancialLiability: true;
    independentGovernancePreserved: true;
    voluntaryConsentRequired: true;
  };
  focalPersons: {
    partnerFocal: string;
    partnerRole: string;
    edBridgeFocal: string;
    lastJointMeeting?: string;
  };
  hallsAndColleges: string[];
  metrics: {
    studentsReached: number;
    referralsSubmitted: number;
    verificationsConfirmed: number;
    bursariesMatched: number;
    capacitySessions: number;
    campaigns: number;
    mentorshipSessions: number;
  };
  commitments: PartnerCommitment[];
  nextSteps: PartnerNextStep[];
}

export interface StudentReferral {
  id: string;
  partnerId: string;
  aliasLabel: string;
  hallOrCollege: string;
  courseAndYear: string;
  category: RequestCategory;
  shielded: boolean;
  consentConfirmed: boolean;
  nonGuaranteeAcknowledged: boolean;
  consentScopeNote: string;
  referralSummary: string;
  membershipVerificationStatus:
    "pending-partner-check" | "confirmed-with-consent" | "routed-to-aid";
  referredByFocal: string;
  createdAt: string;
  linkedRequestId?: string;
}

export interface JointFundRecord {
  id: string;
  partnerId: string;
  referenceCode: string;
  title: string;
  beneficiaryAlias: string;
  settlementChannel: string;
  amountVerified: number;
  partnerSignOff: string;
  edBridgeSignOff: string;
  date: string;
  verified: boolean;
}

export type Privacy = "private" | "recognized" | "public";

export interface ImpactEvent {
  id: string;
  date: string;
  type: SupportType | "join" | "verification";
  label: string;
  detail: string;
  privacy: Privacy;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  at: string;
  read: boolean;
  tone: "match" | "support" | "verification" | "impact" | "opportunity";
}

export interface Recommendation {
  personId: string;
  relevance: number;
  reasons: string[];
}

export interface ProofOfImpactRecord {
  id: string;
  studentId: string;
  studentName: string;
  type: "fee_receipt" | "academic_report" | "certificate" | "progress_update";
  title: string;
  date: string;
  fileLabel: string;
  amountVerified?: number;
  note?: string;
  verified: boolean;
}
