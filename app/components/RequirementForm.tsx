"use client";

import { FormEvent, MouseEvent, useMemo, useState } from "react";

type HireType = "planner" | "performer" | "crew";
type DateMode = "single" | "range";

type PlannerDetails = {
  plannerScope: "full-service" | "day-coordination" | "consultation";
  planningBudget: string;
};

type PerformerDetails = {
  performerCategory: "dj" | "live-band" | "singer" | "other";
  performerCount: string;
};

type CrewDetails = {
  crewCategory: "photography" | "videography" | "catering" | "decor";
  crewSize: string;
};

type FormState = {
  eventName: string;
  eventType: string;
  dateMode: DateMode;
  startDate: string;
  endDate: string;
  location: string;
  venue: string;
  hireType: HireType | "";
  planner: PlannerDetails;
  performer: PerformerDetails;
  crew: CrewDetails;
};

const STEP_COUNT = 4;

const initialState: FormState = {
  eventName: "",
  eventType: "",
  dateMode: "single",
  startDate: "",
  endDate: "",
  location: "",
  venue: "",
  hireType: "",
  planner: {
    plannerScope: "full-service",
    planningBudget: "",
  },
  performer: {
    performerCategory: "dj",
    performerCount: "",
  },
  crew: {
    crewCategory: "photography",
    crewSize: "",
  },
};

type Spotlight = {
  x: number;
  y: number;
  visible: boolean;
};

function SpotlightPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [spotlight, setSpotlight] = useState<Spotlight>({
    x: 0,
    y: 0,
    visible: false,
  });

  const onMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setSpotlight({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      visible: true,
    });
  };

  return (
    <div
      onMouseMove={onMove}
      onMouseEnter={onMove}
      onMouseLeave={() => setSpotlight((prev) => ({ ...prev, visible: false }))}
      className={[
        "surface-card relative overflow-hidden rounded-2xl border border-[var(--border-default)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: spotlight.visible ? 1 : 0,
          background: `radial-gradient(300px circle at ${spotlight.x}px ${spotlight.y}px, rgba(94,106,210,0.16), transparent 70%)`,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

function StepBadge({
  label,
  active,
  done,
}: {
  label: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <div
      className={[
        "rounded-xl border px-3 py-2 text-xs tracking-[0.12em] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        done
          ? "border-[var(--border-accent)] bg-[rgba(94,106,210,0.18)] text-[var(--foreground)]"
          : active
            ? "border-[var(--border-hover)] bg-[rgba(255,255,255,0.08)] text-[var(--foreground)]"
            : "border-[var(--border-default)] bg-[rgba(255,255,255,0.03)] text-[var(--foreground-subtle)]",
      ].join(" ")}
    >
      {label}
    </div>
  );
}

const inputClassName =
  "focus-ring h-11 rounded-lg border border-white/10 bg-[var(--background-elevated)] px-3 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] transition-colors duration-200 focus:border-[var(--accent)]";

const labelClassName = "flex flex-col gap-2 text-sm text-[var(--foreground-muted)]";

export default function RequirementForm() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<FormState>(initialState);

  const stepTitle = useMemo(() => {
    if (step === 1) return "Basic Event Details";
    if (step === 2) return "Date And Location";
    if (step === 3) return "Select Hiring Type";
    return "Requirement Details";
  }, [step]);

  const canMoveNext = useMemo(() => {
    if (step === 1) {
      return Boolean(formData.eventName.trim() && formData.eventType.trim());
    }

    if (step === 2) {
      const hasStart = Boolean(formData.startDate);
      const hasLocation = Boolean(formData.location.trim());
      if (formData.dateMode === "single") {
        return hasStart && hasLocation;
      }
      return hasStart && Boolean(formData.endDate) && hasLocation;
    }

    if (step === 3) {
      return Boolean(formData.hireType);
    }

    if (step === 4 && formData.hireType === "planner") {
      return Boolean(formData.planner.planningBudget.trim());
    }

    if (step === 4 && formData.hireType === "performer") {
      return Number(formData.performer.performerCount) > 0;
    }

    if (step === 4 && formData.hireType === "crew") {
      return Number(formData.crew.crewSize) > 0;
    }

    return false;
  }, [formData, step]);

  const selectedTypeLabel =
    formData.hireType.charAt(0).toUpperCase() + formData.hireType.slice(1);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!formData.hireType) {
      setError("Please select who you want to hire.");
      return;
    }

    setSubmitting(true);

    const payload = {
      event: {
        name: formData.eventName.trim(),
        type: formData.eventType.trim(),
        dateMode: formData.dateMode,
        startDate: formData.startDate,
        endDate: formData.dateMode === "range" ? formData.endDate : null,
        location: formData.location.trim(),
        venue: formData.venue.trim() || null,
      },
      hireType: formData.hireType,
      requirementDetails:
        formData.hireType === "planner"
          ? formData.planner
          : formData.hireType === "performer"
            ? formData.performer
            : formData.crew,
    };

    try {
      const response = await fetch("/api/requirements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as {
        success: boolean;
        message?: string;
        error?: string;
      };

      if (!response.ok || !data.success) {
        setError(data.error ?? "Failed to save requirement.");
        return;
      }

      setMessage(data.message ?? "Requirement posted successfully.");
      setFormData(initialState);
      setStep(1);
    } catch {
      setError("Could not connect to server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SpotlightPanel className="p-4 md:p-8">
      <div className="mb-6 flex flex-col gap-5 border-b border-white/[0.06] pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs tracking-[0.16em] text-[var(--foreground-subtle)]">
            STEP {step} OF {STEP_COUNT}
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            {stepTitle}
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <StepBadge label="Brief" active={step === 1} done={step > 1} />
          <StepBadge label="Schedule" active={step === 2} done={step > 2} />
          <StepBadge label="Role" active={step === 3} done={step > 3} />
          <StepBadge label="Details" active={step === 4} done={false} />
        </div>
      </div>

      <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] via-indigo-400 to-[var(--accent)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ width: `${(step / STEP_COUNT) * 100}%` }}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <div className="grid gap-4 md:grid-cols-2">
            <label className={labelClassName}>
              Event Name
              <input
                className={inputClassName}
                type="text"
                value={formData.eventName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, eventName: e.target.value }))
                }
                placeholder="Spring Product Launch"
                required
              />
            </label>

            <label className={labelClassName}>
              Event Type
              <input
                className={inputClassName}
                type="text"
                value={formData.eventType}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, eventType: e.target.value }))
                }
                placeholder="Corporate, Wedding, Concert"
                required
              />
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4 md:grid-cols-2">
            <label className={labelClassName}>
              Date Selection
              <select
                className={inputClassName}
                value={formData.dateMode}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dateMode: e.target.value as DateMode,
                  }))
                }
              >
                <option value="single">Single Date</option>
                <option value="range">Date Range</option>
              </select>
            </label>

            <label className={labelClassName}>
              {formData.dateMode === "single" ? "Event Date" : "Start Date"}
              <input
                className={inputClassName}
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, startDate: e.target.value }))
                }
                required
              />
            </label>

            {formData.dateMode === "range" && (
              <label className={labelClassName}>
                End Date
                <input
                  className={inputClassName}
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                  }
                  required
                />
              </label>
            )}

            <label className={labelClassName}>
              Location
              <input
                className={inputClassName}
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, location: e.target.value }))
                }
                placeholder="City, State"
                required
              />
            </label>

            <label className={labelClassName}>
              Venue (Optional)
              <input
                className={inputClassName}
                type="text"
                value={formData.venue}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, venue: e.target.value }))
                }
                placeholder="Venue name"
              />
            </label>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-3 md:grid-cols-3">
            {[
              {
                id: "planner" as const,
                title: "Event Planner",
                text: "Strategy, timeline, and vendor orchestration.",
              },
              {
                id: "performer" as const,
                title: "Performer",
                text: "DJs, singers, live bands, and stage acts.",
              },
              {
                id: "crew" as const,
                title: "Crew",
                text: "Production teams, decor, food, and media support.",
              },
            ].map((option) => {
              const selected = formData.hireType === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, hireType: option.id }))
                  }
                  aria-pressed={selected}
                  className={[
                    "focus-ring rounded-2xl border px-4 py-4 text-left transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    "hover:-translate-y-1 hover:border-[var(--border-hover)]",
                    selected
                      ? "border-[var(--border-accent)] bg-[rgba(94,106,210,0.18)] shadow-[0_10px_32px_rgba(94,106,210,0.25)]"
                      : "border-[var(--border-default)] bg-[rgba(255,255,255,0.03)]",
                  ].join(" ")}
                >
                  <h3 className="text-base font-semibold text-[var(--foreground)]">
                    {option.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--foreground-muted)]">
                    {option.text}
                  </p>
                </button>
              );
            })}
          </div>
        )}

        {step === 4 && formData.hireType === "planner" && (
          <div className="grid gap-4 md:grid-cols-2">
            <p className="md:col-span-2 text-sm text-[var(--foreground-subtle)]">
              Posting for {selectedTypeLabel}
            </p>

            <label className={labelClassName}>
              Planner Scope
              <select
                className={inputClassName}
                value={formData.planner.plannerScope}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    planner: {
                      ...prev.planner,
                      plannerScope: e.target.value as PlannerDetails["plannerScope"],
                    },
                  }))
                }
              >
                <option value="full-service">Full Service Planning</option>
                <option value="day-coordination">Day Coordination</option>
                <option value="consultation">Consultation</option>
              </select>
            </label>

            <label className={labelClassName}>
              Estimated Planning Budget
              <input
                className={inputClassName}
                type="text"
                value={formData.planner.planningBudget}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    planner: {
                      ...prev.planner,
                      planningBudget: e.target.value,
                    },
                  }))
                }
                placeholder="1500 - 3000 USD"
                required
              />
            </label>
          </div>
        )}

        {step === 4 && formData.hireType === "performer" && (
          <div className="grid gap-4 md:grid-cols-2">
            <p className="md:col-span-2 text-sm text-[var(--foreground-subtle)]">
              Posting for {selectedTypeLabel}
            </p>

            <label className={labelClassName}>
              Performer Category
              <select
                className={inputClassName}
                value={formData.performer.performerCategory}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    performer: {
                      ...prev.performer,
                      performerCategory:
                        e.target.value as PerformerDetails["performerCategory"],
                    },
                  }))
                }
              >
                <option value="dj">DJ</option>
                <option value="live-band">Live Band</option>
                <option value="singer">Singer</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label className={labelClassName}>
              Number Of Performers
              <input
                className={inputClassName}
                type="number"
                min={1}
                value={formData.performer.performerCount}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    performer: {
                      ...prev.performer,
                      performerCount: e.target.value,
                    },
                  }))
                }
                placeholder="2"
                required
              />
            </label>
          </div>
        )}

        {step === 4 && formData.hireType === "crew" && (
          <div className="grid gap-4 md:grid-cols-2">
            <p className="md:col-span-2 text-sm text-[var(--foreground-subtle)]">
              Posting for {selectedTypeLabel}
            </p>

            <label className={labelClassName}>
              Crew Category
              <select
                className={inputClassName}
                value={formData.crew.crewCategory}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    crew: {
                      ...prev.crew,
                      crewCategory: e.target.value as CrewDetails["crewCategory"],
                    },
                  }))
                }
              >
                <option value="photography">Photography</option>
                <option value="videography">Videography</option>
                <option value="catering">Catering</option>
                <option value="decor">Decor</option>
              </select>
            </label>

            <label className={labelClassName}>
              Crew Size Required
              <input
                className={inputClassName}
                type="number"
                min={1}
                value={formData.crew.crewSize}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    crew: {
                      ...prev.crew,
                      crewSize: e.target.value,
                    },
                  }))
                }
                placeholder="4"
                required
              />
            </label>
          </div>
        )}

        {error && (
          <p className="rounded-lg border border-[rgba(255,125,125,0.35)] bg-[rgba(255,125,125,0.12)] px-3 py-2 text-sm text-[var(--danger)]">
            {error}
          </p>
        )}
        {message && (
          <p className="rounded-lg border border-[rgba(97,209,155,0.35)] bg-[rgba(97,209,155,0.12)] px-3 py-2 text-sm text-[var(--success)]">
            {message}
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-white/[0.06] pt-5 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={() => setStep((prev) => Math.max(1, prev - 1))}
            disabled={step === 1 || submitting}
            className="focus-ring button-secondary rounded-lg px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Back
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => Math.min(4, prev + 1))}
              disabled={!canMoveNext || submitting}
              className="focus-ring button-primary rounded-lg px-4 py-2 text-sm font-medium text-white transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              className="focus-ring button-primary rounded-lg px-4 py-2 text-sm font-medium text-white transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={submitting || !formData.hireType || !canMoveNext}
            >
              {submitting ? "Saving..." : "Submit Requirement"}
            </button>
          )}
        </div>
      </form>
    </SpotlightPanel>
  );
}
