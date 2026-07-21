/**
 * HIVECODE — Landing Page
 * ------------------------------------------------------------------
 * Product: a real-time collaborative workspace where teams create
 * projects, pull in collaborators, and drop into live "Rooms" to
 * chat, assign tasks, and pair with AI to generate/debug code —
 * with every change timestamped and rolled into per-project analytics.
 *
 * Stack notes (MERN):
 * - This file is UI only. No API calls live here.
 * - Swap the <a href="#"> placeholders below for react-router-dom's
 *   <Link to="..."> once this sits inside your <BrowserRouter>.
 * - Suggested routes: "/" (this page), "/login", "/register",
 *   "/dashboard", "/projects/new", "/projects/:id", "/room/:roomId",
 *   "/profile/:username", "/schedule".
 * - The hero + "inside a room" mockups are static markup meant to
 *   preview the real Room UI — wire them to your Socket.IO room
 *   state once the real component exists.
 *
 * Tailwind: assumes a default Tailwind config. For the display
 * headings, consider loading "Space Grotesk" (Google Fonts) and
 * mapping it to a `font-display` utility in tailwind.config.js —
 * pairs well with the mono accents used for code/labels here.
 * ------------------------------------------------------------------
 */

import React, { useState } from "react";
import {
  MessagesSquare,
  Code2,
  Users2,
  BarChart3,
  GitBranch,
  CalendarClock,
  Rocket,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Radio,
  FolderKanban,
  Terminal,
  Zap,
  Menu,
  X,
  Circle,
} from "lucide-react";

/* ---------------------------------------------------------------- */
/* Shared style tokens                                               */
/* ---------------------------------------------------------------- */
const accentText = "text-[#C6FF5E]";
const violet = "#8B7CFF";
const lime = "#C6FF5E";
const coral = "#FF6B4A";

const sectionShell = "relative mx-auto w-full max-w-7xl px-6 lg:px-10";
const eyebrow =
  "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium tracking-wide text-white/60 font-mono";

export default function LandingPage() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#060607] text-[#F5F5F7] antialiased selection:bg-[#8B7CFF]/30">
      <BackgroundGlow />
      <Navbar navOpen={navOpen} setNavOpen={setNavOpen} />
      <main className="relative z-10">
        <Hero />
        <TrustStrip />
        <HowItWorks />
        <FeatureGrid />
        <RoomDeepDive />
        <AnalyticsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Ambient background — subtle, not decorative for its own sake      */
/* ---------------------------------------------------------------- */
function BackgroundGlow() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute -top-40 left-1/4 h-[32rem] w-[32rem] rounded-full bg-[#8B7CFF]/[0.10] blur-[120px]" />
      <div className="absolute top-1/3 right-0 h-[26rem] w-[26rem] rounded-full bg-[#C6FF5E]/[0.06] blur-[130px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.035)_1px,transparent_0)] bg-[size:36px_36px]" />
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Navbar                                                             */
/* ---------------------------------------------------------------- */
function Navbar({ navOpen, setNavOpen }) {
  const links = [
    { label: "Product", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Inside a room", href: "#room" },
    { label: "Analytics", href: "#analytics" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#060607]/80 backdrop-blur-xl">
      <div className={`${sectionShell} flex h-16 items-center justify-between`}>
        <a href="#" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#8B7CFF]">
            <Terminal className="h-4 w-4 text-[#060607]" strokeWidth={2.5} />
          </span>
          <span className="text-lg font-semibold tracking-tight">Hivecode</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm text-white/60 transition hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {/* real app: <Link to="/login"> */}
          <a
            href="#"
            className="text-sm font-medium text-white/70 transition hover:text-white"
          >
            Log in
          </a>
          {/* real app: <Link to="/register"> */}
          <a
            href="#"
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#060607] transition hover:bg-[#C6FF5E]"
          >
            Start for free
          </a>
        </div>

        <button
          className="md:hidden text-white/80"
          onClick={() => setNavOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {navOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {navOpen && (
        <div className="border-t border-white/[0.06] px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm text-white/70"
                onClick={() => setNavOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-3 border-t border-white/[0.06] pt-4">
              <a href="#" className="text-sm text-white/70">
                Log in
              </a>
              <a
                href="#"
                className="rounded-lg bg-white px-4 py-2 text-center text-sm font-semibold text-[#060607]"
              >
                Start for free
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/* ---------------------------------------------------------------- */
/* Hero — headline + a live "Room" preview as the signature visual   */
/* ---------------------------------------------------------------- */
function Hero() {
  return (
    <section className={`${sectionShell} pt-16 pb-24 lg:pt-24 lg:pb-32`}>
      <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <div className={eyebrow}>
            <Circle className="h-2 w-2 fill-[#C6FF5E] text-[#C6FF5E]" />
            Real-time · not just another tracker
          </div>

          <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            Build the project.
            <br />
            Not just <span className="text-white/35">the backlog.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/60">
            Hivecode is where your team creates a project, pulls in
            collaborators, and drops into a live room to talk, assign work, and
            pair with AI to write and fix code together — in real time, with
            every change tracked automatically.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            {/* real app: <Link to="/room/new"> */}
            <a
              href="#"
              className="group flex items-center gap-2 rounded-lg bg-[#8B7CFF] px-6 py-3.5 text-sm font-semibold text-[#060607] transition hover:bg-[#C6FF5E]"
            >
              <Zap className="h-4 w-4" strokeWidth={2.5} />
              Start a chat right now
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </a>
            {/* real app: <Link to="/projects/new"> */}
            <a
              href="#"
              className="rounded-lg border border-white/15 px-6 py-3.5 text-sm font-semibold text-white/85 transition hover:border-white/30 hover:bg-white/[0.04]"
            >
              Create a project
            </a>
          </div>

          <div className="mt-10 flex items-center gap-6 text-xs text-white/40">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#C6FF5E]" /> Free for
              teams up to 5
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#C6FF5E]" /> No card
              required
            </span>
          </div>
        </div>

        <RoomMockup />
      </div>
    </section>
  );
}

/* The signature element: a compact preview of an actual live room —
   chat on one side, AI-generated code streaming in, tasks on deck. */
function RoomMockup() {
  return (
    <div className="relative">
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[#8B7CFF]/20 via-transparent to-[#C6FF5E]/10 blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0B0B0D] shadow-2xl shadow-black/50">
        {/* window chrome */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
          <div className="flex items-center gap-2 text-xs font-medium text-white/70">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF6B4A]/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF6B4A]" />
            </span>
            live · Checkout Flow Redesign
          </div>
          <div className="flex -space-x-2">
            {["#8B7CFF", "#C6FF5E", "#FF6B4A"].map((c, i) => (
              <span
                key={i}
                className="h-6 w-6 rounded-full border-2 border-[#0B0B0D]"
                style={{ background: c }}
              />
            ))}
            <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#0B0B0D] bg-white/10 text-[9px] font-semibold">
              +2
            </span>
          </div>
        </div>

        <div className="grid grid-cols-5">
          {/* chat + AI code */}
          <div className="col-span-3 space-y-3 border-r border-white/[0.06] p-4">
            <ChatBubble name="Priya" color={violet}>
              cart total is off by tax on the summary step
            </ChatBubble>
            <ChatBubble name="Hivecode AI" color={lime} ai>
              <div className="mt-1 rounded-md bg-black/40 p-2 font-mono text-[11px] leading-relaxed text-[#C6FF5E]">
                total = subtotal + tax<span className="animate-pulse">▍</span>
              </div>
            </ChatBubble>
            <div className="flex items-center gap-1.5 pl-1 text-[11px] text-white/35">
              <span className="flex gap-0.5">
                <Dot /> <Dot delay="150ms" /> <Dot delay="300ms" />
              </span>
              Arjun is typing…
            </div>
          </div>

          {/* task rail */}
          <div className="col-span-2 space-y-2 p-4">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/35">
              Tasks
            </p>
            <TaskChip label="Fix tax calc" assignee="P" done />
            <TaskChip label="Update summary UI" assignee="A" />
            <TaskChip label="Write test case" assignee="R" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatBubble({ name, color, children, ai }) {
  return (
    <div className="flex gap-2.5">
      <span
        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-[#060607]"
        style={{ background: color }}
      >
        {ai ? <Sparkles className="h-3 w-3" /> : name[0]}
      </span>
      <div>
        <h2 className="text-[11px] font-medium text-white/50">{name}</h2>
        <p className="text-[13px] leading-snug text-white/85">{children}</p>
      </div>
    </div>
  );
}

function Dot({ delay = "0ms" }) {
  return (
    <span
      className="h-1 w-1 animate-bounce rounded-full bg-white/40"
      style={{ animationDelay: delay }}
    />
  );
}

function TaskChip({ label, assignee, done }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2">
      <div className="flex items-center gap-2">
        <span
          className={`flex h-4 w-4 items-center justify-center rounded border ${
            done ? "border-[#C6FF5E] bg-[#C6FF5E]/20" : "border-white/20"
          }`}
        >
          {done && <CheckCircle2 className="h-3 w-3 text-[#C6FF5E]" />}
        </span>
        <span
          className={`text-xs ${
            done ? "text-white/35 line-through" : "text-white/75"
          }`}
        >
          {label}
        </span>
      </div>
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[9px] font-semibold text-white/70">
        {assignee}
      </span>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Trust strip                                                       */
/* ---------------------------------------------------------------- */
function TrustStrip() {
  const stats = [
    { value: "12k+", label: "rooms opened this month" },
    { value: "48s", label: "median time to first AI fix" },
    { value: "3.2M", label: "lines generated collaboratively" },
    { value: "99.95%", label: "realtime uptime" },
  ];
  return (
    <section className="border-y border-white/[0.06] bg-white/[0.015] py-10">
      <div className={`${sectionShell} grid grid-cols-2 gap-8 sm:grid-cols-4`}>
        {stats.map((s) => (
          <div key={s.label} className="text-center sm:text-left">
            <p className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {s.value}
            </p>
            <p className="mt-1 text-xs text-white/40">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* How it works — a genuine sequence, numbering is earned here       */
/* ---------------------------------------------------------------- */
function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Create a project",
      copy: "Spin up a project, set the scope, and invite collaborators by their unique username or email.",
      icon: FolderKanban,
    },
    {
      n: "02",
      title: "Open the room",
      copy: "Every project has a live room. Jump in, talk it through, and hand out tasks as you go.",
      icon: MessagesSquare,
    },
    {
      n: "03",
      title: "Ship together",
      copy: "Pair with AI for full builds or single fixes, then watch contributions and history roll into your analytics.",
      icon: Rocket,
    },
  ];

  return (
    <section id="how-it-works" className={`${sectionShell} py-24`}>
      <SectionHeading
        eyebrowText="The flow"
        title="From idea to a working room in under a minute"
        subtitle="No setup ceremony. Create, invite, and you're already talking about the actual work."
      />
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <div
            key={s.n}
            className="relative rounded-2xl border border-white/[0.07] bg-white/[0.02] p-7"
          >
            <span className="font-mono text-xs text-white/25">{s.n}</span>
            <div className="mt-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#8B7CFF]/15">
              <s.icon className="h-5 w-5 text-[#8B7CFF]" />
            </div>
            <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/55">
              {s.copy}
            </p>
            {i < steps.length - 1 && (
              <ArrowRight className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-white/15 md:block" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Feature grid                                                      */
/* ---------------------------------------------------------------- */
function FeatureGrid() {
  const features = [
    {
      icon: MessagesSquare,
      title: "Live project rooms",
      copy: "Real-time chat scoped to each project — no more scattered threads across five apps.",
      color: violet,
    },
    {
      icon: Sparkles,
      title: "AI pair programming",
      copy: "Generate a full MERN feature or step through an error one chunk at a time, together.",
      color: lime,
    },
    {
      icon: Users2,
      title: "Collaborators, not just members",
      copy: "Add teammates by username, set roles, and see who's active in the room right now.",
      color: coral,
    },
    {
      icon: BarChart3,
      title: "Project analytics",
      copy: "Collective progress and individual contribution, broken down automatically — no manual reports.",
      color: violet,
    },
    {
      icon: GitBranch,
      title: "Live change history",
      copy: "Every edit is timestamped with who made it and when — created and updated dates, always mapped.",
      color: lime,
    },
    {
      icon: CalendarClock,
      title: "Scheduled discussions",
      copy: "Can't sync now? Schedule the room ahead of time and get pulled in when it starts.",
      color: coral,
    },
  ];

  return (
    <section id="features" className={`${sectionShell} py-24`}>
      <SectionHeading
        eyebrowText="Everything in one place"
        title="Built for teams who'd rather build than manage tools"
        subtitle="Project management, real-time collaboration, and AI code generation — one workspace, not three tabs."
      />
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition hover:border-white/[0.15] hover:bg-white/[0.04]"
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ background: `${f.color}22` }}
            >
              <f.icon className="h-5 w-5" style={{ color: f.color }} />
            </div>
            <h3 className="mt-5 text-base font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/55">
              {f.copy}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Room deep-dive — larger version of the core USP                   */
/* ---------------------------------------------------------------- */
function RoomDeepDive() {
  return (
    <section id="room" className={`${sectionShell} py-24`}>
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <div>
          <div className={eyebrow}>
            <Radio className="h-3.5 w-3.5 text-[#FF6B4A]" />
            The core of Hivecode
          </div>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
            One room. Chat, tasks, and AI — moving at the same time.
          </h2>
          <p className="mt-4 max-w-md text-white/55">
            Click "work on this project" and a room opens. Talk through the
            problem, hand out tasks as you go, and pull in the AI to generate a
            full feature or solve one error as a group — everything lands in the
            same timeline.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              "Full-app scaffolds or single code chunks, generated on request",
              "Tasks assigned mid-conversation, no context switch",
              "Every message and edit timestamped and attributed",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm text-white/70"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#C6FF5E]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0B0B0D] p-1.5 shadow-2xl shadow-black/50">
          <div className="rounded-xl bg-black/40 p-5">
            <div className="mb-3 flex items-center gap-2 text-[11px] font-mono text-white/40">
              <Code2 className="h-3.5 w-3.5 text-[#8B7CFF]" />
              AI generating · routes/project.js
            </div>
            <pre className="overflow-x-auto rounded-lg bg-black/60 p-4 font-mono text-[11px] leading-relaxed text-white/70">
              {`router.post("/projects/:id/tasks", auth, async (req, res) => {
  const task = await Task.create({
    project: req.params.id,
    title: req.body.title,
    assignee: req.body.assignee,
  });
  io.to(req.params.id).emit("task:created", task);
  res.status(201).json(task);
});`}
            </pre>
            <div className="mt-4 flex items-center justify-between text-[11px] text-white/40">
              <span>generated in 2.1s</span>
              <span className="flex items-center gap-1 text-[#C6FF5E]">
                <CheckCircle2 className="h-3 w-3" /> applied to room
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Analytics section                                                 */
/* ---------------------------------------------------------------- */
function AnalyticsSection() {
  const bars = [62, 88, 41, 95, 70, 54, 100];
  const contributions = [
    { name: "Priya", pct: 38, color: violet },
    { name: "Arjun", pct: 27, color: lime },
    { name: "Rhea", pct: 21, color: coral },
    { name: "Others", pct: 14, color: "#5B5B63" },
  ];

  return (
    <section id="analytics" className={`${sectionShell} py-24`}>
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <div className="order-2 rounded-2xl border border-white/10 bg-white/[0.02] p-6 lg:order-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/35">
            Project activity
          </p>
          <div className="mt-5 flex h-32 items-end gap-2">
            {bars.map((b, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-md bg-gradient-to-t from-[#8B7CFF]/30 to-[#8B7CFF]"
                style={{ height: `${b}%` }}
              />
            ))}
          </div>
          <div className="mt-6 border-t border-white/[0.06] pt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/35">
              Individual contribution
            </p>
            <div className="mt-3 flex h-2.5 w-full overflow-hidden rounded-full">
              {contributions.map((c) => (
                <span
                  key={c.name}
                  style={{ width: `${c.pct}%`, background: c.color }}
                />
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
              {contributions.map((c) => (
                <span
                  key={c.name}
                  className="flex items-center gap-1.5 text-[11px] text-white/50"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: c.color }}
                  />
                  {c.name} · {c.pct}%
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className={eyebrow}>
            <BarChart3 className="h-3.5 w-3.5 text-[#8B7CFF]" />
            Know your project, not just your backlog
          </div>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
            Analytics generated from real activity, not manual updates
          </h2>
          <p className="mt-4 max-w-md text-white/55">
            Every message, task, and AI-assisted edit feeds the same dashboard —
            collective progress and individual contribution, mapped
            automatically as the project moves.
          </p>
          {/* real app: <Link to="/dashboard"> */}
          <a
            href="#"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#C6FF5E] hover:underline"
          >
            See a sample dashboard <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* CTA banner                                                        */
/* ---------------------------------------------------------------- */
function CTASection() {
  return (
    <section className={`${sectionShell} pb-28`}>
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#8B7CFF]/15 via-[#0B0B0D] to-[#C6FF5E]/10 px-8 py-16 text-center sm:px-16">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Your next project's room is one click away
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-white/55">
          Create it, invite your team, and start talking about the actual work
          in the next sixty seconds.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#"
            className="flex items-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-[#060607] transition hover:bg-[#C6FF5E]"
          >
            Create your project <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="#"
            className="rounded-lg border border-white/15 px-6 py-3.5 text-sm font-semibold text-white/85 transition hover:bg-white/[0.04]"
          >
            Start a chat right now
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Shared heading block                                               */
/* ---------------------------------------------------------------- */
function SectionHeading({ eyebrowText, title, subtitle }) {
  return (
    <div className="max-w-2xl">
      <div className={eyebrow}>
        <Sparkles className="h-3.5 w-3.5 text-[#C6FF5E]" />
        {eyebrowText}
      </div>
      <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-white/55">{subtitle}</p>}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Footer                                                             */
/* ---------------------------------------------------------------- */
function Footer() {
  const columns = [
    {
      title: "Product",
      links: ["Rooms", "AI pair programming", "Analytics", "Scheduling"],
    },
    {
      title: "Workspace",
      links: ["Dashboard", "New project", "Profile", "Schedule a chat"],
    },
    {
      title: "Company",
      links: ["About", "Careers", "Blog"],
    },
  ];

  return (
    <footer className="relative z-10 border-t border-white/[0.06] py-16">
      <div className={sectionShell}>
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#8B7CFF]">
                <Terminal
                  className="h-4 w-4 text-[#060607]"
                  strokeWidth={2.5}
                />
              </span>
              <span className="text-lg font-semibold tracking-tight">
                Hivecode
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-white/45">
              Real-time rooms for teams who build together — chat, tasks, and
              AI-assisted code in one place.
            </p>
            <div className="mt-6 flex gap-4">
              <GitBranch className="h-4 w-4 text-white/40 hover:text-white" />
              <GitBranch className="h-4 w-4 text-white/40 hover:text-white" />
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/35">
                {col.title}
              </p>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-white/55 transition hover:text-white"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 text-xs text-white/35 sm:flex-row">
          <span>
            © {new Date().getFullYear()} Hivecode. All rights reserved.
          </span>
          <span>Built for teams shipping real projects.</span>
        </div>
      </div>
    </footer>
  );
}
