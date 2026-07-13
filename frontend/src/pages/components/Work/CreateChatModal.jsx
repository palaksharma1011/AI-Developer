import { useMemo, useState } from "react";
import {
  Search,
  UserPlus,
  Users,
  User,
  X,
  Check,
} from "lucide-react";

export default function CreateChatModal({
  open,
  onClose,
}) {
  const members = [
    { id: 1, name: "Palak Sharma", added: true },
    { id: 2, name: "Aman Gupta", added: false },
    { id: 3, name: "Priya Verma", added: false },
    { id: 4, name: "Rahul Singh", added: true },
    { id: 5, name: "Ananya Kapoor", added: false },
    { id: 6, name: "Rohan Mehta", added: false },
    { id: 7, name: "Sakshi Jain", added: false },
  ];

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);

  if (!open) return null;

  const filtered = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleMember = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const title =
    selected.length <= 1
      ? "Start Personal Chat"
      : "Create Group Chat";

  const submit = () => {
    console.log({
      type:
        selected.length <= 1
          ? "personal"
          : "group",
      users: selected,
    });
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">

      {/* Backdrop */}

      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      {/* Modal */}

      <div className="relative w-[95%] max-w-2xl rounded-3xl border border-cyan-400/20 bg-[#080808] shadow-[0_0_40px_rgba(0,255,255,0.08)]">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-5">

          <div>

            <p className="text-xs tracking-[0.25em] uppercase text-neutral-500">
              Communication
            </p>

            <h2 className="mt-1 text-2xl font-bold text-white">
              {title}
            </h2>

          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-neutral-400 transition hover:bg-neutral-900 hover:text-white"
          >
            <X size={20} />
          </button>

        </div>

        {/* Search */}

        <div className="p-6">

          <div className="relative mb-5">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
            />

            <input
              placeholder="Search members..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-xl border border-neutral-800 bg-black py-3 pl-11 pr-4 text-white outline-none focus:border-cyan-400"
            />

          </div>

          {/* Members */}

          <div className="max-h-[360px] space-y-3 overflow-y-auto pr-2">

            {filtered.map((user) => {
              const checked =
                selected.includes(user.id);

              return (
                <label
                  key={user.id}
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition
                  
                  ${
                    user.added
                      ? "cursor-not-allowed border-neutral-800 bg-neutral-900/60 opacity-50"
                      : checked
                      ? "border-cyan-400 bg-cyan-400/10"
                      : "border-neutral-800 hover:border-cyan-500 hover:bg-neutral-900"
                  }
                  
                  `}
                >
                  <div className="flex items-center gap-4">

                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-500/20">

                      <User
                        size={18}
                        className="text-cyan-400"
                      />

                    </div>

                    <div>

                      <p className="font-medium text-white">
                        {user.name}
                      </p>

                      <p className="text-xs text-neutral-500">
                        {user.added
                          ? "Already in project"
                          : "Available"}
                      </p>

                    </div>

                  </div>

                  {user.added ? (
                    <span className="rounded-full bg-neutral-800 px-3 py-1 text-xs text-neutral-400">
                      Added
                    </span>
                  ) : (
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        toggleMember(user.id)
                      }
                      className="h-5 w-5 accent-cyan-400"
                    />
                  )}
                </label>
              );
            })}
          </div>

          {/* Footer */}

          <div className="mt-6 flex flex-col gap-3 border-t border-neutral-800 pt-5 sm:flex-row sm:justify-between">

            <button
              className="flex items-center justify-center gap-2 rounded-xl border border-yellow-400 bg-yellow-400/10 px-5 py-3 font-semibold text-yellow-300 transition hover:bg-yellow-400 hover:text-black"
            >
              <UserPlus size={18} />
              Add More Users
            </button>

            <button
              onClick={submit}
              className="flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-black transition hover:scale-[1.02]"
            >
              {selected.length <= 1 ? (
                <User size={18} />
              ) : (
                <Users size={18} />
              )}

              {title}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}