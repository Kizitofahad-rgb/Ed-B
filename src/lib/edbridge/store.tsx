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
  communitiesById,
  people,
  peopleById,
  seedImpact,
  seedNotifications,
  seedProofItems,
  supportRequests as seedRequests,
  ugx,
} from "./data";
import type {
  AppNotification,
  AudienceScope,
  DisbursementMode,
  DisclosureLevel,
  ImpactEvent,
  Privacy,
  ProofOfImpactRecord,
  RequestUpdate,
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
  }) => string;
  updateRequestStatus: (requestId: string, status: VerificationState) => void;
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

const KEY = "edbridge.prototype.v2";
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
  onboarded: false,
  supporterStreakMonths: 4,
};

const supportLabel: Record<string, string> = {
  mentorship: "Offered mentorship",
  resource: "Offered a resource / equipment loan",
  opportunity: "Referred a paid opportunity",
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
        },
        ...s.requests,
      ],
      notifications: notify(s, {
        title: `Request submitted (${DISCLOSURE_META[disclosureLevel].label})`,
        body: `Your request is queued for document verification. Audience: ${AUDIENCE_META[audienceScope].label}.`,
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
