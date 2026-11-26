import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  AUDIENCE_META,
  CURRENT_USER_ID,
  DISBURSEMENT_META,
  DISCLOSURE_META,
  STANDARD_NON_GUARANTEE_NOTICE,
  communitiesById,
  createStandardCommitments,
  createStandardNextSteps,
  opportunities as seedOpportunities,
  people,
  peopleById,
  seedImpact,
  seedJointFundLedger,
  seedNotifications,
  seedProofItems,
  seedReferrals,
  seedStakeholderPartners,
  supportRequests as seedRequests,
  ugx,
} from "./data";
import type {
  AppNotification,
  AudienceScope,
  DisbursementMode,
  DisclosureLevel,
  ImpactEvent,
  JointFundRecord,
  Opportunity,
  PartnerAgreementStatus,
  Privacy,
  ProofOfImpactRecord,
  RequestCategory,
  RequestUpdate,
  StakeholderPartner,
  StudentReferral,
  SupportRequest,
  SupportType,
  VerificationState,
} from "./types";

export type DemoRole = "visitor" | "student" | "supporter" | "community" | "organization" | "admin";

interface State {
  role: DemoRole;
  requests: SupportRequest[];
  impact: ImpactEvent[];
  notifications: AppNotification[];
  joinedCommunities: string[];
  connections: string[];
  mentorships: string[];
  savedOpportunities: string[];
  appliedOpportunities: string[];
  proofItems: ProofOfImpactRecord[];
  stakeholderPartners: StakeholderPartner[];
  referrals: StudentReferral[];
  jointFundLedger: JointFundRecord[];
  opportunities: Opportunity[];
  onboarded: boolean;
  supporterStreakMonths: number;
}

interface Ctx extends State {
  user: (typeof people)[number];
  setRole: (r: DemoRole) => void;
  completeOnboarding: (opts?: {
    name?: string;
    institution?: string;
    field?: string;
    defaultShielded?: boolean;
  }) => void;
  supportFinancially: (
    requestId: string,
    amount: number,
    privacy: Privacy,
    paymentRail?: string,
    encouragementNote?: string,
  ) => void;
  offerSupport: (
    requestId: string,
    type: Exclude<SupportType, "financial">,
    privacy: Privacy,
    note?: string,
  ) => void;
  postRequestUpdate: (
    requestId: string,
    milestoneTag: string,
    message: string,
    isGratitude: boolean,
  ) => void;
  joinCommunity: (id: string) => void;
  toggleConnection: (personId: string) => void;
  toggleSaveOpportunity: (opportunityId: string) => void;
  applyOpportunity: (opportunityId: string, title: string) => void;
  addProofItem: (
    type: ProofOfImpactRecord["type"],
    title: string,
    fileLabel: string,
    note?: string,
  ) => void;
  createRequest: (r: {
    title: string;
    category: SupportRequest["category"];
    need: string;
    why: string;
    amountNeeded?: number;
    deadlineDays: number;
    supportTypes: SupportType[];
    disclosureLevel?: DisclosureLevel;
    audienceScope?: AudienceScope;
    disbursementMode?: DisbursementMode;
    referringPartnerId?: string;
    referringPartnerName?: string;
    consentConfirmed?: boolean;
  }) => string;
  updateRequestStatus: (requestId: string, status: VerificationState) => void;
  onboardStakeholderPartner: (input: {
    name: string;
    shortName: string;
    kind: string;
    blurb: string;
    partnerFocal: string;
    partnerRole: string;
    hallsAndColleges: string[];
    authorizeBrandingNow: boolean;
  }) => string;
  togglePartnerNextStep: (partnerId: string, stepId: string) => void;
  togglePartnerBrandingAuth: (partnerId: string) => void;
  advancePartnerStatus: (partnerId: string, status: PartnerAgreementStatus) => void;
  updatePartnerFocalPersons: (
    partnerId: string,
    partnerFocal: string,
    edBridgeFocal: string,
  ) => void;
  submitConsentedReferral: (input: {
    partnerId: string;
    hallOrCollege: string;
    courseAndYear: string;
    category: RequestCategory;
    shielded: boolean;
    consentConfirmed: boolean;
    nonGuaranteeAcknowledged: boolean;
    referralSummary: string;
    amountNeeded?: number;
    alsoCreateShieldedRequest?: boolean;
  }) => string;
  confirmReferralMembership: (referralId: string) => void;
  publishPartnerOpportunity: (input: {
    partnerId: string;
    title: string;
    kind: Opportunity["kind"];
    location: string;
    compensation: string;
    closesInDays: number;
    summary: string;
    eligibilityCriteria: string[];
    applicationSteps: string[];
  }) => string;
  createStudentBusiness: (input: {
    title: string;
    businessCategory: string;
    founderLabel: string;
    location: string;
    compensation: string;
    summary: string;
    productsOrServices: string[];
    hiringStudents: boolean;
    hiringNote?: string;
    communities?: string[];
  }) => string;
  supportStudentBusiness: (
    businessId: string,
    action: "patronize" | "boost" | "refer-peer",
    note?: string,
  ) => void;
  markAllRead: () => void;
  totals: {
    studentsSupported: number;
    mentorships: number;
    referrals: number;
    resources: number;
    communities: number;
    amount: number;
  };
  reset: () => void;
}

const KEY = "edbridge.prototype.v3";
const C = createContext<Ctx | null>(null);

const initial: State = {
  role: "visitor",
  requests: seedRequests,
  impact: seedImpact,
  notifications: seedNotifications,
  joinedCommunities: ["cocis", "cs", "busia-alumni"],
  connections: ["p-amina", "p-david", "p-sarah", "p-hassan"],
  mentorships: ["p-joel"],
  savedOpportunities: ["o-1"],
  appliedOpportunities: [],
  proofItems: seedProofItems,
  stakeholderPartners: seedStakeholderPartners,
  referrals: seedReferrals,
  jointFundLedger: seedJointFundLedger,
  opportunities: seedOpportunities,
  onboarded: false,
  supporterStreakMonths: 4,
};

const supportLabel: Record<string, string> = {
  mentorship: "Offered mentorship",
  resource: "Offered a resource / equipment loan",
  opportunity: "Referred a student business or bursary",
  referral: "Made a warm referral",
  amplification: "Amplified to community circle",
};

export function EdBridgeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initial);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...initial, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  const update = useCallback((fn: (s: State) => State) => {
    setState((prev) => {
      const next = fn(prev);
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const today = () => new Date().toISOString().slice(0, 10);
  const uid = () => Math.random().toString(36).slice(2, 9);

  const notify = (s: State, n: Omit<AppNotification, "id" | "at" | "read">): AppNotification[] => [
    { ...n, id: uid(), at: "Just now", read: false },
    ...s.notifications,
  ];

  const supportFinancially: Ctx["supportFinancially"] = (
    requestId,
    amount,
    privacy,
    paymentRail = "Direct Bursar (MTN MoMo)",
    encouragementNote = "",
  ) =>
    update((s) => {
      const req = s.requests.find((r) => r.id === requestId);
      if (!req) return s;
      const studentLabel =
        req.disclosureLevel === "shielded-alias"
          ? req.aliasLabel
          : (peopleById[req.personId]?.name ?? req.aliasLabel);

      const previousRaised = req.amountRaised ?? 0;
      const nextRaised = previousRaised + amount;
      const target = req.amountNeeded ?? 0;

      let milestoneUpdate: RequestUpdate | null = null;
      if (target > 0) {
        const prevPct = (previousRaised * 100) / target;
        const nextPct = (nextRaised * 100) / target;
        if (prevPct < 100 && nextPct >= 100) {
          milestoneUpdate = {
            id: `u-${uid()}`,
            authorLabel: "Ed-Bridge Milestone",
            date: "Just now",
            milestoneTag: "100% Funded!",
            message: `Goal reached! Funds are queued for ${DISBURSEMENT_META[req.disbursementMode].badge}.`,
          };
        } else if (prevPct < 75 && nextPct >= 75) {
          milestoneUpdate = {
            id: `u-${uid()}`,
            authorLabel: "Ed-Bridge Milestone",
            date: "Just now",
            milestoneTag: "75% Milestone",
            message: `75% of the ${req.category.toLowerCase()} target is now covered!`,
          };
        } else if (prevPct < 50 && nextPct >= 50) {
          milestoneUpdate = {
            id: `u-${uid()}`,
            authorLabel: "Ed-Bridge Milestone",
            date: "Just now",
            milestoneTag: "50% Milestone",
            message:
              "Halfway milestone reached! Every contribution moves this student closer to exams.",
          };
        }
      }

      const noteUpdate: RequestUpdate | null = encouragementNote.trim()
        ? {
            id: `u-${uid()}`,
            authorLabel: privacy === "private" ? "Private Supporter" : "Verified Supporter",
            date: "Just now",
            milestoneTag: "Encouragement",
            message: encouragementNote.trim(),
          }
        : null;

      const addedUpdates = [milestoneUpdate, noteUpdate].filter(Boolean) as RequestUpdate[];

      return {
        ...s,
        requests: s.requests.map((r) =>
          r.id === requestId
            ? {
                ...r,
                amountRaised: nextRaised,
                supporters: r.supporters + 1,
                updates: [...addedUpdates, ...r.updates],
              }
            : r,
        ),
        connections: s.connections.includes(req.personId)
          ? s.connections
          : [...s.connections, req.personId],
        impact: [
          {
            id: uid(),
            date: today(),
            type: "financial",
            label: `Direct settlement via ${paymentRail}`,
            detail: `${studentLabel} — ${req.title} (${ugx(amount)})`,
            privacy,
          },
          ...s.impact,
        ],
        notifications: notify(s, {
          title: `Impact recorded (${ugx(amount)})`,
          body: `Simulated ${paymentRail} settlement to ${studentLabel} added to your Impact Passport.`,
          tone: "impact",
        }),
      };
    });

  const offerSupport: Ctx["offerSupport"] = (requestId, type, privacy, note) =>
    update((s) => {
      const req = s.requests.find((r) => r.id === requestId);
      if (!req) return s;
      const studentLabel =
        req.disclosureLevel === "shielded-alias"
          ? req.aliasLabel
          : (peopleById[req.personId]?.name ?? req.aliasLabel);
      const label = supportLabel[type] ?? "Offered support";
      const updateEntry: RequestUpdate = {
        id: `u-${uid()}`,
        authorLabel: privacy === "private" ? "Private Supporter" : "Verified Circle Member",
        date: "Just now",
        milestoneTag: type.charAt(0).toUpperCase() + type.slice(1),
        message: note?.trim() ? note.trim() : `${label} for this request.`,
      };

      return {
        ...s,
        requests: s.requests.map((r) =>
          r.id === requestId
            ? { ...r, supporters: r.supporters + 1, updates: [updateEntry, ...r.updates] }
            : r,
        ),
        connections: s.connections.includes(req.personId)
          ? s.connections
          : [...s.connections, req.personId],
        mentorships:
          type === "mentorship" && !s.mentorships.includes(req.personId)
            ? [...s.mentorships, req.personId]
            : s.mentorships,
        impact: [
          {
            id: uid(),
            date: today(),
            type,
            label,
            detail: `${studentLabel}${note?.trim() ? ` — ${note.trim()}` : ` — ${req.title}`}`,
            privacy,
          },
          ...s.impact,
        ],
        notifications: notify(s, {
          title: type === "mentorship" ? "New mentorship connection" : "Relational support offered",
          body: `${label} for ${studentLabel}.`,
          tone: type === "mentorship" ? "match" : "support",
        }),
      };
    });

  const postRequestUpdate: Ctx["postRequestUpdate"] = (
    requestId,
    milestoneTag,
    message,
    isGratitude,
  ) =>
    update((s) => {
      const req = s.requests.find((r) => r.id === requestId);
      if (!req) return s;
      const authorLabel =
        req.disclosureLevel === "shielded-alias" ? req.aliasLabel : "Kizito Fahad";
      const entry: RequestUpdate = {
        id: `u-${uid()}`,
        authorLabel,
        date: "Just now",
        milestoneTag,
        message,
        isGratitude,
      };
      return {
        ...s,
        requests: s.requests.map((r) =>
          r.id === requestId ? { ...r, updates: [entry, ...r.updates] } : r,
        ),
        notifications: notify(s, {
          title: isGratitude ? "Thank-you update shared" : "Milestone update posted",
          body: `Supporters of "${req.title}" received your update.`,
          tone: "impact",
        }),
      };
    });

  const joinCommunity: Ctx["joinCommunity"] = (id) =>
    update((s) =>
      s.joinedCommunities.includes(id)
        ? s
        : {
            ...s,
            joinedCommunities: [...s.joinedCommunities, id],
            impact: [
              {
                id: uid(),
                date: today(),
                type: "join",
                label: "Joined a community",
                detail: communitiesById[id]?.short ?? id,
                privacy: "public",
              },
              ...s.impact,
            ],
            notifications: notify(s, {
              title: "Community joined",
              body: `You are now part of ${communitiesById[id]?.short ?? id}.`,
              tone: "impact",
            }),
          },
    );

  const toggleConnection: Ctx["toggleConnection"] = (personId) =>
    update((s) => {
      if (s.connections.includes(personId)) return s;
      const person = peopleById[personId];
      return {
        ...s,
        connections: [...s.connections, personId],
        notifications: notify(s, {
          title: "Connection added to circle",
          body: `${person?.name ?? "Member"} is now in your relational circle.`,
          tone: "match",
        }),
      };
    });

  const toggleSaveOpportunity: Ctx["toggleSaveOpportunity"] = (opportunityId) =>
    update((s) => ({
      ...s,
      savedOpportunities: s.savedOpportunities.includes(opportunityId)
        ? s.savedOpportunities.filter((x) => x !== opportunityId)
        : [...s.savedOpportunities, opportunityId],
    }));

  const applyOpportunity: Ctx["applyOpportunity"] = (opportunityId, title) =>
    update((s) => {
      if (s.appliedOpportunities.includes(opportunityId)) return s;
      return {
        ...s,
        appliedOpportunities: [...s.appliedOpportunities, opportunityId],
        impact: [
          {
            id: uid(),
            date: today(),
            type: "opportunity",
            label: "Applied with verified profile",
            detail: title,
            privacy: "private",
          },
          ...s.impact,
        ],
        notifications: notify(s, {
          title: "Application sent",
          body: `Your verified Ed-Bridge profile was shared for ${title}.`,
          tone: "opportunity",
        }),
      };
    });

  const addProofItem: Ctx["addProofItem"] = (type, title, fileLabel, note) =>
    update((s) => ({
      ...s,
      proofItems: [
        {
          id: `p-${uid()}`,
          studentId: CURRENT_USER_ID,
          studentName: "Kizito Fahad",
          type,
          title,
          date: today(),
          fileLabel,
          note,
          verified: false,
        },
        ...s.proofItems,
      ],
      notifications: notify(s, {
        title: "Proof uploaded",
        body: `${title} has been uploaded and queued for verification.`,
        tone: "impact",
      }),
    }));

  const createRequest: Ctx["createRequest"] = (r) => {
    const id = `r-${uid()}`;
    const disclosureLevel = r.disclosureLevel ?? "shielded-alias";
    const audienceScope = r.audienceScope ?? "alumni-mentors-only";
    const disbursementMode = r.disbursementMode ?? "direct-bursar";
    const aliasLabel =
      disclosureLevel === "shielded-alias"
        ? `Verified CoCIS Year 2 Student · #EB-${Math.floor(100 + Math.random() * 899)}`
        : "Kizito Fahad (CoCIS Year 2)";

    update((s) => ({
      ...s,
      requests: [
        {
          id,
          personId: CURRENT_USER_ID,
          title: r.title.trim(),
          category: r.category,
          need: r.need.trim(),
          why: r.why.trim(),
          amountNeeded: r.amountNeeded,
          amountRaised: 0,
          deadlineDays: r.deadlineDays,
          supporters: 0,
          supportTypes: r.supportTypes,
          status: "pending",
          checks: { identity: true, studentStatus: true, documents: true, humanReview: false },
          createdAt: today(),
          disclosureLevel,
          audienceScope,
          disbursementMode,
          aliasLabel,
          updates: [],
          referringPartnerId: r.referringPartnerId,
          referringPartnerName: r.referringPartnerName,
          consentRecord: {
            informedOfPurpose: r.consentConfirmed ?? true,
            nonGuaranteeAcknowledged: true,
            consentedAt: today(),
          },
        },
        ...s.requests,
      ],
      notifications: notify(s, {
        title: `Request submitted (${DISCLOSURE_META[disclosureLevel].label})`,
        body: `Your request is queued for document verification. Audience: ${AUDIENCE_META[audienceScope].label}.${r.referringPartnerName ? ` Referral channel: ${r.referringPartnerName}.` : ""}`,
        tone: "verification",
      }),
    }));
    return id;
  };

  const updateRequestStatus: Ctx["updateRequestStatus"] = (requestId, status) =>
    update((s) => ({
      ...s,
      requests: s.requests.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status,
              checks: { ...r.checks, humanReview: status === "verified" },
            }
          : r,
      ),
      notifications: notify(s, {
        title: `Verification updated to ${status}`,
        body: "Request status updated by human review.",
        tone: "verification",
      }),
    }));

  const onboardStakeholderPartner: Ctx["onboardStakeholderPartner"] = (input) => {
    const id = `org-${uid()}`;
    const newPartner: StakeholderPartner = {
      id,
      name: input.name.trim(),
      shortName: input.shortName.trim(),
      kind: input.kind.trim(),
      blurb: input.blurb.trim(),
      planTier: "Standard Stakeholder Charter",
      status: "proposed-framework",
      authorization: {
        nameAndLogoAuthorized: input.authorizeBrandingNow,
        databaseAccessProhibited: true,
        zeroFinancialLiability: true,
        independentGovernancePreserved: true,
        voluntaryConsentRequired: true,
      },
      focalPersons: {
        partnerFocal: input.partnerFocal.trim(),
        partnerRole: input.partnerRole.trim(),
        edBridgeFocal: "Kizito Fahad — Platform & Pilot Lead",
        lastJointMeeting: "Charter Created · Awaiting Joint Review",
      },
      hallsAndColleges:
        input.hallsAndColleges.length > 0 ? input.hallsAndColleges : ["CoCIS", "CEDAT", "CHUSS"],
      metrics: {
        studentsReached: 0,
        referralsSubmitted: 0,
        verificationsConfirmed: 0,
        bursariesMatched: 0,
        capacitySessions: 0,
        campaigns: 1,
        mentorshipSessions: 0,
      },
      commitments: createStandardCommitments(),
      nextSteps: createStandardNextSteps(1),
    };

    update((s) => ({
      ...s,
      stakeholderPartners: [newPartner, ...s.stakeholderPartners],
      notifications: notify(s, {
        title: `New stakeholder charter: ${newPartner.shortName}`,
        body: "Standardized safeguards, consent rules & MoU readiness tracker provisioned.",
        tone: "verification",
      }),
    }));
    return id;
  };

  const togglePartnerNextStep: Ctx["togglePartnerNextStep"] = (partnerId, stepId) =>
    update((s) => ({
      ...s,
      stakeholderPartners: s.stakeholderPartners.map((p) =>
        p.id === partnerId
          ? {
              ...p,
              nextSteps: p.nextSteps.map((st) =>
                st.id === stepId ? { ...st, done: !st.done } : st,
              ),
            }
          : p,
      ),
    }));

  const togglePartnerBrandingAuth: Ctx["togglePartnerBrandingAuth"] = (partnerId) =>
    update((s) => {
      const target = s.stakeholderPartners.find((p) => p.id === partnerId);
      const nextAuthorized = !(target?.authorization.nameAndLogoAuthorized ?? false);
      return {
        ...s,
        stakeholderPartners: s.stakeholderPartners.map((p) =>
          p.id === partnerId
            ? {
                ...p,
                authorization: {
                  ...p.authorization,
                  nameAndLogoAuthorized: nextAuthorized,
                },
              }
            : p,
        ),
        notifications: notify(s, {
          title: nextAuthorized
            ? `${target?.shortName ?? "Partner"} branding authorized`
            : `${target?.shortName ?? "Partner"} branding locked`,
          body: nextAuthorized
            ? "Public co-branding enabled per written institutional authorization."
            : "Public branding locked — Safeguard #2 enforced.",
          tone: "verification",
        }),
      };
    });

  const advancePartnerStatus: Ctx["advancePartnerStatus"] = (partnerId, status) =>
    update((s) => ({
      ...s,
      stakeholderPartners: s.stakeholderPartners.map((p) =>
        p.id === partnerId ? { ...p, status } : p,
      ),
      notifications: notify(s, {
        title: "Stakeholder agreement status updated",
        body: `Framework status updated to ${status.replace("-", " ")}.`,
        tone: "verification",
      }),
    }));

  const updatePartnerFocalPersons: Ctx["updatePartnerFocalPersons"] = (
    partnerId,
    partnerFocal,
    edBridgeFocal,
  ) =>
    update((s) => ({
      ...s,
      stakeholderPartners: s.stakeholderPartners.map((p) =>
        p.id === partnerId
          ? {
              ...p,
              focalPersons: {
                ...p.focalPersons,
                partnerFocal: partnerFocal.trim(),
                edBridgeFocal: edBridgeFocal.trim(),
                lastJointMeeting: `${today()} · Focal Persons Updated`,
              },
            }
          : p,
      ),
    }));

  const submitConsentedReferral: Ctx["submitConsentedReferral"] = (input) => {
    const id = `ref-${uid()}`;
    const partner = state.stakeholderPartners.find((p) => p.id === input.partnerId);
    const aliasCode = `#EB-${Math.floor(100 + Math.random() * 899)}`;
    const aliasLabel = input.shielded
      ? `Verified ${input.hallOrCollege.split("/")[0]?.trim() || "Makerere"} Student · ${aliasCode}`
      : `Verified Student (${input.courseAndYear})`;

    let linkedRequestId: string | undefined;
    const newReqId = `r-${uid()}`;
    if (input.alsoCreateShieldedRequest) {
      linkedRequestId = newReqId;
    }

    const referral: StudentReferral = {
      id,
      partnerId: input.partnerId,
      aliasLabel,
      hallOrCollege: input.hallOrCollege.trim(),
      courseAndYear: input.courseAndYear.trim(),
      category: input.category,
      shielded: input.shielded,
      consentConfirmed: input.consentConfirmed,
      nonGuaranteeAcknowledged: input.nonGuaranteeAcknowledged,
      consentScopeNote:
        "Voluntary informed consent verified: student briefed on data scope, access controls, and non-guarantee of aid.",
      referralSummary: input.referralSummary.trim(),
      membershipVerificationStatus: "confirmed-with-consent",
      referredByFocal: partner?.focalPersons.partnerFocal ?? "Partner Focal Person",
      createdAt: today(),
      linkedRequestId,
    };

    update((s) => {
      const nextRequests = input.alsoCreateShieldedRequest
        ? [
            {
              id: newReqId,
              personId: "p-amina",
              title: `${input.category} Support — ${input.hallOrCollege}`,
              category: input.category,
              need: input.referralSummary.trim(),
              why: `Consented referral coordinated via ${partner?.shortName ?? "Partner Desk"} (${input.courseAndYear}). Direct bursar/vendor settlement preserves student dignity.`,
              amountNeeded: input.amountNeeded ?? 300000,
              amountRaised: 0,
              deadlineDays: 14,
              supporters: 0,
              supportTypes: ["financial", "mentorship"] as SupportType[],
              status: "pending" as VerificationState,
              checks: {
                identity: true,
                studentStatus: true,
                documents: true,
                humanReview: false,
              },
              createdAt: today(),
              disclosureLevel: (input.shielded
                ? "shielded-alias"
                : "circle-trusted") as DisclosureLevel,
              audienceScope: "alumni-mentors-only" as AudienceScope,
              disbursementMode: "direct-bursar" as DisbursementMode,
              aliasLabel,
              updates: [],
              referringPartnerId: input.partnerId,
              referringPartnerName: partner?.shortName,
              consentRecord: {
                informedOfPurpose: true,
                nonGuaranteeAcknowledged: true,
                consentedAt: today(),
              },
            },
            ...s.requests,
          ]
        : s.requests;

      return {
        ...s,
        referrals: [referral, ...s.referrals],
        requests: nextRequests,
        stakeholderPartners: s.stakeholderPartners.map((p) =>
          p.id === input.partnerId
            ? {
                ...p,
                metrics: {
                  ...p.metrics,
                  referralsSubmitted: p.metrics.referralsSubmitted + 1,
                  verificationsConfirmed: p.metrics.verificationsConfirmed + 1,
                  studentsReached: p.metrics.studentsReached + 1,
                },
              }
            : p,
        ),
        notifications: notify(s, {
          title: "Consented student referral logged",
          body: `${aliasLabel} (${input.hallOrCollege}) queued under strict privacy safeguards.`,
          tone: "verification",
        }),
      };
    });

    return id;
  };

  const confirmReferralMembership: Ctx["confirmReferralMembership"] = (referralId) =>
    update((s) => {
      const target = s.referrals.find((r) => r.id === referralId);
      if (!target) return s;
      return {
        ...s,
        referrals: s.referrals.map((r) =>
          r.id === referralId
            ? { ...r, membershipVerificationStatus: "confirmed-with-consent" }
            : r,
        ),
        stakeholderPartners: s.stakeholderPartners.map((p) =>
          p.id === target.partnerId
            ? {
                ...p,
                metrics: {
                  ...p.metrics,
                  verificationsConfirmed: p.metrics.verificationsConfirmed + 1,
                },
              }
            : p,
        ),
        notifications: notify(s, {
          title: "Consented membership verified",
          body: `${target.aliasLabel} institutional affiliation confirmed with student consent.`,
          tone: "verification",
        }),
      };
    });

  const publishPartnerOpportunity: Ctx["publishPartnerOpportunity"] = (input) => {
    const id = `opp-${uid()}`;
    const partner = state.stakeholderPartners.find((p) => p.id === input.partnerId);
    const deadlineDate = new Date(Date.now() + input.closesInDays * 86400000)
      .toISOString()
      .slice(0, 10);

    const newOpp: Opportunity = {
      id,
      title: input.title.trim(),
      org: partner?.shortName ?? "Partner Stakeholder",
      fundingPartner: partner?.name ?? "Partner Organization",
      partnerId: input.partnerId,
      kind: input.kind,
      location: input.location.trim(),
      compensation: input.compensation.trim(),
      closesInDays: input.closesInDays,
      deadlineDate,
      summary: input.summary.trim(),
      matchReason: `Published transparently via ${partner?.shortName ?? "Partner"} fair-access desk.`,
      communities: ["cocis", "cedat", "chuss"],
      eligibilityCriteria: input.eligibilityCriteria,
      applicationSteps: input.applicationSteps,
      fairAccessNotice: STANDARD_NON_GUARANTEE_NOTICE,
    };

    update((s) => ({
      ...s,
      opportunities: [newOpp, ...s.opportunities],
      stakeholderPartners: s.stakeholderPartners.map((p) =>
        p.id === input.partnerId
          ? {
              ...p,
              metrics: {
                ...p.metrics,
                capacitySessions:
                  input.kind === "Training" || input.kind === "Mentorship"
                    ? p.metrics.capacitySessions + 1
                    : p.metrics.capacitySessions,
                campaigns: p.metrics.campaigns + 1,
              },
            }
          : p,
      ),
      notifications: notify(s, {
        title: `New ${input.kind} opportunity published`,
        body: `${newOpp.title} with clear eligibility & deadline (${deadlineDate}).`,
        tone: "opportunity",
      }),
    }));

    return id;
  };

  const createStudentBusiness: Ctx["createStudentBusiness"] = (input) => {
    const id = `biz-${uid()}`;
    const newBiz: Opportunity = {
      id,
      title: input.title.trim(),
      org: `Student Venture · ${input.businessCategory}`,
      fundingPartner: `Founded by ${input.founderLabel.trim()}`,
      founderLabel: input.founderLabel.trim(),
      businessCategory: input.businessCategory,
      kind: "Student Business",
      location: input.location.trim(),
      compensation: input.compensation.trim(),
      closesInDays: 30,
      deadlineDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      summary: input.summary.trim(),
      matchReason: "Listed directly by a verified student founder in your campus community.",
      communities: input.communities?.length ? input.communities : ["cocis", "mak-alumni"],
      productsOrServices: input.productsOrServices,
      patronsCount: 1,
      boostedCount: 1,
      hiringStudents: input.hiringStudents,
      hiringNote: input.hiringNote?.trim() || undefined,
      eligibilityCriteria: [
        "Open to fellow students, alumni & campus community supporters",
        "Supports student self-reliance and peer employment",
      ],
      applicationSteps: [
        "Tap Support / Order to patronize or connect with the founder",
        "Tap Boost to Circle to help more classmates & alumni notice this business",
      ],
      fairAccessNotice:
        "Verified student-founded small business on Ed-Bridge. Direct patronage helps founders stay enrolled and team up with peers.",
    };

    update((s) => ({
      ...s,
      opportunities: [newBiz, ...s.opportunities],
      notifications: notify(s, {
        title: "Student business spotlight published",
        body: `${newBiz.title} is now discoverable across your campus & alumni circle.`,
        tone: "opportunity",
      }),
    }));

    return id;
  };

  const supportStudentBusiness: Ctx["supportStudentBusiness"] = (businessId, action, note) =>
    update((s) => {
      const target = s.opportunities.find((o) => o.id === businessId);
      const bizTitle = target?.title ?? "Student Business";
      const label =
        action === "patronize"
          ? "Patronized student business"
          : action === "refer-peer"
            ? "Referred peer collaborator to student business"
            : "Boosted student business to circle";

      return {
        ...s,
        opportunities: s.opportunities.map((o) =>
          o.id === businessId
            ? {
                ...o,
                patronsCount: action === "patronize" ? (o.patronsCount ?? 0) + 1 : o.patronsCount,
                boostedCount: action !== "patronize" ? (o.boostedCount ?? 0) + 1 : o.boostedCount,
              }
            : o,
        ),
        impact: [
          {
            id: uid(),
            date: today(),
            type: action === "boost" ? "amplification" : "opportunity",
            label,
            detail: note ? `${bizTitle} — ${note}` : bizTitle,
            privacy: "recognized",
          },
          ...s.impact,
        ],
        notifications: notify(s, {
          title: label,
          body: `${bizTitle} gained your support in the campus community.`,
          tone: "opportunity",
        }),
      };
    });

  const completeOnboarding: Ctx["completeOnboarding"] = (opts) =>
    update((s) => ({
      ...s,
      onboarded: true,
      role: "student",
      notifications: notify(s, {
        title: "Profile submitted for verification",
        body: `Welcome, ${opts?.name ?? "Kizito Fahad"} (${opts?.institution ?? "Makerere University"} · ${opts?.field ?? "Computer Science"}). Privacy default: ${opts?.defaultShielded === false ? "Circle Trusted" : "Shielded Alias"}.`,
        tone: "verification",
      }),
    }));

  const value: Ctx = useMemo(() => {
    const totals = {
      studentsSupported: new Set(
        state.impact
          .filter((i) => i.type === "financial" || i.type === "resource")
          .map((i) => i.detail.split(" — ")[0]),
      ).size,
      mentorships: state.impact.filter((i) => i.type === "mentorship").length,
      referrals: state.impact.filter((i) => i.type === "referral" || i.type === "opportunity")
        .length,
      resources: state.impact.filter((i) => i.type === "resource").length,
      communities: state.joinedCommunities.length,
      amount: 0,
    };
    return {
      ...state,
      user: peopleById[CURRENT_USER_ID],
      totals,
      setRole: (role) => update((s) => ({ ...s, role })),
      completeOnboarding,
      supportFinancially,
      offerSupport,
      postRequestUpdate,
      joinCommunity,
      toggleConnection,
      toggleSaveOpportunity,
      applyOpportunity,
      addProofItem,
      createRequest,
      updateRequestStatus,
      onboardStakeholderPartner,
      togglePartnerNextStep,
      togglePartnerBrandingAuth,
      advancePartnerStatus,
      updatePartnerFocalPersons,
      submitConsentedReferral,
      confirmReferralMembership,
      publishPartnerOpportunity,
      createStudentBusiness,
      supportStudentBusiness,
      markAllRead: () =>
        update((s) => ({
          ...s,
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
        })),
      reset: () => update(() => initial),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useEdBridge() {
  const v = useContext(C);
  if (!v) throw new Error("useEdBridge must be used inside EdBridgeProvider");
  return v;
}
