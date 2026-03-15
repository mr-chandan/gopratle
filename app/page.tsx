import RequirementForm from "@/app/components/RequirementForm";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 md:px-8 md:pt-16">
      <section className="surface-card relative overflow-hidden rounded-3xl px-6 py-10 md:px-12 md:py-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(94,106,210,0.2),transparent_38%)]" />
        <div className="relative grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-end">
          <div className="space-y-5">
            <p className="inline-flex rounded-full border border-[var(--border-accent)] bg-[rgba(94,106,210,0.18)] px-3 py-1 text-xs tracking-[0.16em] text-[var(--foreground)]">
              REQUIREMENT FLOW
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-transparent md:text-6xl md:tracking-[-0.03em] bg-gradient-to-b from-white via-white/95 to-white/70 bg-clip-text">
              Post Event Hiring Requirements With Precision.
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-[var(--foreground-muted)] md:text-lg">
              A guided multi-step flow for event organizers to define scope, select
              talent category, and submit structured requirements to the backend.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {[
              ["Step 1", "Event Brief"],
              ["Step 2", "Date And Location"],
              ["Step 3", "Hire Type + Details"],
            ].map(([label, text]) => (
              <article
                key={label}
                className="rounded-2xl border border-[var(--border-default)] bg-[rgba(255,255,255,0.04)] px-4 py-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]"
              >
                <p className="text-xs tracking-[0.12em] text-[var(--foreground-subtle)]">
                  {label}
                </p>
                <p className="mt-2 text-sm font-medium text-[var(--foreground)]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8">
        <RequirementForm />
      </section>
    </main>
  );
}
