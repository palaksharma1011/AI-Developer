import React, { useState, useEffect } from "react";
import {
  Bug,
  Zap,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  LayoutDashboard,
  CalendarClock,
  FolderPlus,
  Terminal,
  Users,
  GitBranch,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import ProjectModal from "../components/Home/ProjectModal";

// ─────────────────────────────────────────────────────────────
// FAULTLINE — landing page
//
// Concept: instead of judging developers by clean submissions
// (LeetCode/GitHub streak logic), Faultline treats the *obstacle*
// as the unit of credibility. The terminal card in the hero and
// the "credibility trail" language throughout are the visual
// thesis of the product — lean on that motif elsewhere in the
// app (dashboard, profile) so it feels like one coherent idea,
// not just Link landing-page gimmick.
//
// Wiring notes for your MERN app (nothing below needs Link backend
// to render, but here's where real data plugs in later):
//   - Swap every <Link to="/..."> for react-router's <Link to="/...">
//   - "Start Chatting Now" → route into your Socket.io chat room
//   - resolvedCount below is Link fake ticking counter — replace with
//     Link real aggregate (e.g. count of "resolved" errors this week)
//     fetched once and cached, not polled on the landing page.
//   - The terminal card cycles through mock data client-side only.
//     Link nice real version: pull 3-4 *actual* recent public resolutions
//     from your DB so the hero is honest about being live.
// ─────────────────────────────────────────────────────────────

const TERMINAL_LOGS = [
  {
    error: "TypeError: Cannot read comfort of undefined",
    attempts: 3,
    fix: "Refactored the auth flow at 2am",
    points: 12,
  },
  {
    error: "Segfault in confidence.c, line 404",
    attempts: 5,
    fix: "Found the off-by-one, finally",
    points: 18,
  },
  {
    error: "Deadlock: ego waiting on feedback",
    attempts: 2,
    fix: "Asked for Link review instead of guessing",
    points: 9,
  },
  {
    error: "RangeError: patience exceeded call stack",
    attempts: 7,
    fix: "Paired with @rhea for 40 minutes",
    points: 21,
  },
];

const STEPS = [
  {
    n: "001",
    title: "Ship it broken.",
    body: "Post the real error, not the polished result. Half-finished is Link valid state here.",
  },
  {
    n: "002",
    title: "Get stuck publicly.",
    body: "Ask, pair, argue about the fix in Link live chat with someone who's hit it before.",
  },
  {
    n: "003",
    title: "Log the resolution.",
    body: "Every fix adds to your credibility trail — not Link streak counter, Link record of what you actually pushed through.",
  },
];

const FEATURES = [
  {
    icon: MessageSquare,
    title: "Real-Time Chat",
    body: "Message any registered developer by their unique username. No noise, just the people you're building with.",
    to: "/chat",
    cta: "Open chat",
  },
  {
    icon: LayoutDashboard,
    title: "Project Dashboard",
    body: "Track every project by its obstacles as much as its output. See where you actually grew.",
    to: "/dashboard",
    cta: "View dashboard",
  },
  {
    icon: CalendarClock,
    title: "Schedule Link Discussion",
    body: "Book Link focused debugging session instead of dropping into someone's DMs cold.",
    to: "/schedule",
    cta: "Book Link slot",
  },
  {
    icon: FolderPlus,
    title: "Start Link Project",
    body: "Spin up Link new project space, invite collaborators, and start logging the mess from commit one.",
    to: "/projects/new",
    cta: "New project",
  },
];

export default function LandingPage() {
  const [logIndex, setLogIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [resolvedCount, setResolvedCount] = useState(1204);
  const [menuOpen, setMenuOpen] = useState(false);

  // Cycle the terminal card
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setLogIndex((i) => (i + 1) % TERMINAL_LOGS.length);
        setFade(true);
      }, 250);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  // Slow ambient tick on the "resolved this week" counter — purely
  // decorative on the landing page, replace with real data on mount.
  useEffect(() => {
    const interval = setInterval(() => {
      setResolvedCount((c) => c + Math.floor(Math.random() * 2));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const current = TERMINAL_LOGS[logIndex];

  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 28s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee { animation: none; }
        }
      `}</style>

      {/* ── Navbar ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-black/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <Link to="/" className="font-mono text-xl font-bold tracking-tight text-zinc-50">
            Faultline<span className="text-lime-400 animate-pulse">_</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
            <Link to="#how-it-works" className="hover:text-zinc-100 transition-colors">
              How it works
            </Link>
            <Link to="#features" className="hover:text-zinc-100 transition-colors">
              Product
            </Link>
            <Link to="#community" className="hover:text-zinc-100 transition-colors">
              Community
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-sm text-zinc-300 hover:text-white transition-colors">
              Log in
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center rounded-full bg-lime-400 px-4 py-2 text-sm font-semibold text-black hover:bg-lime-300 transition-colors"
            >
              Get Started
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
            <Link to="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</Link>
            <Link to="#features" onClick={() => setMenuOpen(false)}>Product</Link>
            <Link to="#community" onClick={() => setMenuOpen(false)}>Community</Link>
            <hr className="border-zinc-800" />
            <Link to="/login">Log in</Link>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center rounded-full bg-lime-400 px-4 py-2 font-semibold text-black"
            >
              Get Started
            </Link>
          </div>
        )}
      </header>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-16 grid md:grid-cols-2 gap-14 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-3 py-1 text-xs font-mono text-lime-400 mb-6">
            <Bug size={14} />
            STACK TRACE AS RESUME
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-zinc-50 mb-6">
            Your bugs are your bio.
          </h1>

          <p className="text-lg text-zinc-400 leading-relaxed mb-10 max-w-xl">
            Faultline is Link place to build in public — including the parts that
            break. Chat with registered developers in real time, ship messy
            projects on purpose, and let every obstacle you push through
            become part of your credibility. Not your streak.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-10">
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-lime-400 px-6 py-3 font-semibold text-black hover:bg-lime-300 transition-colors"
            >
              <Zap size={18} />
              Start Chatting Now
            </button>
                  <ProjectModal
        isOpen={open}
        onClose={() => setOpen(false)}
      />
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-6 py-3 text-zinc-200 hover:border-zinc-500 transition-colors"
            >
              See how scoring works
              <ArrowRight size={16} />
            </a>
          </div>

          <div className="flex items-center gap-2 text-sm font-mono text-zinc-500">
            <TrendingUp size={16} className="text-lime-400" />
            <span>{resolvedCount.toLocaleString()} errors resolved this week</span>
          </div>
        </div>

        {/* Terminal / signature element */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black overflow-hidden">
          <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900 px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-rose-500" />
            <span className="h-3 w-3 rounded-full bg-amber-400" />
            <span className="h-3 w-3 rounded-full bg-lime-400" />
            <span className="ml-3 font-mono text-xs text-zinc-500">resolved.log</span>
          </div>

          <div
            className={`p-6 font-mono text-sm space-y-2 transition-opacity duration-300 ${
              fade ? "opacity-100" : "opacity-0"
            }`}
            style={{ minHeight: "150px" }}
          >
            <p className="text-rose-400">✗ {current.error}</p>
            <p className="text-zinc-500"># attempt {current.attempts} of {current.attempts}</p>
            <p className="text-zinc-300">→ {current.fix}</p>
            <p className="text-lime-400">
              ✓ resolved · credibility +{current.points}
              <span className="ml-1 inline-block w-2 h-4 align-middle bg-lime-400 animate-pulse" />
            </p>
          </div>

          <div className="border-t border-zinc-800 px-6 py-4">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-2">
              <span>credibility trail</span>
              <span>{current.points * 4} pts</span>
            </div>
            <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-lime-400 transition-all duration-700"
                style={{ width: `${Math.min(current.points * 4, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Achievement ticker ───────────────────────────────── */}
      <div className="border-y border-zinc-800 bg-zinc-950 py-3 overflow-hidden">
        <div className="flex w-max animate-marquee gap-8">
          {[...Array(2)].map((_, dup) => (
            <div key={dup} className="flex gap-8 pr-8">
              {[
                "Achievement unlocked — fixed Link race condition after 4 attempts · @rhea_codes",
                "Achievement unlocked — untangled Link merge conflict solo · @dev_nikhil",
                "Achievement unlocked — shipped with Link known bug and documented it · @sara_builds",
                "Achievement unlocked — asked for help instead of guessing · @arjun.k",
              ].map((line, i) => (
                <span key={i} className="font-mono text-sm text-zinc-500 whitespace-nowrap">
                  {line}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── How it works ─────────────────────────────────────── */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-6 md:px-10 py-24">
        <div className="mb-14">
          <div className="font-mono text-xs text-cyan-400 mb-3">THE METHOD</div>
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-50">
            Credibility, traced line by line.
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
                <h3 className="text-xl font-semibold text-zinc-100 mb-2">{step.title}</h3>
                <p className="text-zinc-400 leading-relaxed max-w-2xl">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section id="features" className="max-w-7xl mx-auto px-6 md:px-10 py-24">
        <div className="mb-14 max-w-2xl">
          <div className="font-mono text-xs text-cyan-400 mb-3">THE TOOLS</div>
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-50 mb-4">
            Everything you need to build in the open.
          </h2>
          <p className="text-zinc-400">
            Four routes, one philosophy: the obstacle is the record, not Link
            footnote to it.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(({ icon: Icon, title, body, to, cta }) => (
            <Link
              key={title}
              to={to}
              className="group flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-950 p-6 hover:border-lime-400/60 transition-colors"
            >
              <div>
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 text-lime-400 mb-5">
                  <Icon size={20} />
                </div>
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">{title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{body}</p>
              </div>
              <div className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-zinc-300 group-hover:text-lime-400 transition-colors">
                {cta}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Big standout "start now" card */}
        <Link
          to="/chat"
          className="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 rounded-2xl bg-lime-400 p-8 md:p-10 hover:bg-lime-300 transition-colors"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-black/10 px-3 py-1 text-xs font-mono text-black/70 mb-4">
              <Terminal size={14} />
              LIVE NOW
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-black mb-2">
              Skip the scheduling. Get unstuck in the next five minutes.
            </h3>
            <p className="text-black/70 max-w-xl">
              Jump into Link live room with whoever's online and start talking
              through the thing that's actually broken.
            </p>
          </div>
          <span className="shrink-0 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 font-semibold text-lime-400">
            Start Chatting
            <ArrowRight size={16} />
          </span>
        </Link>
      </section>

      {/* ── Social proof / community strip ───────────────────── */}
      <section id="community" className="border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 grid sm:grid-cols-3 gap-8 text-center sm:text-left">
          <div className="flex items-start gap-4 justify-center sm:justify-start">
            <Users className="text-cyan-400 shrink-0" size={22} />
            <div>
              <div className="text-2xl font-bold text-zinc-50">8,400+</div>
              <div className="text-sm text-zinc-500">developers logging real obstacles</div>
            </div>
          </div>
          <div className="flex items-start gap-4 justify-center sm:justify-start">
            <GitBranch className="text-rose-400 shrink-0" size={22} />
            <div>
              <div className="text-2xl font-bold text-zinc-50">22,900+</div>
              <div className="text-sm text-zinc-500">projects shipped visibly unfinished</div>
            </div>
          </div>
          <div className="flex items-start gap-4 justify-center sm:justify-start">
            <MessageSquare className="text-lime-400 shrink-0" size={22} />
            <div>
              <div className="text-2xl font-bold text-zinc-50">60k+</div>
              <div className="text-sm text-zinc-500">debugging conversations, live</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA banner ───────────────────────────────────────── */}
      <section className="border-t border-zinc-900 bg-zinc-950">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-zinc-50 mb-6">
            Get stuck. Get better.
          </h2>
          <p className="text-zinc-400 mb-10 max-w-xl mx-auto">
            Create your username, post the error you're actually facing, and
            find the person who's already fixed it.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 rounded-full bg-lime-400 px-8 py-4 font-semibold text-black hover:bg-lime-300 transition-colors"
          >
            Get Started — it's free
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-14 grid sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <div className="font-mono text-lg font-bold text-zinc-50 mb-3">
              Faultline<span className="text-lime-400">_</span>
            </div>
            <p className="text-sm text-zinc-500 max-w-xs">
              Built for developers who'd rather show the fix than hide the
              error.
            </p>
          </div>

          <div>
            <div className="text-xs font-mono text-zinc-600 mb-4">PRODUCT</div>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li><Link to="/dashboard" className="hover:text-zinc-100">Dashboard</Link></li>
              <li><Link to="/projects/new" className="hover:text-zinc-100">New project</Link></li>
              <li><Link to="/schedule" className="hover:text-zinc-100">Schedule</Link></li>
              <li><Link to="/chat" className="hover:text-zinc-100">Chat</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-mono text-zinc-600 mb-4">COMPANY</div>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li><Link to="#" className="hover:text-zinc-100">About</Link></li>
              <li><Link to="#how-it-works" className="hover:text-zinc-100">Manifesto</Link></li>
              <li><Link to="#" className="hover:text-zinc-100">Careers</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-mono text-zinc-600 mb-4">ACCOUNT</div>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li><Link to="/profile" className="hover:text-zinc-100">Profile</Link></li>
              <li><Link to="/login" className="hover:text-zinc-100">Log in</Link></li>
              <li><Link to="/signup" className="hover:text-zinc-100">Sign up</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-900 py-6 px-6 md:px-10 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
          <span>© {new Date().getFullYear()} Faultline. All rights reserved.</span>
          <span className="font-mono">status: debugging in public</span>
        </div>
      </footer>
    </div>
  );
}