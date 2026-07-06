import React from "react";
import axios from "../../config/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Select from "react-select";

export const techOptions = [
  { value: "JavaScript", label: "JavaScript" },
  { value: "TypeScript", label: "TypeScript" },
  { value: "React", label: "React" },
  { value: "Next.js", label: "Next.js" },
  { value: "Vue.js", label: "Vue.js" },
  { value: "Angular", label: "Angular" },

  { value: "Node.js", label: "Node.js" },
  { value: "Express.js", label: "Express.js" },
  { value: "NestJS", label: "NestJS" },

  { value: "MongoDB", label: "MongoDB" },
  { value: "PostgreSQL", label: "PostgreSQL" },
  { value: "MySQL", label: "MySQL" },
  { value: "Redis", label: "Redis" },

  { value: "Prisma", label: "Prisma" },
  { value: "Mongoose", label: "Mongoose" },

  { value: "Docker", label: "Docker" },
  { value: "Kubernetes", label: "Kubernetes" },

  { value: "AWS", label: "AWS" },
  { value: "Firebase", label: "Firebase" },

  { value: "Tailwind CSS", label: "Tailwind CSS" },
  { value: "Bootstrap", label: "Bootstrap" },

  { value: "Socket.IO", label: "Socket.IO" },
  { value: "JWT", label: "JWT" },

  { value: "Git", label: "Git" },
  { value: "GitHub", label: "GitHub" },

  { value: "Others", label: "Others" },
];

const CreateProject = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [stack, setStack] = useState([]);
  const [otherTech, setOtherTech] = useState("");
  const [showOtherInput, setShowOtherInput] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const desc = e.target.desc.value;
    const status = e.target.status.value;
    const progress = e.target.progress.value;

    const data = {
      name,
      desc,
      status,
      progress,
      stack: stack.map((item) => item.value),
    };
    console.log(data);
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post("/projects/create", data, {
        withCredentials: true,
      });
      console.log(response);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <section className="flex justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-lg space-y-5"
        >
          {/* Project Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-cyan-400">
              Project Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter project name"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none transition-all duration-200 placeholder:text-zinc-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-cyan-400">
              Description
            </label>

            <textarea
              name="desc"
              rows={4}
              placeholder="Enter project description"
              className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none transition-all duration-200 placeholder:text-zinc-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
            />
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-cyan-400">
              Status
            </label>

            <select
              name="status"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none transition-all duration-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
            >
              <option value="">Select status</option>
              <option value="planning">Planning</option>
              <option value="in progress">In Progress</option>
              <option value="testing">Testing</option>
              <option value="in review">In Review</option>
              <option value="complete">Complete</option>
            </select>
          </div>

          {/* Progress */}
          <div>
            <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-cyan-400">
              Progress (%)
            </label>

            <input
              type="number"
              name="progress"
              min="0"
              max="100"
              placeholder="0 - 100"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none transition-all duration-200 placeholder:text-zinc-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
            />
          </div>

          {/* Stack */}
          <div>
            <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-cyan-400">
              Tech Stack
            </label>

            <Select
              isMulti
              menuPortalTarget={document.body}
              menuPosition="fixed"
              options={techOptions}
              value={stack}
              placeholder="Select technologies..."
              onChange={(selected) => {
                setStack(selected);

                const hasOthers = selected.some(
                  (item) => item.value === "Others",
                );

                setShowOtherInput(hasOthers);
              }}
              styles={{
                control: (base, state) => ({
                  ...base,
                  backgroundColor: "#18181b",
                  borderColor: state.isFocused ? "#22d3ee" : "#3f3f46",
                  boxShadow: "none",
                  minHeight: "48px",
                  "&:hover": {
                    borderColor: "#22d3ee",
                  },
                }),

                menu: (base) => ({
                  ...base,
                  backgroundColor: "#18181b",
                  zIndex: 9999,
                }),

                menuPortal: (base) => ({
                  ...base,
                  zIndex: 9999,
                }),

                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused ? "#27272a" : "#18181b",
                  color: "white",
                  cursor: "pointer",
                }),

                multiValue: (base) => ({
                  ...base,
                  backgroundColor: "#0891b2",
                }),

                multiValueLabel: (base) => ({
                  ...base,
                  color: "white",
                }),

                multiValueRemove: (base) => ({
                  ...base,
                  color: "white",
                  ":hover": {
                    backgroundColor: "#ef4444",
                    color: "white",
                  },
                }),

                input: (base) => ({
                  ...base,
                  color: "white",
                }),

                singleValue: (base) => ({
                  ...base,
                  color: "white",
                }),

                placeholder: (base) => ({
                  ...base,
                  color: "#71717a",
                }),
              }}
            />
            {showOtherInput && (
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Enter other technology"
                  value={otherTech}
                  onChange={(e) => setOtherTech(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-white"
                />

                <button
                  type="button"
                  className="mt-2 rounded bg-cyan-500 px-4 py-2 text-black"
                  onClick={() => {
                    if (!otherTech.trim()) return;

                    setStack((prev) => [
                      ...prev.filter((item) => item.value !== "Others"),
                      {
                        value: otherTech,
                        label: otherTech,
                      },
                    ]);

                    setOtherTech("");
                    setShowOtherInput(false);
                  }}
                >
                  Add Technology
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-cyan-500 px-5 py-3 font-medium text-black transition-all duration-200 hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] active:scale-95"
          >
            Create Project
          </button>
        </form>
      </section>
    </main>
  );
};

export default CreateProject;
