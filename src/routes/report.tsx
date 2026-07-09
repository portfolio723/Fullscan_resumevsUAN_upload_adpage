import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Check,
  ShieldCheck,
  Lock,
  BadgeCheck,
  Cpu,
  Mail,
  UserPlus,
  FileText,
  ArrowLeft,
  X,
  User,
  Phone,
} from "lucide-react";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Verification Complete — FullScan" },
      {
        name: "description",
        content: "Your Resume vs UAN verification report has been generated.",
      },
    ],
  }),
  component: ReportPage,
});

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3">
      <img
        src="/logo.png"
        alt="Fullscan Logo"
        className="h-10 w-auto select-none object-contain"
        referrerPolicy="no-referrer"
      />
    </Link>
  );
}

function ReportPage() {
  const [emailOpen, setEmailOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [sent, setSent] = useState(false);

  const canSubmit = form.name.trim() && form.email.includes("@") && form.phone.trim().length >= 6;

  const submit = () => {
    if (!canSubmit) return;
    setSent(true);
    setEmailOpen(false);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <header className="mx-auto flex w-full max-w-6xl shrink-0 items-center justify-between px-6 py-4">
        <Logo />
        <Link
          to="/"
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium text-muted-foreground hover:bg-surface"
        >
          <ArrowLeft className="h-4 w-4" />
          New verification
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col overflow-hidden px-5 pb-4">
        {/* Hero */}
        <section className="shrink-0 text-center animate-fade-up">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success animate-bounce-in">
            <Check className="h-8 w-8 text-success-foreground" strokeWidth={3} />
          </div>
          <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Verification Complete
          </h1>
          <p className="mx-auto mt-1 max-w-lg text-sm text-muted-foreground">
            Your Resume vs UAN comparison has been generated successfully.
          </p>

          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {[
              { icon: ShieldCheck, label: "Shield Verified" },
              { icon: Lock, label: "Encrypted" },
              { icon: BadgeCheck, label: "Official UAN" },
              { icon: Cpu, label: "AI Verified" },
            ].map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
              >
                <Icon className="h-3 w-3 text-primary" />
                {label}
              </span>
            ))}
          </div>
        </section>

        {/* Report preview - flex fills remaining */}
        <section className="mt-4 flex min-h-0 flex-1 flex-col">
          <div
            onClick={() => setEmailOpen(true)}
            className="group relative flex-1 overflow-hidden rounded-3xl border border-border bg-card shadow-soft cursor-pointer hover:border-primary/40 hover:shadow-[0_20px_50px_rgba(1,117,172,0.06)] transition-all duration-500"
          >
            <div className="absolute right-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-success px-2.5 py-1 text-[11px] font-semibold text-success-foreground shadow-soft">
              <Cpu className="h-3 w-3 animate-pulse" />
              AI Verified
            </div>

            <div
              className="pointer-events-none absolute inset-0 select-none p-6 sm:p-8"
              style={{ filter: "blur(10px)" }}
              aria-hidden
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="h-3 w-40 rounded bg-foreground/70" />
                  <div className="mt-1.5 h-2.5 w-24 rounded bg-muted-foreground/60" />
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {[
                  "Employment Timeline",
                  "Company Match",
                  "Experience Analysis",
                  "Gap Detection",
                ].map((s) => (
                  <div key={s} className="rounded-2xl border border-border p-3">
                    <div className="h-3 w-52 rounded bg-foreground/70" />
                    <div className="mt-2 space-y-1.5">
                      <div className="h-2 w-full rounded bg-muted-foreground/40" />
                      <div className="h-2 w-11/12 rounded bg-muted-foreground/40" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-b from-background/30 via-background/60 to-background/85">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card text-primary shadow-soft transition-all duration-300 group-hover:scale-110 group-hover:bg-primary-soft group-hover:text-primary">
                <Lock className="h-5 w-5" />
              </div>
              <p className="mt-2 rounded-full bg-card px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-foreground shadow-soft transition-all duration-300 group-hover:text-primary">
                Preview Locked
              </p>
              <p className="mt-2 max-w-sm px-6 text-center text-xs text-muted-foreground sm:text-sm">
                Unlock the full report to see your verification score, timeline and detailed
                matches.
              </p>
            </div>
          </div>
        </section>

        {/* CTAs */}
        <section className="mt-3 shrink-0">
          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setEmailOpen(true)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:scale-[1.02] hover:brightness-110"
            >
              <UserPlus className="h-4 w-4" />
              Register to Unlock Report
            </button>
            <button
              type="button"
              onClick={() => setEmailOpen(true)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border-2 border-primary bg-card px-6 text-sm font-semibold text-primary transition-all hover:bg-primary-soft"
            >
              <Mail className="h-4 w-4" />
              Email Me the Report
            </button>
          </div>

          {sent && (
            <div className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-success/30 bg-success-soft p-2 text-xs font-medium text-foreground animate-fade-up">
              <Check className="h-4 w-4 text-primary" />
              We'll send your report to {form.email} shortly.
            </div>
          )}
        </section>
      </main>

      {/* Email modal */}
      {emailOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm animate-fade-up"
          onClick={() => setEmailOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-soft"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    Email me the report
                  </h3>
                  <p className="text-xs text-muted-foreground">Enter your details to receive it.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEmailOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-surface"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <label className="flex items-center gap-2 rounded-full border border-border bg-surface px-4">
                <User className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Full name"
                  className="min-h-11 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </label>
              <label className="flex items-center gap-2 rounded-full border border-border bg-surface px-4">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@company.com"
                  className="min-h-11 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </label>
              <label className="flex items-center gap-2 rounded-full border border-border bg-surface px-4">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Phone number"
                  className="min-h-11 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={submit}
              disabled={!canSubmit}
              className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Mail className="h-4 w-4" />
              Send report
            </button>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              Secure · Instant · No spam
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
