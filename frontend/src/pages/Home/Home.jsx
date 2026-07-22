import React, { useState, useEffect } from "react";
import {
  Flame,
  Users,
  MessageSquare,
  Code2,
  CheckSquare,
  History,
  ArrowRight,
  Zap,
  ShieldCheck,
  BarChart3,
  Menu,
  X,
  Plus,
  Star,
  ChevronDown,
  Sparkles,
  Timer,
} from "lucide-react";
import { Link } from "react-router-dom";
import ProjectModal from "../components/Home/ProjectModal";

// ─────────────────────────────────────────────────────────────
// CIRCLE — landing page
//
// Concept: teams create projects, add collaborators, and click
// "Work on this project" to drop into a live Room — real-time
// chat, task assignment, and AI pair-coding (full scaffolds or
// chunk-by-chunk fixes), with every change timestamped
// automatically for analytics and a collective project report.
//
// The hero mockup ("Room card") is the signature element — it's
// the one visual that should show up again, lightly, inside the
// real product (dashboard preview cards, empty states, etc.) so
// the landing page and the app feel like the same idea.
//
// Wiring notes for your MERN app:
//   - Swap <Link to="/..."> for react-router's <Link to="/...">
//   - The Room card below (chat / code / tasks) is fully mocked
//     client-side. Real version: Socket.io room events for chat +
//     presence, your AI service for code generation, and a tasks
//     collection scoped to projectId.
//   - "Updated Xs ago" ticks locally here — in the app, derive it
//     from the project's real `updatedAt` field.
//   - The contribution chart / activity grid are placeholder data
//     shaped like what you'll eventually aggregate per member
//     (messages sent, tasks closed, code chunks accepted, etc).
// ─────────────────────────────────────────────────────────────

const MEMBERS = [
  { initials: "PR", color: "bg-amber-400" },
  { initials: "KS", color: "bg-sky-400" },
  { initials: "AV", color: "bg-rose-400" },
];

const CONTRIBUTIONS = [
  { name: "Priya", value: 82, color: "bg-amber-400" },
  { name: "Kabir", value: 61, color: "bg-sky-400" },
  { name: "Arjun", value: 45, color: "bg-rose-400" },
  { name: "Neha", value: 38, color: "bg-amber-400" },
];

// Deterministic "activity" intensities for the heatmap (0-3)
const HEATMAP = [
  1, 2, 0, 3, 2, 1, 0, 2, 3, 1, 0, 1, 2, 3, 3, 1, 0, 2, 1, 0, 3, 2, 1, 0, 2, 3,
  1, 2, 0, 1, 3, 2, 1, 0, 3, 2, 1, 0, 2, 1, 3, 2, 0, 1, 2, 3, 1, 0, 2, 3, 1, 2,
  0, 3, 1, 2, 0, 1, 3, 2,
];

const heatColor = (v) =>
  ["bg-zinc-900", "bg-amber-400/20", "bg-amber-400/50", "bg-amber-400/90"][v];

const STEPS = [
  {
    n: "001",
    title: "Create a project.",
    body: "Give it a name, a goal, and a home. Every project starts empty on purpose.",
  },
  {
    n: "002",
    title: "Invite your collaborators.",
    body: "Add teammates by username. Everyone added can open the project's room.",
  },
  {
    n: "003",
    title: "Open the room.",
    body: "Chat, assign tasks, and generate code with AI — solo or with the whole team watching live.",
  },
  {
    n: "004",
    title: "Ship, tracked automatically.",
    body: "Every change is timestamped — created, updated, by whom — and rolled into your project report.",
  },
];

const FEATURES = [
  {
    icon: Users,
    title: "Live Project Rooms",
    body: "Click into any project and land in a shared room: real-time chat, live presence, and a feed of everything that changes as it happens.",
    to: "/rooms",
    cta: "See a room",
  },
  {
    icon: Code2,
    title: "AI Pair Coding",
    body: "Generate a full MERN scaffold in one shot, or drop into a single broken function and solve it together, chunk by chunk.",
    to: "/rooms",
    cta: "Try it live",
  },
  {
    icon: CheckSquare,
    title: "Task Assignment",
    body: "Turn any message into a task with one click. Assign it, set a due date, and watch it move as the room works.",
    to: "/dashboard",
    cta: "View tasks",
  },
  {
    icon: History,
    title: "Live Change Log",
    body: "Every edit is timestamped — created, updated, by whom. Your project's full history, without digging through commits.",
    to: "/dashboard",
    cta: "View history",
  },
];

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    blurb: "For a small team trying CIRCLE for the first time.",
    features: [
      "1 active project",
      "Up to 3 collaborators",
      "Unlimited rooms",
      "Basic project report",
    ],
    cta: "Start for free",
    highlighted: false,
  },
  {
    name: "Team",
    price: "$12",
    period: "per user / month",
    blurb: "For teams shipping multiple projects together.",
    features: [
      "Unlimited projects",
      "Unlimited collaborators",
      "AI pair-coding in every room",
      "Full analytics & contribution reports",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "billed annually",
    blurb: "For organizations that need control at scale.",
    features: [
      "SSO & role-based access",
      "Audit-ready change history",
      "Dedicated support",
      "Custom data residency",
    ],
    cta: "Talk to us",
    highlighted: false,
  },
];

const STATS = [
  {
    value: "12,400+",
    label: "rooms opened this month",
    color: "text-amber-400",
  },
  {
    value: "3.2×",
    label: "faster to unblock a stuck task",
    color: "text-sky-400",
  },
  {
    value: "98%",
    label: "of teams still active after month one",
    color: "text-rose-400",
  },
  {
    value: "< 2 min",
    label: "to get a whole team live",
    color: "text-violet-400",
  },
];

const REPLACES = [
  { tool: "Slack", forWhat: "team chat" },
  { tool: "Jira", forWhat: "tasks & tracking" },
  { tool: "Live Share", forWhat: "pair coding" },
  { tool: "Spreadsheets", forWhat: "status reports" },
];

const TESTIMONIALS = [
  {
    quote:
      "We used to lose a whole afternoon just figuring out who fixed what. Now the room shows us in real time, and the report writes itself.",
    name: "Meera Iyer",
    role: "Engineering Lead, 6-person team",
    color: "bg-amber-400",
  },
  {
    quote:
      "The AI pair-coding inside the room is what sold my co-founder. We scaffolded our whole backend together on one call, live.",
    name: "Daniyal Farooq",
    role: "Founder, early-stage startup",
    color: "bg-sky-400",
  },
  {
    quote:
      "Contribution breakdowns took the guesswork out of performance reviews. It's the first tool where the data matches what I actually remember.",
    name: "Wei Chen",
    role: "Product Manager",
    color: "bg-rose-400",
  },
];

const FAQS = [
  {
    q: "Do I need to already know the MERN stack to use the AI codegen?",
    a: "No. You can generate a full scaffold and learn from it, or ask for a single explained chunk at a time. The room is built for people at different skill levels working on the same project.",
  },
  {
    q: "Is my project data private?",
    a: "Yes. Projects are only visible to collaborators you've explicitly added. Nothing is public by default, and you can remove a collaborator's access at any time.",
  },
  {
    q: "Can I invite people outside my company or organization?",
    a: "Yes — collaborators are added by username, not company domain, so freelancers, students, and cross-team guests can join a project just as easily as a teammate.",
  },
  {
    q: "What happens to chat and code history after a room closes?",
    a: "Nothing is lost. Every message, task, and generated code chunk stays attached to the project's timeline, so you can scroll back to exactly when and why something changed.",
  },
];

function LiveDot({ className = "" }) {
  return (
    <span className={`relative flex h-2 w-2 ${className}`}>
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
    </span>
  );
}

export default function LandingPage() {
  const [seconds, setSeconds] = useState(4);
  const [taskDone, setTaskDone] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [codeLine, setCodeLine] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const [open, setOpen] = useState(false);

  const CODE_LINES = [
    {
      text: "router.post('/checkout', async (req, res) => {",
      color: "text-zinc-300",
    },
    {
      text: "  const cart = await Cart.findById(req.body.id);",
      color: "text-sky-400",
    },
    {
      text: "  if (!cart) return res.status(404).end();",
      color: "text-amber-400",
    },
    { text: "  // AI: added missing null check ✓", color: "text-zinc-600" },
  ];

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setTaskDone(true), 3500);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setCodeLine((i) => (i < CODE_LINES.length - 1 ? i + 1 : i));
    }, 900);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans">
      {/* ── Navbar ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-black/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 font-mono text-xl font-bold tracking-tight text-zinc-50"
          >
            <Flame size={20} className="text-amber-400" />
            CIRCLE
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
            <a
              href="#product"
              className="hover:text-zinc-100 transition-colors"
            >
              Product
            </a>
            <a
              href="#analytics"
              className="hover:text-zinc-100 transition-colors"
            >
              Analytics
            </a>
            <a
              href="/#pricing"
              className="hover:text-zinc-100 transition-colors"
            >
              Pricing
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm text-zinc-300 hover:text-white transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-300 transition-colors"
            >
              Start Free
            </Link>
          </div>

          <button
            className="md:hidden text-zinc-300"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-zinc-800 px-6 py-4 flex flex-col gap-4 text-sm text-zinc-300 bg-black">
            <a href="#product" onClick={() => setMenuOpen(false)}>
              Product
            </a>
            <a href="#analytics" onClick={() => setMenuOpen(false)}>
              Analytics
            </a>
            <a href="#pricing" onClick={() => setMenuOpen(false)}>
              Pricing
            </a>
            <hr className="border-zinc-800" />
            <Link href="/login">Log in</Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-full bg-amber-400 px-4 py-2 font-semibold text-black"
            >
              Start Free
            </Link>
          </div>
        )}
      </header>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden max-w-7xl mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-16 grid lg:grid-cols-2 gap-14 items-center">
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl -z-10" />
        <div className="pointer-events-none absolute top-40 -right-16 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl -z-10" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-rose-400/10 blur-3xl -z-10" />
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-3 py-1 text-xs font-mono text-amber-400 mb-6">
            <LiveDot />
            PROJECTS THAT WORK IN REAL TIME
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-zinc-50 mb-6">
            Stop syncing up.
            <br />
            Start{" "}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
              building together.
            </span>
          </h1>

          <p className="text-lg text-zinc-400 leading-relaxed mb-10 max-w-xl">
            CIRCLE is where your team creates projects, adds collaborators, and
            steps into live rooms to chat, assign tasks, and generate code with
            AI — together, in real time, with every change tracked
            automatically.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-10">
            <button
              onClick={() => {
                setOpen(true);
              }}
              to="/projects/new"
              className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 font-semibold text-black shadow-lg shadow-amber-400/20 hover:bg-amber-300 hover:shadow-amber-400/30 transition-colors"
            >
              <Plus size={18} />
              Start a Project — Free
            </button>
            <ProjectModal isOpen={open} onClose={() => setOpen(false)} />
            <a
              href="#product"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-6 py-3 text-zinc-200 hover:border-zinc-500 transition-colors"
            >
              Watch a room in action
              <ArrowRight size={16} />
            </a>
          </div>

          <div className="flex items-center gap-2 text-sm font-mono text-zinc-500">
            <Zap size={16} className="text-amber-400" />
            <span>No credit card · free for teams up to 3</span>
          </div>
        </div>

        {/* Signature element — the Room card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black overflow-hidden">
          <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-3">
            <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
              <LiveDot />
              Room · Checkout Flow
            </div>
            <div className="flex items-center -space-x-2">
              {MEMBERS.map((m) => (
                <span
                  key={m.initials}
                  className={`h-6 w-6 rounded-full ${m.color} text-black text-[10px] font-bold flex items-center justify-center ring-2 ring-zinc-900`}
                >
                  {m.initials}
                </span>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-px bg-zinc-800">
            {/* Chat pane */}
            <div className="bg-zinc-950 p-4 space-y-3">
              <div className="text-[10px] font-mono text-zinc-600 mb-1">
                CHAT
              </div>
              <div className="text-sm">
                <span className="font-semibold text-sky-400">Kabir</span>{" "}
                <span className="text-zinc-400">
                  the cart total breaks on empty state
                </span>
              </div>
              <div className="text-sm">
                <span className="font-semibold text-amber-400">Priya</span>{" "}
                <span className="text-zinc-400">
                  on it, generating a fix now
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-zinc-600">
                <span>AI is writing code</span>
                <span className="flex gap-0.5">
                  <span
                    className="h-1 w-1 rounded-full bg-zinc-600 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="h-1 w-1 rounded-full bg-zinc-600 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="h-1 w-1 rounded-full bg-zinc-600 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </span>
              </div>
            </div>

            {/* Code pane */}
            <div className="bg-zinc-950 p-4">
              <div className="text-[10px] font-mono text-zinc-600 mb-2">
                routes/checkout.js
              </div>
              <div className="font-mono text-xs space-y-1 min-h-[86px]">
                {CODE_LINES.slice(0, codeLine + 1).map((line, i) => (
                  <p key={i} className={line.color}>
                    {line.text}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-zinc-800 px-4 py-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-mono transition-colors ${
                  taskDone
                    ? "border-zinc-800 text-zinc-600 line-through"
                    : "border-amber-400/40 text-amber-400"
                }`}
              >
                <CheckSquare size={12} />
                Fix null-cart bug
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-zinc-800 px-2.5 py-1 text-xs font-mono text-zinc-500">
                <CheckSquare size={12} />
                Add unit test
              </span>
            </div>
            <span className="text-xs font-mono text-zinc-600 shrink-0">
              updated {seconds}s ago
            </span>
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"
            >
              <div className={`text-2xl md:text-3xl font-bold ${s.color} mb-1`}>
                {s.value}
              </div>
              <div className="text-xs text-zinc-500 leading-snug">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Trust strip ──────────────────────────────────────── */}
      <div className="border-y border-zinc-900 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 flex flex-col md:flex-row items-center gap-6 md:gap-12">
          <span className="text-xs font-mono text-zinc-600 shrink-0">
            BUILT FOR TEAMS WHO SHIP TOGETHER
          </span>
          <div className="flex flex-wrap items-center gap-x-10 gap-y-4 text-zinc-600 font-semibold tracking-wide text-sm">
            <span>NORTHPEAK</span>
            <span>LUMEN LABS</span>
            <span>ARBOR</span>
            <span>VELIN</span>
            <span>STACKYARD</span>
          </div>
        </div>
      </div>

      {/* ── Features ─────────────────────────────────────────── */}
      <section id="product" className="max-w-7xl mx-auto px-6 md:px-10 py-24">
        <div className="mb-14 max-w-2xl">
          <div className="font-mono text-xs text-sky-400 mb-3">THE PRODUCT</div>
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-50 mb-4">
            Everything happens in the room.
          </h2>
          <p className="text-zinc-400">
            No more "let's sync tomorrow." The people, the tasks, and the code
            all live in the same place, at the same time.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(({ icon: Icon, title, body, to, cta }) => (
            <Link
              key={title}
              to={to}
              className="group flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-950 p-6 hover:border-amber-400/60 transition-colors"
            >
              <div>
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-400 mb-5">
                  <Icon size={20} />
                </div>
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                  {title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{body}</p>
              </div>
              <div className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-zinc-300 group-hover:text-amber-400 transition-colors">
                {cta}
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Replaces your stack ──────────────────────────────── */}
      <section className="border-t border-zinc-900">
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-24">
          <div className="mb-10 max-w-2xl">
            <div className="font-mono text-xs text-violet-400 mb-3">
              ONE ROOM, NOT FOUR TABS
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-50 mb-4">
              CIRCLE replaces the tools you're juggling.
            </h2>
            <p className="text-zinc-400">
              You don't need a separate app for chat, another for tasks, and a
              third for pairing. It's one room per project.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 md:p-8">
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {REPLACES.map((r, i) => (
                <div
                  key={r.tool}
                  className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2"
                >
                  <span className="text-sm text-zinc-500 line-through decoration-zinc-700">
                    {r.tool}
                  </span>
                  <span className="text-xs text-zinc-600 font-mono hidden sm:block">
                    {r.forWhat}
                  </span>
                </div>
              ))}
            </div>
            <div className="my-6 flex items-center gap-3 text-zinc-700">
              <div className="h-px flex-1 bg-zinc-800" />
              <ArrowRight size={16} className="rotate-90" />
              <div className="h-px flex-1 bg-zinc-800" />
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-amber-400/10 text-amber-400">
                <Sparkles size={20} />
              </span>
              <div>
                <div className="font-semibold text-zinc-100">
                  One live room per project
                </div>
                <div className="text-sm text-zinc-500">
                  Chat, tasks, AI code, and history — already connected.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Analytics ────────────────────────────────────────── */}
      <section id="analytics" className="border-t border-zinc-900 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-24">
          <div className="mb-14 max-w-2xl">
            <div className="font-mono text-xs text-sky-400 mb-3">
              THE REPORT
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-50 mb-4">
              One project, every contribution.
            </h2>
            <p className="text-zinc-400">
              Collective reports roll up automatically. Individual contribution
              breakdowns tell you who's driving what — without anyone filling
              out a status update.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Contribution bar chart */}
            <div className="rounded-2xl border border-zinc-800 bg-black p-6">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-6">
                <BarChart3 size={14} className="text-amber-400" />
                CONTRIBUTION BY MEMBER
              </div>
              <div className="flex items-end gap-6 h-40">
                {CONTRIBUTIONS.map((c) => (
                  <div
                    key={c.name}
                    className="flex flex-col items-center gap-2 flex-1"
                  >
                    <div className="w-full flex items-end h-32 rounded-t-md overflow-hidden bg-zinc-900">
                      <div
                        className={`w-full ${c.color}`}
                        style={{ height: `${c.value}%` }}
                      />
                    </div>
                    <span className="text-xs text-zinc-500 font-mono">
                      {c.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity heatmap */}
            <div className="rounded-2xl border border-zinc-800 bg-black p-6">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-6">
                <History size={14} className="text-amber-400" />
                PROJECT ACTIVITY, LAST 60 DAYS
              </div>
              <div className="grid grid-cols-10 gap-1.5">
                {HEATMAP.map((v, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-sm ${heatColor(v)}`}
                  />
                ))}
              </div>
              <div className="mt-4 text-xs font-mono text-zinc-600">
                every square is a day · darker means more shipped
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 py-24">
        <div className="mb-14">
          <div className="font-mono text-xs text-sky-400 mb-3">
            HOW IT WORKS
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-50">
            From idea to shipped, in one room.
          </h2>
        </div>

        <div>
          {STEPS.map((step) => (
            <div
              key={step.n}
              className="flex flex-col sm:flex-row gap-4 sm:gap-8 border-b border-zinc-900 py-8"
            >
              <span className="font-mono text-2xl text-zinc-700 sm:w-16 shrink-0">
                {step.n}
              </span>
              <div>
                <h3 className="text-xl font-semibold text-zinc-100 mb-2">
                  {step.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed max-w-2xl">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section className="border-t border-zinc-900 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-24">
          <div className="mb-14 max-w-2xl">
            <div className="font-mono text-xs text-rose-400 mb-3">
              TEAMS ALREADY IN THE ROOM
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-50">
              Built with the teams who needed it.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-zinc-800 bg-black p-6 flex flex-col"
              >
                <div className="flex gap-0.5 mb-4 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed mb-6 flex-1">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <span
                    className={`h-9 w-9 rounded-full ${t.color} text-black text-xs font-bold flex items-center justify-center`}
                  >
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-zinc-100">
                      {t.name}
                    </div>
                    <div className="text-xs text-zinc-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────── */}
      <section id="pricing" className="border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-24">
          <div className="mb-14 max-w-2xl">
            <div className="font-mono text-xs text-sky-400 mb-3">PRICING</div>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-50 mb-4">
              Simple pricing, room to grow.
            </h2>
            <p className="text-zinc-400">
              Start free. Upgrade when your team outgrows one project.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 border flex flex-col ${
                  plan.highlighted
                    ? "border-amber-400 bg-zinc-950"
                    : "border-zinc-800 bg-zinc-950"
                }`}
              >
                {plan.highlighted && (
                  <span className="inline-flex w-fit items-center rounded-full bg-amber-400 text-black text-xs font-semibold px-3 py-1 mb-4">
                    Most popular
                  </span>
                )}
                <h3 className="text-lg font-semibold text-zinc-100 mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-zinc-500 mb-6">{plan.blurb}</p>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-zinc-50">
                    {plan.price}
                  </span>
                  <span className="text-sm text-zinc-500 ml-2">
                    {plan.period}
                  </span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-zinc-400"
                    >
                      <CheckSquare
                        size={16}
                        className="text-amber-400 mt-0.5 shrink-0"
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 font-semibold transition-colors ${
                    plan.highlighted
                      ? "bg-amber-400 text-black hover:bg-amber-300"
                      : "border border-zinc-700 text-zinc-200 hover:border-zinc-500"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-zinc-600">
            <span className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-amber-400" />
              SOC2-ready infrastructure
            </span>
            <span className="flex items-center gap-2">
              <Sparkles size={14} className="text-sky-400" />
              Data encrypted at rest & in transit
            </span>
            <span className="flex items-center gap-2">
              <Timer size={14} className="text-violet-400" />
              99.9% uptime target
            </span>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section className="border-t border-zinc-900">
        <div className="max-w-3xl mx-auto px-6 md:px-10 py-24">
          <div className="mb-10">
            <div className="font-mono text-xs text-sky-400 mb-3">QUESTIONS</div>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-50">
              Before you start a project.
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={item.q}
                  className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : i)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-sm font-medium text-zinc-200">
                      {item.q}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-zinc-500 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <p className="px-5 pb-4 text-sm text-zinc-400 leading-relaxed">
                      {item.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA banner ───────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-zinc-900 bg-zinc-950">
        <div className="pointer-events-none absolute top-0 left-1/4 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl -z-10" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl -z-10" />
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-zinc-50 mb-6">
            Bring your team into{" "}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
              the room.
            </span>
          </h2>
          <p className="text-zinc-400 mb-10 max-w-xl mx-auto">
            Create a project, add your collaborators, and see everything come
            together — chat, tasks, AI code, and the full history — in one
            place.
          </p>
          <Link
            to="/projects/new"
            className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-8 py-4 font-semibold text-black shadow-lg shadow-amber-400/20 hover:bg-amber-300 transition-colors"
          >
            Start Building Free
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-14 grid sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 font-mono text-lg font-bold text-zinc-50 mb-3">
              <Flame size={18} className="text-amber-400" />
              CIRCLE
            </div>
            <p className="text-sm text-zinc-500 max-w-xs">
              Where your team actually builds together — in real time, with AI,
              and a full record of how it happened.
            </p>
          </div>

          <div>
            <div className="text-xs font-mono text-zinc-600 mb-4">PRODUCT</div>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li>
                <Link to="/project/Dashboard" className="hover:text-zinc-100">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/project/create" className="hover:text-zinc-100">
                  New project
                </Link>
              </li>
              <li>
                <Link to="/rooms" className="hover:text-zinc-100">
                  Live rooms
                </Link>
              </li>
              <li>
                <Link to="/schedule" className="hover:text-zinc-100">
                  Schedule
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-mono text-zinc-600 mb-4">COMPANY</div>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li>
                <a href="#" className="hover:text-zinc-100">
                  About
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-zinc-100">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-zinc-100">
                  Social Media
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-mono text-zinc-600 mb-4">ACCOUNT</div>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li>
                <Link to="/user/profile" className="hover:text-zinc-100">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-zinc-100">
                  Log in
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-zinc-100">
                  Sign up
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-900 py-6 px-6 md:px-10 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
          <span>© {new Date().getFullYear()} CIRCLE. All rights reserved.</span>
          <span className="font-mono flex items-center gap-2">
            <LiveDot />3 rooms live right now
          </span>
        </div>
      </footer>
    </div>
  );
}
