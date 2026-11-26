import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BadgeCheck, EyeOff, Users } from "lucide-react";
import { AppShell } from "@/components/edbridge/AppShell";
import { Button } from "@/components/ui/button";
import { useEdBridge } from "@/lib/edbridge/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [{ title: "Join Ed-Bridge Verified — Onboarding" }],
  }),
  component: OnboardingScreen,
});

const STEPS = ["Identity", "Education", "Dignity & Privacy", "Verification"] as const;

function OnboardingScreen() {
  const navigate = useNavigate();
  const { completeOnboarding } = useEdBridge();

  const [step, setStep] = useState(0);
  const [name, setName] = useState("Kizito Fahad");
  const [institution, setInstitution] = useState("Makerere University — CoCIS");
  const [field, setField] = useState("BSc Computer Science, Year 2");
  const [secondarySchool, setSecondarySchool] = useState("Busia Secondary School");
  const [bio, setBio] = useState("Second-year CS student organizing weekend peer coding sessions.");
  const [defaultShielded, setDefaultShielded] = useState(true);
  const [studentIdAttached, setStudentIdAttached] = useState(true);
  const [consentAccepted, setConsentAccepted] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    if (step === 0 && name.trim().length < 2) {
      setError("Please enter your name.");
      return;
    }
    if (step === 1 && (!institution.trim() || !field.trim())) {
      setError("Please enter your university and course.");
      return;
    }
    if (step === 3 && (!studentIdAttached || !consentAccepted)) {
      setError("Attach a Student ID check and confirm voluntary informed consent.");
      return;
    }
    setError(null);
    if (step < 3) {
      setStep((s) => s + 1);
    } else {
      completeOnboarding({
        name: name.trim(),
        institution: institution.trim(),
        field: field.trim(),
        defaultShielded,
      });
      toast.success("Profile submitted for verification");
      navigate({ to: "/student" });
    }
  };

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-5 sm:px-6 sm:py-8">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-foreground">
            Join Ed-Bridge Verified
          </h1>
          <p className="mt-1 text-xs font-bold text-primary">
            Step {step + 1} of 4 · {STEPS[step]}
          </p>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${((step + 1) / 4) * 100}%` }}
          />
        </div>

        <section className="rounded-[18px] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          {step === 0 && (
            <div className="space-y-3">
              <h2 className="text-base font-bold text-foreground">Who are you?</h2>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">
                  Full Legal Name (kept private if Shielded)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError(null);
                  }}
                  className="mt-1 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">
                  Short bio &amp; interests
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              <h2 className="text-base font-bold text-foreground">Your Real Academic Circles</h2>
              <p className="text-xs text-muted-foreground">
                Ed-Bridge connects you automatically with your college, course, and secondary school
                alumni.
              </p>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">
                  University &amp; College
                </label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => {
                    setInstitution(e.target.value);
                    setError(null);
                  }}
                  className="mt-1 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">
                  Course &amp; Year
                </label>
                <input
                  type="text"
                  value={field}
                  onChange={(e) => {
                    setField(e.target.value);
                    setError(null);
                  }}
                  className="mt-1 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">
                  Secondary School Alumni Circle
                </label>
                <input
                  type="text"
                  value={secondarySchool}
                  onChange={(e) => setSecondarySchool(e.target.value)}
                  className="mt-1 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <h2 className="text-base font-bold text-foreground">Dignity &amp; Privacy Default</h2>
              <p className="text-xs text-muted-foreground">
                Choose how you appear if you ever ask for tuition or sustenance support.
              </p>

              <button
                type="button"
                onClick={() => setDefaultShielded(true)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-colors",
                  defaultShielded
                    ? "border-primary bg-[#E8F8EE] text-[#132B1F] dark:bg-[#183628] dark:text-[#CEF8A6]"
                    : "border-border bg-secondary/40 text-foreground",
                )}
              >
                <EyeOff className="h-5 w-5 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold">Shielded Alias Default (Recommended)</p>
                  <p className="mt-0.5 text-[11px] opacity-85">
                    Hide your real name &amp; photo from classmates. Only verified alumni &amp;
                    bursar staff see verified credentials.
                  </p>
                </div>
                <input
                  type="radio"
                  checked={defaultShielded}
                  onChange={() => setDefaultShielded(true)}
                  className="h-4 w-4 accent-primary"
                />
              </button>

              <button
                type="button"
                onClick={() => setDefaultShielded(false)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-[14px] border p-3.5 text-left",
                  !defaultShielded
                    ? "border-primary bg-primary/15 text-foreground"
                    : "border-border bg-secondary/40 text-foreground",
                )}
              >
                <Users className="h-5 w-5 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold">Circle Trusted Profile</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Show your name inside your college &amp; secondary school alumni circles.
                  </p>
                </div>
                <input
                  type="radio"
                  checked={!defaultShielded}
                  onChange={() => setDefaultShielded(false)}
                  className="h-4 w-4 accent-primary"
                />
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <h2 className="text-base font-bold text-foreground">Confidential Verification</h2>
              <p className="text-xs text-muted-foreground">
                Documents are inspected by human reviewers only and never published.
              </p>
              <label className="flex items-center justify-between gap-3 rounded-xl bg-[#D1FAE5]/60 p-3.5 text-[#064E3B] dark:bg-[#064E3B]/45 dark:text-[#D1FAE5]">
                <div className="flex items-center gap-2.5">
                  <BadgeCheck className="h-5 w-5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold">Makerere Student ID</p>
                    <p className="text-[11px] opacity-85">MAK_ID_2026_VERIFIED.pdf</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={studentIdAttached}
                  onChange={(e) => {
                    setStudentIdAttached(e.target.checked);
                    setError(null);
                  }}
                  className="h-4.5 w-4.5 accent-[#059669]"
                />
              </label>

              <label className="flex items-start gap-2.5 rounded-xl border border-border bg-secondary/40 p-3 text-[11px] leading-relaxed">
                <input
                  type="checkbox"
                  checked={consentAccepted}
                  onChange={(e) => {
                    setConsentAccepted(e.target.checked);
                    setError(null);
                  }}
                  className="mt-0.5 h-4 w-4 accent-primary"
                />
                <span>
                  <strong className="text-foreground">
                    Voluntary Participation &amp; Consent:
                  </strong>{" "}
                  My enrollment details are used solely to verify eligibility with reviewers or
                  consented partners, never shared publicly without permission, and registration
                  does not guarantee financial aid.
                </span>
              </label>
            </div>
          )}

          {error ? <p className="mt-3 text-xs font-semibold text-destructive">{error}</p> : null}
        </section>

        <div className="flex gap-3">
          {step > 0 ? (
            <Button
              variant="outline"
              onClick={() => setStep((s) => s - 1)}
              className="h-12 flex-1 rounded-xl"
            >
              Back
            </Button>
          ) : null}
          <Button onClick={handleNext} className="h-12 flex-1 rounded-xl">
            {step < 3 ? "Continue" : "Complete Verification"}
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
