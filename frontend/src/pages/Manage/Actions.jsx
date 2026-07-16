import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../config/axios";
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
import ProjectHealth from "../components/ProjectActions/ProjectHealth";
import HealthCard from "../components/ProjectActions/HealthCard";
import CreateChatModal from "../components/Work/CreateChatModal";
import AddUser from "../components/ProjectActions/AddUser";

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
function ActionButton({ icon: Icon, label, accent, danger, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-left transition-transform duration-150 hover:-translate-y-0.5"
      style={{
        background: surface,
        border: `1px solid ${danger ? `${C.collaboration}30` : border}`,
      }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${danger ? C.collaboration : accent}1A` }}
      >
        <Icon size={14} style={{ color: danger ? C.collaboration : accent }} />
      </div>
      <span
        className="text-xs font-medium"
        style={{ color: danger ? C.collaboration : "#E5E5E5" }}
      >
        {label}
      </span>
    </button>
  );
}

export default function Actions() {
  const [copied, setCopied] = useState(false);

  const [openChatModal, setOpenChatModal] = useState(false);

  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`/projects/getProject/${id}`, {
        withCredentials: true,
      });
      console.log(response.data.project);
      setProject(response.data.project);
      setUsers(response.data.project.users);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div
      className="min-h-screen w-full font-sans px-4 sm:px-6 py-6 sm:py-8"
      style={{ background: bg }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        {/* Header */}
        <button className="group mb-6 flex items-center gap-2 text-sm text-neutral-500 transition-all hover:text-cyan-400">
          <ArrowLeft
            size={15}
            className="transition-transform group-hover:-translate-x-1"
            onClick={() => {
              navigate("/project/Dashboard");
            }}
          />
          Back to Projects
        </button>

        {/* Project Overview */}

        <div
          className="rounded-3xl border p-7 lg:p-8"
          style={{
            background: surface,
            borderColor: border,
          }}
        >
          {/* Top */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            {/* Left */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  {project?.name}
                </h1>

                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold"
                  style={{
                    background: `${statusStyle[project?.status]?.dot}22`,
                    color: statusStyle[project?.status]?.text,
                  }}
                >
                  {project?.status.toUpperCase()}
                </span>
              </div>

              <p className="mt-5 max-w-3xl leading-7 text-neutral-400">
                {project?.desc}
              </p>
            </div>

            {/* Progress */}
            <div className="w-full lg:w-72 shrink-0">
              <div className="flex justify-between mb-2">
                <span className="text-xs uppercase tracking-widest text-neutral-500">
                  Completion
                </span>

                <span className="font-mono text-cyan-400">
                  {project?.progress}%
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${project?.progress}%`,
                    background: statusStyle[project?.status]?.dot,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              className="rounded-2xl border p-4"
              style={{ borderColor: border }}
            >
              <p className="text-[10px] uppercase tracking-widest text-neutral-500">
                Created
              </p>

              <h3 className="mt-2 text-sm text-white font-semibold">
                {new Date(project?.createdAt).toLocaleDateString()}
              </h3>

              <p className="mt-1 text-xs text-neutral-500">Initial creation</p>
            </div>

            <div
              className="rounded-2xl border p-4"
              style={{ borderColor: border }}
            >
              <p className="text-[10px] uppercase tracking-widest text-neutral-500">
                Updated
              </p>

              <h3 className="mt-2 text-sm text-white font-semibold">
                {project?.updatedAt &&
                !isNaN(new Date(project.updatedAt).getTime())
                  ? formatDistanceToNow(new Date(project.updatedAt), {
                      addSuffix: true,
                    })
                  : "N/A"}
              </h3>

              <p className="mt-1 text-xs text-neutral-500">Last modification</p>
            </div>

            <div
              className="rounded-2xl border p-4"
              style={{ borderColor: border }}
            >
              <p className="text-[10px] uppercase tracking-widest text-neutral-500">
                Contributors
              </p>

              <h3 className="mt-2 text-2xl font-bold text-cyan-400">
                {project?.users.length}
              </h3>

              <p className="mt-1 text-xs text-neutral-500">Acti ve members</p>
            </div>

            <div
              className="rounded-2xl border p-4"
              style={{ borderColor: border }}
            >
              <p className="text-[10px] uppercase tracking-widest text-neutral-500">
                Technologies
              </p>

              <h3 className="mt-2 text-2xl font-bold text-pink-400">
                {project?.stack.length}
              </h3>

              <p className="mt-1 text-xs text-neutral-500">Total stack</p>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mt-10">
            <p className="mb-4 text-[11px] uppercase tracking-[0.25em] text-neutral-500">
              Technology Stack
            </p>

            <div className="flex flex-wrap gap-3">
              {project?.stack.map((tech) => (
                <span
                  key={tech}
                  className="text-amber-100 rounded-xl border px-4 py-2 text-sm font-medium transition-all hover:border-cyan-500 hover:text-cyan-400"
                  style={{
                    borderColor: border,
                    background: "#050505",
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className=" flex justify-center gap-5 rounded-xl border border-zinc-800 bg-zinc-950 p-5 m-4 shadow-lg">
              <button
                onClick={() => navigate(`/project/${id}/work`)}
                className="rounded-lg bg-cyan-500 px-5 py-3  font-medium text-black transition-all duration-200 hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] active:scale-95"
              >
                <span>Start Working</span>
              </button>
              <button
                onClick={() => navigate(`/project/${id}/Schedule`)}
                className="rounded-lg bg-cyan-500 px-5 py-3 font-medium text-black transition-all duration-200 hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] active:scale-95"
              >
                <span>Schedule Working</span>
              </button>
            </div>
          </div>
        </div>

        {/* Actions grid */}
        <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-2.5">
          Actions
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-6">
          <ActionButton
            icon={UserPlus}
            label="Add user"
            accent={C.contribution}
            onClick={() => setOpenChatModal(true)}
          />
          <AddUser
            open={openChatModal}
            onClose={() => setOpenChatModal(false)}
          />
          <ActionButton
            icon={copied ? Check : Link2}
            label={copied ? "Link copied" : "Copy invite link"}
            accent={C.collaboration}
            onClick={() => {
              navigator.clipboard?.writeText(
                "https://devboard.io/invite/nimbus-api",
              );
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
          />
          <ActionButton icon={Crown} label="Assign lead" accent={C.focus} />
          <ActionButton
            icon={CalendarClock}
            label="Set deadline"
            accent={C.workflow}
          />
          <ActionButton
            icon={FileDown}
            label="Export report"
            accent={C.contribution}
          />
          <ActionButton
            icon={Activity}
            label="View activity log"
            accent={C.collaboration}
          />
          <ActionButton
            icon={Archive}
            label="Archive project"
            accent="#8A8A8A"
          />
          <ActionButton icon={LogOut} label="Leave project" accent="#8A8A8A" />
          <ActionButton icon={Trash2} label="Delete project" danger />
        </div>

        <ProjectHealth />

        {/* USERS */}
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Project Members
              </p>
              <p className="mt-1 text-sm text-neutral-400">
                {users.length} {users.length === 1 ? "member" : "members"}
              </p>
            </div>

            <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
              {users.length}
            </div>
          </div>

          <div
            className="overflow-hidden rounded-2xl"
            style={{
              background: surface,
              border: `1px solid ${border}`,
            }}
          >
            {users.map((m, index) => (
              <div
                key={m._id}
                className={`group flex items-center justify-between px-5 py-4 transition-all duration-200 hover:bg-white/[0.03] ${
                  index !== users.length - 1 ? "border-b" : ""
                }`}
                style={{
                  borderColor: border,
                }}
              >
                <div className="flex min-w-0 items-center gap-4">
                  {/* Avatar */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-sm font-semibold text-black shadow-lg shadow-cyan-500/20">
                    {m.username?.charAt(0).toUpperCase()}
                  </div>

                  {/* User Info */}
                  <div className="min-w-0">
                    <h4 className="truncate text-sm font-semibold text-white">
                      {m.username}
                    </h4>

                    <p className="truncate text-xs text-neutral-500">
                      {m.email || "No email available"}
                    </p>
                  </div>
                </div>

                {/* Badge */}
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                  Member
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
