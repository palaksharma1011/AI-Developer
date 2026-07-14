import React from "react";
import {
  Mail,
  GitBranch,
  MapPin,
  Clock,
  Flame,
  FolderGit2,
  CheckCircle2,
  LogOut,
  Pencil,
  Star,
} from "lucide-react";
// import { UserContext } from "../../context/User.context";
// import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "../../config/axios";
import { useState } from "react";
import { toast } from "react-toastify";

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

// const user = {
//   name: "Aria Rahman",
//   role: "Full-stack Developer",
//   email: "aria.rahman@devboard.io",
//   github: "@ariacodes",
//   location: "Bengaluru, IN",
//   timezone: "GMT+5:30",
//   joined: "Mar 2024",
//   team: "Platform Squad",
//   bio: "Ships backend systems that don't page anyone at 3am. Coffee-driven.",
//   skills: ["Node.js", "MongoDB", "React", "Docker", "Redis"],
// };

const stats = [
  {
    label: "Active projects",
    value: "4",
    icon: FolderGit2,
    accent: C.workflow,
  },
  {
    label: "Tasks completed",
    value: "162",
    icon: CheckCircle2,
    accent: C.contribution,
  },
  { label: "Day streak", value: "12", icon: Flame, accent: C.focus },
];

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 shrink-0">
        <Icon size={14} className="text-neutral-400" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-neutral-500">
          {label}
        </p>
        <p className="text-sm text-white truncate">{value}</p>
      </div>
    </div>
  );
}

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [user, setUser] = useState([]);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get("user/profile", {
        withCredentials: true,
      });
      console.log(response.data);
      setUser(response.data.user);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogOut=async(e)=>{
    e.preventDefault();
    try{
      setLoading(true);
      setError("");
      const response=await axios.get('auth/logout',{withCredentials:true});
      console.log(response.data);

    toast.success(response.data.message);
    navigate('/login');
    
    }
     catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="text-white">Loading projects...</div>;
  }
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }
  return (
    <div
      className="min-h-screen w-full font-sans flex items-start justify-center px-4 py-8 sm:py-12"
      style={{ background: bg }}
    >
      <div className="w-full max-w-2xl">
        {/* Header card */}
        <div
          className="rounded-2xl p-6 sm:p-8 relative overflow-hidden mb-4"
          style={{ background: surface, border: `1px solid ${border}` }}
        >
          <div
            className="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl opacity-20"
            style={{
              background: `linear-gradient(135deg, ${C.contribution}, ${C.collaboration})`,
            }}
          />
          <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 via-pink-400 to-lime-400 p-[3px] shrink-0">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-xl font-bold text-white">
                AR
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-white font-bold text-xl">
                  {user.username}
                </h1>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: `${C.collaboration}1A`,
                    color: C.collaboration,
                  }}
                >
                  {/* {user.role} */}
                  user role
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                {/* {user.team} · joined {user.joined} */}
                teams joined and date of joining
              </p>
              <p className="text-sm text-neutral-400 mt-3 leading-snug">
                {user.bio}
              </p>
            </div>
            <button
              className="flex items-center gap-1.5 text-xs font-medium text-neutral-400 border rounded-full px-3 py-1.5 h-fit shrink-0 hover:text-white hover:border-white/20 transition-colors"
              style={{ borderColor: border }}
            >
              <Pencil size={12} />
              Edit
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl p-4 flex flex-col items-start gap-2"
              style={{ background: surface, border: `1px solid ${border}` }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${s.accent}1A` }}
              >
                <s.icon size={14} style={{ color: s.accent }} />
              </div>
              <p className="text-lg font-bold text-white font-mono leading-none">{s.value}</p>
              <p className="text-[10px] text-neutral-500 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Details */}
        <div
          className="rounded-2xl p-5 sm:p-6 mb-4 divide-y"
          style={{
            background: surface,
            border: `1px solid ${border}`,
            borderColor: border,
          }}
        >
          <p className="text-[10px] uppercase tracking-wider text-neutral-500 pb-2">
            Details
          </p>
          <div className="divide-y" style={{ borderColor: border }}>
            <InfoRow icon={Mail} label="Email" value={user.email} />
            <InfoRow icon={GitBranch} label="GitBranch" value="github" />
            <InfoRow icon={MapPin} label="Location" value="location" />
            <InfoRow icon={Clock} label="Timezone" value="timezone" />
          </div>
        </div>

        {/* Skills */}
        <div
          className="rounded-2xl p-5 sm:p-6 mb-6"
          style={{ background: surface, border: `1px solid ${border}` }}
        >
          <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-3 flex items-center gap-1.5">
            <Star size={11} /> Skills
          </p>
          <div className="flex flex-wrap gap-2 text-amber-500">
            {/* {user.skills.map((s) => (
              <span
                key={s}
                className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-neutral-300"
              >
                {s}
              </span>
            ))} */}
            all skills
          </div>
        </div>

        {/* Logout */}
        <button
        onClick={handleLogOut}
          className="w-full flex items-center justify-center gap-2 text-sm font-semibold rounded-2xl py-3 border transition-colors hover:bg-[#F472B6]/10"
          style={{
            borderColor: `${C.collaboration}40`,
            color: C.collaboration,
          }}
        >
          <LogOut size={15} />
          Log out
        </button>
      </div>
    </div>
  );
}
