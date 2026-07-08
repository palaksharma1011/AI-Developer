import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../../config/axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { formatDistanceToNow } from "date-fns";

import {
  ArrowLeft,
  UserPlus,
  Link2,
  Crown,
  CalendarClock,
  Archive,
  Trash2,
  FileDown,
  Activity,
  LogOut,
  X,
  Check,
  Copy,
  ChevronDown,
} from "lucide-react";
import HealthCard from "./HealthCard";

// ---------------------------------------------------------------------------
// Design tokens — kept identical to the main dashboard
// ---------------------------------------------------------------------------
const C = {
  contribution: "#22D3EE",
  collaboration: "#F472B6",
  focus: "#FBBF24",
  workflow: "#A3E635",
};
const bg = "#000000";
const surface = "#0A0A0A";
const border = "#1A1A1A";

const project = { name: "Nimbus API", status: "Active", progress: 72 };

const initialMembers = [
  { name: "Aria Rahman", initials: "AR", role: "Owner" },
  { name: "Neel Kapoor", initials: "NK", role: "Editor" },
  { name: "Sam Torres", initials: "ST", role: "Editor" },
  { name: "Priya Nair", initials: "PN", role: "Viewer" },
];

const roleColor = { Owner: C.focus, Editor: C.contribution, Viewer: "#8A8A8A" };

const activity = [
  { text: "Sam merged branch fix/token-refresh", time: "2h ago" },
  { text: "Priya commented on task #182", time: "5h ago" },
  { text: "Neel moved 3 tasks to Done", time: "1d ago" },
];
const statusStyle = {
  planning: {
    dot: "#2563EB", // Royal Blue
    text: "#2563EB",
  },
  "in progress": {
    dot: "#14B8A6", // Teal
    text: "#14B8A6",
  },
  testing: {
    dot: "#F97316", // Vibrant Orange
    text: "#F97316",
  },
  "in review": {
    dot: "#8B5CF6", // Violet
    text: "#8B5CF6",
  },
  complete: {
    dot: "#22C55E", // Emerald Green
    text: "#22C55E",
  },
};

const ProjectHealth = () => {
    const [showHealthCard,setShowHealthCard]=useState(false);
  return (
    <section className="Project-Health">
      {/* ===================== Project Intelligence ===================== */}
      <div
        className="relative overflow-hidden rounded-3xl border p-6 mb-8"
        style={{
          background: surface,
          borderColor: `${C.collaboration}35`,
        }}
      >
        {/* Background Glow */}
        <div
          className="absolute -top-16 -right-12 h-48 w-48 rounded-full blur-3xl opacity-20"
          style={{ background: C.collaboration }}
        />
        <div
          className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full blur-3xl opacity-10"
          style={{ background: C.focus }}
        />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-500">
                Project Intelligence
              </p>

              <h2 className="text-2xl font-bold text-white mt-2">
                AI Project Health
              </h2>

              <p className="text-sm text-neutral-400 mt-1">
                Real-time behavioural and productivity insights for your project.
              </p>
            </div>

            <button
              className="rounded-xl px-4 py-2 text-sm font-semibold transition hover:scale-[1.03]"
              style={{
                background: C.collaboration,
                color: "#000",
              }}
              onClick={()=>{setShowHealthCard(true)}}
            >
              Run Analysis
            </button>
          </div>

          {/* Metrics */}
          {showHealthCard && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {/* Productivity */}
            <HealthCard
              emoji="🟢"
              title="Productivity Score"
              value="89%"
              subtitle="Excellent momentum this week."
              accent={C.contribution}
            />

            {/* Deadline */}
            <HealthCard
              emoji="🎯"
              title="Deadline Risk"
              value="Low"
              subtitle="Estimated completion before deadline."
              accent={C.workflow}
            />

            {/* Bottlenecks */}
            <HealthCard
              emoji="⚠️"
              title="Current Bottleneck"
              value="Backend APIs"
              subtitle="3 blocked tasks waiting."
              accent="#F59E0B"
            />

            {/* Collaboration */}
            <HealthCard
              emoji="🤝"
              title="Collaboration"
              value="91%"
              subtitle="Strong team interaction."
              accent={C.collaboration}
            />

            {/* Consistency */}
            <HealthCard
              emoji="🔥"
              title="Team Consistency"
              value="76%"
              subtitle="2 members inactive recently."
              accent={C.focus}
            />

            {/* AI Recommendation */}
            <div
              className="rounded-2xl border p-5 flex flex-col justify-between"
              style={{
                borderColor: `${C.collaboration}25`,
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <div>
                <p className="text-xs uppercase tracking-wider text-neutral-500 mb-2">
                  💡 AI Recommendation
                </p>

                <p className="text-white leading-relaxed text-sm">
                  Redistribute backend tasks and schedule a{" "}
                  <span className="font-semibold" style={{ color: C.focus }}>
                    30-minute focus sprint
                  </span>{" "}
                  to reduce delivery risk.
                </p>
              </div>

              <button
                className="mt-5 w-fit rounded-lg px-4 py-2 text-xs font-semibold transition hover:opacity-90"
                style={{
                  background: `${C.focus}20`,
                  color: C.focus,
                }}
              >
                View Full Report →
              </button>
            </div>
          </div>
          )}


        </div>
      </div>
    </section>
  );
};

export default ProjectHealth;
