import React, { useEffect } from "react";
import axios from "../../../config/axios";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

import {
  Users,
  MessageSquareText,
  Brain,
  GitBranch,
  ArrowUpRight,
  Flame,
  GitPullRequest,
  Circle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const bg = "#000000";
const surface = "#0A0A0A";
const border = "#1A1A1A";
const muted = "#6B6B6B";

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

const Projects = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get("projects/getAllProjects", {
        withCredentials: true,
      });
      console.log(response.data.projects);
      setProjects(response.data.projects);
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

  if (loading) {
    return <div className="text-white">Loading projects...</div>;
  }
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }
  return (
    <section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projects.map((p) => (
          <div
            key={p._id}
            className="rounded-2xl p-5 transition-transform duration-200 hover:-translate-y-0.5"
            style={{ background: surface, border: `1px solid ${border}` }}
            onClick={() => {
              navigate(`/project/${p._id}/work`);
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-white font-semibold text-sm">{p.name}</h3>
                {/* <p className="text-xs text-neutral-500 mt-0.5">{p.desc}</p> */}
              </div>
              <span
                className="flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-full shrink-0"
                style={{
                  background: `${statusStyle[p.status].dot}1A`,
                  color: statusStyle[p.status].text,
                }}
              >
                <Circle size={6} fill="currentColor" stroke="none" />
                {p.status}
              </span>
            </div>

            <div className="mb-3">
              <div className="flex justify-between text-[10px] text-neutral-500 mb-1">
                <span>Progress</span>
                <span className="font-mono text-neutral-300">
                  {p.progress}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${p.progress}%`,
                    background: statusStyle[p.status].dot,
                  }}
                />
              </div>
            </div>
{/* 
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5 flex-wrap">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-neutral-400"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <span className="flex items-center gap-1 text-[10px] text-neutral-500 shrink-0">
                <Clock size={11} />

                {formatDistanceToNow(new Date(p.updatedAt), {
                  addSuffix: true,
                })}
              </span>
            </div> */}
          </div>
          
        ))}
      </div>
    </section>
  );
};

export default Projects;
