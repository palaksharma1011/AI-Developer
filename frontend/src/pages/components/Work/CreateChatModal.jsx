import { useMemo, useState } from "react";
import { Search, UserPlus, Users, User, X, Check } from "lucide-react";

import axios from "../../../config/axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { useParams } from "react-router-dom";

export default function CreateChatModal({ open, onClose, onCreate }) {

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const {id}=useParams();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get("user/getAllUser", {
        withCredentials: true,
      });
      setMembers(response.data.users);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <div className="text-shadow-blue-600">Loading projects...</div>;
  }
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!open) return null;
  const filtered = members.filter((m) =>
    m?.username.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleMember = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const title =
    selected.length <= 1 ? "Start Personal Chat" : "Create Group Chat";

  const submit = () => {
    const chatData = {
      type: selected.length <= 1 ? "personal" : "group",
      users: selected,
      // for personal chats, grab the one selected user's info for display
      userDetails: members.filter((m) => selected.includes(m._id)),
    };
    console.log(chatData);
    onCreate?.(chatData);   // <-- the only new line
    onClose();              // close modal after creating
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

            <h2 className="mt-1 text-2xl font-bold text-white">{title}</h2>
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
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-neutral-800 bg-black py-3 pl-11 pr-4 text-white outline-none focus:border-cyan-400"
            />
          </div>

          {/* Members */}

          <div className="max-h-[360px] space-y-3 overflow-y-auto pr-2">
            {filtered.map((user) => {
              const checked = selected.includes(user._id);

              return (
                <label
                  key={user._id}
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
                      <User size={18} className="text-cyan-400" />
                    </div>

                    <div>
                      <p className="font-medium text-white">{user.username}</p>
                      <p className="text-cyan-400/100 p-1 text-xs">{user.email}</p>

                      <p className="text-xs text-neutral-500">
                        {user.added ? "Already in project" : "Available"}
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
                      onChange={() => toggleMember(user._id)}
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
            onClick={()=>navigate(`/project/${id}/manage`)}
            className="flex items-center justify-center gap-2 rounded-xl border border-yellow-400 bg-yellow-400/10 px-5 py-3 font-semibold text-yellow-300 transition hover:bg-yellow-400 hover:text-black">
              <UserPlus size={18} />
              Edit members
            </button>

            <button
              onClick={submit}
              className="flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-black transition hover:scale-[1.02]"
            >
              {selected.length <= 1 ? <User size={18} /> : <Users size={18} />}

              {title}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
