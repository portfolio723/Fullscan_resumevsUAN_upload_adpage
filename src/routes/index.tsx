import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  UploadCloud,
  ShieldCheck,
  BadgeCheck,
  FileText,
  Check,
  Lock,
  FileSearch,
  Fingerprint,
  Cpu,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

type ChatMsg =
  { role: "ai"; text: string; id: string } | { role: "user"; text: string; id: string };

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <img
        src="/logo.png"
        alt="Fullscan Logo"
        className="h-10 w-auto select-none object-contain"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

const TRUST = [
  { icon: ShieldCheck, label: "Shield Verified" },
  { icon: Lock, label: "Encrypted" },
  { icon: BadgeCheck, label: "Official UAN" },
  { icon: Cpu, label: "AI Powered" },
];

function Landing() {
  const navigate = useNavigate();
  const [fileName, setFileName] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [processing, setProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState("");
  const [checkingProgress, setCheckingProgress] = useState(false);

  // Staged file state
  const [pendingFileName, setPendingFileName] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const footerInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleCheckProgress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkEmail) return;

    if (pendingFileName) {
      // If a file is pending, the footer button acts as Start Verification instead of Check Status
      startProcessing(pendingFileName);
      return;
    }

    setCheckingProgress(true);
    setTimeout(() => {
      setCheckingProgress(false);

      if (processing && fileName) {
        const lastMsg = messages[messages.length - 1]?.text || "Preparing secure verification...";
        toast.info(`Active verification found for ${checkEmail}`, {
          description: `File: ${fileName} • Status: ${lastMsg}`,
          duration: 4000,
        });
      } else {
        toast.error(`No active verification in progress for ${checkEmail}`, {
          description: "Please upload a candidate resume above to start a new verification.",
          duration: 4000,
        });
      }
    }, 1200);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startProcessing = useCallback(
    (name: string) => {
      setErrorMsg(null);
      setFileName(name);
      setProcessing(true);
      setMessages([]);

      const timeline: Array<{ delay: number; msg: ChatMsg }> = [
        {
          delay: 400,
          msg: { role: "ai", id: "a1", text: "Resume received. Preparing secure verification..." },
        },
        { delay: 900, msg: { role: "user", id: "u1", text: name } },
        {
          delay: 1600,
          msg: {
            role: "ai",
            id: "a2",
            text: "Securely comparing your resume with employment records.",
          },
        },
        {
          delay: 4000,
          msg: {
            role: "ai",
            id: "a3",
            text: "Extracting experience and matching UAN timelines...",
          },
        },
        {
          delay: 7000,
          msg: {
            role: "ai",
            id: "a4",
            text: "Cross-checking company names and employment gaps...",
          },
        },
        {
          delay: 9500,
          msg: { role: "ai", id: "a5", text: "Verification complete. Preparing your report..." },
        },
      ];

      const timers = timeline.map(({ delay, msg }) =>
        setTimeout(() => setMessages((m) => [...m, msg]), delay),
      );
      const done = setTimeout(() => navigate({ to: "/report" }), 11000);
      return () => {
        timers.forEach(clearTimeout);
        clearTimeout(done);
      };
    },
    [navigate],
  );

  const handleFile = (file: File | undefined | null) => {
    if (!file) return;
    const ok =
      file.type.includes("pdf") || file.type.includes("word") || /\.(pdf|docx?)$/i.test(file.name);
    if (!ok) {
      setErrorMsg("Please upload a PDF or Word document.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("File too large. Max 10 MB.");
      return;
    }
    setPendingFileName(file.name);
    setErrorMsg(null);
    // Focus footer input to enter candidate email
    setTimeout(() => {
      footerInputRef.current?.focus();
    }, 1200);
  };

  const useSample = () => {
    setPendingFileName("Sample_Resume.pdf");
    setErrorMsg(null);
    // Focus footer input to enter candidate email
    setTimeout(() => {
      footerInputRef.current?.focus();
    }, 1200);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="mx-auto flex w-full max-w-6xl shrink-0 items-center justify-between px-6 py-4">
        <Logo />
        <div className="hidden items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground sm:flex">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          Secure · Encrypted · AI Verified
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[760px] flex-1 flex-col overflow-hidden px-5 pb-6">
        {/* Hero */}
        {messages.length === 0 && !processing && (
          <section className="flex flex-1 flex-col justify-center text-center animate-fade-up overflow-y-auto py-2">
            {/* Badge */}
            <div className="mx-auto mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted-foreground">
              <Cpu className="h-3 w-3 text-primary" />
              AI-powered verification
            </div>

            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Verify Resume Against UAN
            </h1>
            <p className="mx-auto mt-1 max-w-xl text-xs text-muted-foreground sm:text-sm">
              Upload your resume to compare employment history with official UAN records.
            </p>

            {/* Trust row ABOVE upload */}
            <div className="mx-auto mt-4 grid w-full max-w-lg grid-cols-2 gap-2 sm:grid-cols-4">
              {TRUST.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-2 py-1.5"
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary-soft text-primary">
                    <Icon className="h-3 w-3" />
                  </div>
                  <span className="text-[10px] font-medium text-foreground">{label}</span>
                </div>
              ))}
            </div>

            {/* Upload card */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleFile(e.dataTransfer.files?.[0]);
              }}
              className={`group mt-4 rounded-2xl border-2 border-dashed bg-card p-4 transition-all sm:p-6 ${
                dragOver
                  ? "border-primary bg-primary-soft"
                  : pendingFileName
                    ? "border-success bg-success-soft/20 hover:bg-success-soft/30"
                    : "border-border hover:border-primary/50 hover:bg-surface"
              }`}
            >
              {pendingFileName ? (
                <div className="flex flex-col items-center text-center animate-fade-up">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success text-success-foreground">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 font-display text-sm font-semibold text-foreground sm:text-base">
                    {pendingFileName}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Resume staged and ready for verification.
                  </p>
                  <div className="mt-2.5 rounded-lg bg-primary-soft p-2 text-[11px] font-semibold text-primary animate-pulse">
                    👇 Please enter candidate email in the footer below to start verification.
                  </div>
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="mt-3 text-xs font-medium text-muted-foreground hover:text-foreground underline underline-offset-4"
                  >
                    Change file
                  </button>
                  <input
                    ref={inputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="sr-only"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary transition-transform group-hover:scale-105">
                    <UploadCloud className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <h3 className="mt-2.5 font-display text-sm font-semibold text-foreground sm:text-base">
                    upload candidate resume
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">or browse from your device</p>
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="mt-3 inline-flex min-h-9 items-center justify-center rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-soft transition-all hover:scale-[1.02] hover:brightness-110"
                  >
                    Browse Files
                  </button>
                  <p className="mt-2 text-[10px] text-muted-foreground">
                    PDF, DOCX, DOC · Max 10 MB
                  </p>
                  <input
                    ref={inputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="sr-only"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                  />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={useSample}
              className="mx-auto mt-3 inline-flex min-h-9 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-xs font-medium text-foreground transition-all hover:border-primary/40 hover:bg-surface"
            >
              <FileSearch className="h-3.5 w-3.5 text-primary" />
              Try Sample Resume
            </button>

            {errorMsg && (
              <p role="alert" className="mt-2.5 text-xs text-destructive">
                {errorMsg}
              </p>
            )}
          </section>
        )}

        {/* Conversation */}
        {(messages.length > 0 || processing) && (
          <section className="flex flex-1 flex-col overflow-hidden pt-6">
            <div className="mx-auto flex w-full flex-1 flex-col gap-3 overflow-y-auto">
              {fileName && (
                <div className="mx-auto flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 animate-bounce-in">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-foreground">{fileName}</p>
                    <p className="text-xs text-muted-foreground">Uploaded securely</p>
                  </div>
                  <div className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-success text-success-foreground">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </div>
                </div>
              )}

              {messages.map((m) =>
                m.role === "ai" ? (
                  <div key={m.id} className="flex items-start gap-3 animate-fade-up">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground animate-shield-pulse">
                      <Fingerprint className="h-4 w-4" />
                    </div>
                    <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-surface px-4 py-3 text-sm leading-relaxed text-foreground">
                      {m.text}
                    </div>
                  </div>
                ) : (
                  <div key={m.id} className="flex items-start justify-end gap-3 animate-fade-up">
                    <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-sm font-medium text-primary-foreground">
                      {m.text}
                    </div>
                  </div>
                ),
              )}

              {processing && (
                <div className="flex items-start gap-3 animate-fade-up">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success text-success-foreground animate-green-pulse">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl rounded-tl-sm bg-surface px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span
                        className="typing-dot h-2 w-2 rounded-full bg-primary"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="typing-dot h-2 w-2 rounded-full bg-primary"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="typing-dot h-2 w-2 rounded-full bg-primary"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </section>
        )}
      </main>

      {/* Sticky footer for checking progress or starting verification */}
      {messages.length === 0 && !processing && (
        <footer
          className={`w-full shrink-0 border-t border-border bg-card/90 backdrop-blur-md py-4 px-6 transition-all duration-300 ${pendingFileName ? "bg-success-soft/10 border-success/30 shadow-[0_-8px_30px_rgb(0,0,0,0.04)]" : ""}`}
        >
          <div className="mx-auto max-w-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left shrink-0">
              <h4 className="text-sm font-semibold text-foreground">
                {pendingFileName ? "Start Verification" : "Track Progress"}
              </h4>
              <p className="text-xs text-muted-foreground">
                {pendingFileName
                  ? "Enter candidate email to start"
                  : "Check your resume verification status"}
              </p>
            </div>
            <form
              onSubmit={handleCheckProgress}
              className="flex w-full sm:max-w-md items-center gap-2"
            >
              <input
                ref={footerInputRef}
                type="email"
                required
                placeholder={
                  pendingFileName ? "candidate@company.com" : "Enter email to view progress..."
                }
                value={checkEmail}
                onChange={(e) => setCheckEmail(e.target.value)}
                className={`h-9 w-full rounded-full border bg-background px-4 text-xs focus:outline-none focus:ring-1 focus:ring-ring transition-all ${
                  pendingFileName
                    ? "border-success/50 focus:border-success focus:ring-success"
                    : "border-border focus:border-primary"
                }`}
              />
              <button
                type="submit"
                disabled={checkingProgress}
                className={`h-9 shrink-0 inline-flex items-center justify-center rounded-full px-4 text-xs font-semibold text-primary-foreground shadow-soft transition-all hover:scale-[1.01] hover:brightness-110 disabled:opacity-50 cursor-pointer ${
                  pendingFileName ? "bg-success hover:bg-success/90" : "bg-primary"
                }`}
              >
                {checkingProgress
                  ? "Checking..."
                  : pendingFileName
                    ? "Start Verification"
                    : "Check Status"}
              </button>
            </form>
          </div>
        </footer>
      )}
    </div>
  );
}
