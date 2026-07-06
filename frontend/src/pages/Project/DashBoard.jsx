import React, { useState, useMemo } from "react";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
  Users, MessageSquareText, Brain, GitBranch, ArrowUpRight,
  Flame, GitPullRequest, Circle, CheckCircle2, Clock,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Design tokens
// ---------------------------------------------------------------------------
const C = {
  contribution: "#22D3EE", // cyan
  collaboration: "#F472B6", // pink
  focus: "#FBBF24", // amber
  workflow: "#A3E635", // lime
};

const bg = "#000000";
const surface = "#0A0A0A";
const border = "#1A1A1A";
const muted = "#6B6B6B";

// ---------------------------------------------------------------------------
// Minimal sample data
// ---------------------------------------------------------------------------
const contributionData = [
  { name: "Aria", commits: 32 },
  { name: "Neel", commits: 21 },
  { name: "Sam", commits: 27 },
  { name: "Priya", commits: 14 },
];

const collaborationData = [
  { day: "Mon", mins: 18 },
  { day: "Tue", mins: 12 },
  { day: "Wed", mins: 22 },
  { day: "Thu", mins: 9 },
  { day: "Fri", mins: 15 },
];

const focusData = [
  { name: "Deep work", value: 68 },
  { name: "Interrupted", value: 32 },
];

const workflowData = [
  { day: "W1", done: 8 },
  { day: "W2", done: 13 },
  { day: "W3", done: 11 },
  { day: "W4", done: 19 },
];

const projects = [
  {
    name: "Nimbus API",
    desc: "Realtime order-sync microservice",
    status: "Active",
    progress: 72,
    stack: ["Node", "Express", "Mongo"],
    updated: "2h ago",
  },
  {
    name: "Pulse Dashboard",
    desc: "Internal analytics client",
    status: "Review",
    progress: 91,
    stack: ["React", "Tailwind"],
    updated: "5h ago",
  },
  {
    name: "Auth Gateway",
    desc: "SSO + token refresh service",
    status: "Blocked",
    progress: 40,
    stack: ["Node", "Redis"],
    updated: "1d ago",
  },
  {
    name: "Vault CLI",
    desc: "Internal secrets tool",
    status: "Active",
    progress: 58,
    stack: ["Node", "CLI"],
    updated: "3d ago",
  },
];

const statusStyle = {
  Active: { dot: "#A3E635", text: "#A3E635" },
  Review: { dot: "#FBBF24", text: "#FBBF24" },
  Blocked: { dot: "#F472B6", text: "#F472B6" },
};

// 28-day activity pulse — each day's dominant work type gets a color
const pulseTypes = ["contribution", "collaboration", "focus", "workflow", "off"];
const pulse = Array.from({ length: 28 }, (_, i) => {
  const seed = (i * 37) % 100;
  if (seed < 8) return "off";
  return pulseTypes[(i * 7 + (seed % 5)) % 4];
});
const pulseColor = (t) => (t === "off" ? "#141414" : C[t]);

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------
function StatCard({ label, value, icon: Icon, accent }) {
  return (
    <div
      className="rounded-2xl p-4 flex items-center gap-3 transition-transform duration-200 hover:-translate-y-0.5"
      style={{ background: surface, border: `1px solid ${border}` }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${accent}1A` }}
      >
        <Icon size={18} style={{ color: accent }} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wider text-neutral-500 truncate">{label}</p>
        <p className="text-xl font-bold text-white font-mono leading-tight">{value}</p>
      </div>
    </div>
  );
}

function CardShell({ accent, icon: Icon, title, tag, stat, statLabel, why, children }) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden group"
      style={{ background: surface, border: `1px solid ${border}` }}
    >
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
        style={{ background: accent }}
      />
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: `${accent}1A`, border: `1px solid ${accent}33` }}
          >
            <Icon size={16} style={{ color: accent }} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white leading-tight">{title}</h3>
            <p className="text-[10px] uppercase tracking-wider" style={{ color: accent }}>{tag}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-white font-mono leading-none">{stat}</p>
          <p className="text-[10px] text-neutral-500 mt-0.5">{statLabel}</p>
        </div>
      </div>

      <div className="h-[110px] -mx-2">{children}</div>

      <p className="text-[11px] text-neutral-500 leading-snug border-t pt-2" style={{ borderColor: border }}>
        <span className="font-semibold" style={{ color: `${accent}CC` }}>Why it matters — </span>
        {why}
      </p>
    </div>
  );
}

const tooltipStyle = {
  background: "#0F0F0F",
  border: `1px solid ${border}`,
  borderRadius: 10,
  fontSize: 11,
  color: "#fff",
};

// ---------------------------------------------------------------------------
// Main dashboard
// ---------------------------------------------------------------------------
export default function Dashboard() {
  const [page, setPage] = useState("overview");
  const streak = 12;

  if (page === "deep") {
    return <DeepAnalysisPage onBack={() => setPage("overview")} />;
  }

  return (
    <div className="min-h-screen w-full font-sans" style={{ background: bg }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <GitBranch size={18} className="text-lime-400" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg tracking-tight">ctrl ( C + V ) </h1>
              <p className="text-[11px] text-neutral-500 -mt-0.5">Project Analytics</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1.5 border" style={{ borderColor: border, background: surface }}>
              <Flame size={14} className="text-amber-400" />
              <span className="text-xs font-mono text-white">{streak} day streak</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 via-pink-400 to-lime-400 p-[2px]">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[11px] font-bold text-white">AR</div>
            </div>
          </div>
        </header>

        {/* Activity pulse strip — signature element */}
        <section
          className="rounded-2xl p-4 mb-8 flex flex-col sm:flex-row sm:items-center gap-4"
          style={{ background: surface, border: `1px solid ${border}` }}
        >
          <div className="shrink-0">
            <p className="text-xs font-semibold text-white">Activity pulse</p>
            <p className="text-[10px] text-neutral-500">last 28 days · dominant work type</p>
          </div>
          <div className="flex gap-1 flex-wrap flex-1">
            {pulse.map((t, i) => (
              <div
                key={i}
                title={t}
                className="w-4 h-4 rounded-[4px]"
                style={{ background: pulseColor(t) }}
              />
            ))}
          </div>
          <div className="flex gap-3 flex-wrap text-[10px] text-neutral-500 shrink-0">
            {Object.entries(C).map(([k, v]) => (
              <span key={k} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm inline-block" style={{ background: v }} />
                {k}
              </span>
            ))}
          </div>
        </section>

        {/* Top stats */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <StatCard label="Projects" value="4" icon={GitBranch} accent={C.workflow} />
          <StatCard label="Open PRs" value="7" icon={GitPullRequest} accent={C.collaboration} />
          <StatCard label="Team" value="5" icon={Users} accent={C.contribution} />
          <StatCard label="Velocity" value="+18%" icon={ArrowUpRight} accent={C.focus} />
        </section>

        {/* Analytics + CTA */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-white font-bold text-lg">Team analytics</h2>
              <p className="text-xs text-neutral-500">how the team actually works, not just what it ships</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Contribution */}
              <CardShell
                accent={C.contribution}
                icon={Users}
                title="Contribution"
                tag="ownership"
                stat="94"
                statLabel="commits / wk"
                why="Prevents free-riding by surfacing individual effort and task ownership."
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={contributionData} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fill: muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#ffffff08" }} />
                    <Bar dataKey="commits" radius={[6, 6, 0, 0]} fill={C.contribution} />
                  </BarChart>
                </ResponsiveContainer>
              </CardShell>

              {/* Collaboration */}
              <CardShell
                accent={C.collaboration}
                icon={MessageSquareText}
                title="Collaboration"
                tag="response time"
                stat="15m"
                statLabel="avg reply"
                why="Reveals team friction through communication patterns and response times."
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={collaborationData} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
                    <XAxis dataKey="day" tick={{ fill: muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line type="monotone" dataKey="mins" stroke={C.collaboration} strokeWidth={2.5} dot={{ r: 3, fill: C.collaboration }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardShell>

              {/* Focus */}
              <CardShell
                accent={C.focus}
                icon={Brain}
                title="Focus"
                tag="deep work"
                stat="68%"
                statLabel="uninterrupted"
                why="Identifies productivity loss from interruptions vs. real deep-work hours."
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={focusData} dataKey="value" innerRadius={30} outerRadius={45} paddingAngle={4} stroke="none">
                      <Cell fill={C.focus} />
                      <Cell fill="#2A2A2A" />
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </CardShell>

              {/* Workflow */}
              <CardShell
                accent={C.workflow}
                icon={GitBranch}
                title="Workflow"
                tag="throughput"
                stat="19"
                statLabel="tasks / wk"
                why="Finds process inefficiencies via completion time, blockers and dependencies."
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={workflowData} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="wf" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={C.workflow} stopOpacity={0.5} />
                        <stop offset="100%" stopColor={C.workflow} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" tick={{ fill: muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Area type="monotone" dataKey="done" stroke={C.workflow} strokeWidth={2.5} fill="url(#wf)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardShell>
            </div>

            {/* More analysis CTA */}
            <button
              onClick={() => setPage("deep")}
              className="lg:col-span-1 rounded-2xl p-5 flex flex-col justify-between text-left relative overflow-hidden group transition-transform duration-200 hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(160deg, #0A0A0A 0%, #0A0A0A 60%, #111 100%)",
                border: `1px solid ${border}`,
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle at 30% 20%, ${C.contribution}22, transparent 40%), radial-gradient(circle at 80% 80%, ${C.collaboration}22, transparent 40%)`,
                }}
              />
              <div className="relative">
                <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-2">Go deeper</p>
                <h3 className="text-white font-bold text-xl leading-snug">More<br />analysis</h3>
                <p className="text-xs text-neutral-500 mt-3 leading-snug">
                  Per-person breakdowns, historical trends and blocker timelines across all four lenses.
                </p>
              </div>
              <div className="relative flex items-center gap-2 text-sm font-semibold text-white mt-6">
                Open report
                <ArrowUpRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </button>
          </div>
        </section>

        {/* Projects */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-white font-bold text-lg">Projects</h2>
              <p className="text-xs text-neutral-500">everything currently in flight</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((p) => (
              <div
                key={p.name}
                className="rounded-2xl p-5 transition-transform duration-200 hover:-translate-y-0.5"
                style={{ background: surface, border: `1px solid ${border}` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-semibold text-sm">{p.name}</h3>
                    <p className="text-xs text-neutral-500 mt-0.5">{p.desc}</p>
                  </div>
                  <span
                    className="flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-full shrink-0"
                    style={{ background: `${statusStyle[p.status].dot}1A`, color: statusStyle[p.status].text }}
                  >
                    <Circle size={6} fill="currentColor" stroke="none" />
                    {p.status}
                  </span>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-[10px] text-neutral-500 mb-1">
                    <span>Progress</span>
                    <span className="font-mono text-neutral-300">{p.progress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${p.progress}%`, background: statusStyle[p.status].dot }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-1.5 flex-wrap">
                    {p.stack.map((s) => (
                      <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-neutral-400">
                        {s}
                      </span>
                    ))}
                  </div>
                  <span className="flex items-center gap-1 text-[10px] text-neutral-500 shrink-0">
                    <Clock size={11} />
                    {p.updated}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-10 pt-6 border-t flex items-center justify-between" style={{ borderColor: border }}>
          <p className="text-[11px] text-neutral-600">devboard · built for teams who ship</p>
          <GitBranch size={14} className="text-neutral-600" />
        </footer>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Placeholder "deep analysis" page (to be designed later)
// ---------------------------------------------------------------------------
function DeepAnalysisPage({ onBack }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center font-sans" style={{ background: bg }}>
      <div className="text-center px-6">
        <p className="text-xs uppercase tracking-widest mb-3" style={{ color: C.collaboration }}>coming soon</p>
        <h1 className="text-white font-bold text-2xl mb-2">Deep analysis report</h1>
        <p className="text-neutral-500 text-sm mb-6 max-w-sm mx-auto">
          This is a placeholder for the detailed, per-person breakdown page we'll design next.
        </p>
        <button
          onClick={onBack}
          className="text-sm font-semibold px-4 py-2 rounded-full border text-white hover:bg-white/5 transition-colors"
          style={{ borderColor: border }}
        >
          ← Back to dashboard
        </button>
      </div>
    </div>
  );
}