import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Check,
  CheckCheck,
  Code2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  X,
  ArrowLeft,
  Bot,
  Circle,
  Plus,
} from "lucide-react";

/* =========================================================================
   DESIGN TOKENS
   Jet black base + two vibrant, purpose-driven accents so the eye always
   knows who's "talking": violet = you / humans, neon = AI.
   Tailwind here only ships default utility classes (no arbitrary values
   compile step), so custom hex values are applied via inline style and
   layout/spacing/type stay on Tailwind utilities.
   ========================================================================= */
const C = {
  void: "#050506", // app background
  surface: "#0D0D0F", // sidebar / panels
  elevated: "#17171B", // incoming bubbles, inputs
  elevatedHi: "#1F1F24", // hover states
  border: "#232327",
  violet: "#8B5CF6", // primary accent — you / human messages
  violetSoft: "rgba(139,92,246,0.14)",
  neon: "#3DFFA4", // AI accent — always distinct from human accent
  neonSoft: "rgba(61,255,164,0.12)",
  hot: "#FF3B7F", // unread badges / live / notifications
  textPrimary: "#F5F5F7",
  textMuted: "#8B8B93",
};

/* =========================================================================
   MOCK DATA — replace with data from your Express/Socket.io + MongoDB layer.
   Shape kept intentionally close to what a MERN backend would return so
   swapping in real API calls is closer to a find-and-replace.
   ========================================================================= */
const CURRENT_USER = { id: "me", name: "You", username: "@you" };

const CONTACTS = [
  {
    id: "ai",
    name: "AI Assistant",
    username: "@AI",
    isAI: true,
    online: true,
    lastMsg: "Type @AI in any chat to bring me in",
    time: "now",
    unread: 0,
  },
  {
    id: "u1",
    name: "Priya Sharma",
    username: "@priya.codes",
    online: true,
    lastMsg: "Sent the API docs, check it out",
    time: "2m",
    unread: 2,
  },
  {
    id: "u2",
    name: "Arjun Mehta",
    username: "@arjunm",
    online: false,
    lastMsg: "See you tomorrow!",
    time: "1h",
    unread: 0,
  },
  {
    id: "u3",
    name: "Team Frontend",
    username: "@team-fe",
    online: true,
    lastMsg: "Riya: pushed the fix",
    time: "3h",
    unread: 5,
  },
];

const SNIPPET = `function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}`;

const INITIAL_MESSAGES = {
  ai: [
    {
      id: 1,
      from: "ai",
      type: "text",
      text: "Hey! Mention @AI in any chat and I'll jump in. Try asking me for code, an explanation, anything.",
      time: "10:01",
    },
    {
      id: 2,
      from: "me",
      type: "text",
      text: "@AI give me a debounce function in JS",
      time: "10:02",
    },
    {
      id: 3,
      from: "ai",
      type: "code",
      language: "javascript",
      code: SNIPPET,
      text: "Here's a simple debounce helper — call the returned function on every event, it only fires after things go quiet.",
      time: "10:02",
      feedback: null,
    },
  ],
  u1: [
    {
      id: 1,
      from: "u1",
      type: "text",
      text: "Hey, did you get a chance to look at the auth flow?",
      time: "9:14",
    },
    {
      id: 2,
      from: "me",
      type: "text",
      text: "Yep, looks solid. Just testing token refresh now.",
      time: "9:20",
    },
    {
      id: 3,
      from: "u1",
      type: "text",
      text: "Sent the API docs, check it out",
      time: "9:22",
    },
  ],
  u2: [
    {
      id: 1,
      from: "u2",
      type: "text",
      text: "See you tomorrow!",
      time: "8:03",
    },
  ],
  u3: [
    {
      id: 1,
      from: "u3",
      type: "text",
      text: "Riya: pushed the fix",
      time: "6:40",
    },
  ],
};

/* =========================================================================
   PRESENTATIONAL PIECES
   ========================================================================= */

function Avatar({ name, isAI, online, size = 44 }) {
  const initials = isAI
    ? ""
    : name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("");
  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <div
        className="w-full h-full rounded-full flex items-center justify-center font-semibold"
        style={{
          background: isAI ? C.neonSoft : C.violetSoft,
          color: isAI ? C.neon : C.violet,
          border: `1px solid ${isAI ? C.neon : C.violet}33`,
          fontSize: size * 0.34,
        }}
      >
        {isAI ? <Bot size={size * 0.5} /> : initials}
      </div>
      {online && (
        <span
          className="absolute bottom-0 right-0 rounded-full border-2"
          style={{
            width: size * 0.28,
            height: size * 0.28,
            background: "#22C55E",
            borderColor: C.surface,
          }}
        />
      )}
    </div>
  );
}

function ContactRow({ contact, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 transition-colors text-left"
      style={{ background: active ? C.elevated : "transparent" }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = C.elevatedHi;
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = "transparent";
      }}
    >
      <Avatar name={contact.name} isAI={contact.isAI} online={contact.online} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="font-medium truncate" style={{ color: C.textPrimary }}>
            {contact.name}
          </p>
          <span
            className="text-xs flex-shrink-0"
            style={{ color: C.textMuted }}
          >
            {contact.time}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className="text-sm truncate" style={{ color: C.textMuted }}>
            {contact.lastMsg}
          </p>
          {contact.unread > 0 && (
            <span
              className="flex-shrink-0 text-[11px] font-semibold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center"
              style={{ background: C.hot, color: "#1a0410" }}
            >
              {contact.unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

function CodeBlockPreview({ language, onOpen }) {
  return (
    <button
      onClick={onOpen}
      className="mt-2 w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
      style={{
        background: "rgba(0,0,0,0.35)",
        border: `1px solid ${C.neon}44`,
        color: C.neon,
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "rgba(0,0,0,0.5)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = "rgba(0,0,0,0.35)")
      }
    >
      <Code2 size={16} />
      <span className="font-mono">{language}</span>
      <span className="ml-auto" style={{ color: C.textMuted }}>
        View code
      </span>
    </button>
  );
}

function MessageBubble({ msg, onOpenCode }) {
  const isMe = msg.from === "me";
  const isAI = msg.from === "ai";

  // AI messages are styled deliberately differently: left-aligned like an
  // incoming message, but with a neon outline + "AI" tag so it can never be
  // mistaken for a human reply, even at a glance.
  if (isAI) {
    return (
      <div className="flex items-start gap-2 max-w-[85%] md:max-w-[70%]">
        <Avatar name="AI" isAI size={32} />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-semibold tracking-wide"
              style={{ color: C.neon }}
            >
              AI
            </span>
            <span className="text-[11px]" style={{ color: C.textMuted }}>
              {msg.time}
            </span>
          </div>
          <div
            className="rounded-2xl rounded-tl-sm px-4 py-3"
            style={{ background: C.neonSoft, border: `1px solid ${C.neon}33` }}
          >
            <p
              className="text-sm leading-relaxed"
              style={{ color: C.textPrimary }}
            >
              {msg.text}
            </p>
            {msg.type === "code" && (
              <CodeBlockPreview
                language={msg.language}
                onOpen={() => onOpenCode(msg)}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[80%] md:max-w-[60%]">
        <div
          className={`px-4 py-2.5 text-sm leading-relaxed ${isMe ? "rounded-2xl rounded-br-sm" : "rounded-2xl rounded-tl-sm"}`}
          style={{
            background: isMe ? C.violet : C.elevated,
            color: isMe ? "#100420" : C.textPrimary,
          }}
        >
          {msg.text}
        </div>
        <div
          className={`flex items-center gap-1 mt-1 ${isMe ? "justify-end" : "justify-start"}`}
        >
          <span className="text-[11px]" style={{ color: C.textMuted }}>
            {msg.time}
          </span>
          {isMe && <CheckCheck size={14} color={C.violet} />}
        </div>
      </div>
    </div>
  );
}

function ChatHeader({ contact, onBack }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
      style={{ background: C.surface, borderBottom: `1px solid ${C.border}` }}
    >
      <button
        className="md:hidden -ml-1 p-1"
        onClick={onBack}
        aria-label="Back to chat list"
      >
        <ArrowLeft size={20} color={C.textPrimary} />
      </button>
      <Avatar
        name={contact.name}
        isAI={contact.isAI}
        online={contact.online}
        size={38}
      />
      <div className="min-w-0 flex-1">
        <p className="font-medium truncate" style={{ color: C.textPrimary }}>
          {contact.name}
        </p>
        <p
          className="text-xs truncate"
          style={{ color: contact.online ? C.neon : C.textMuted }}
        >
          {contact.isAI
            ? "Always online"
            : contact.online
              ? "Online"
              : "Offline"}
        </p>
      </div>
      <button className="p-2 rounded-full" style={{ color: C.textMuted }}>
        <MoreVertical size={20} />
      </button>
    </div>
  );
}

function MessageInput({ value, onChange, onSend }) {
  const mentioningAI = value.toLowerCase().includes("@ai");
  return (
    <div
      className="flex-shrink-0 px-3 md:px-4 py-3"
      style={{ background: C.surface, borderTop: `1px solid ${C.border}` }}
    >
      {mentioningAI && (
        <div
          className="flex items-center gap-1.5 mb-2 text-xs font-medium"
          style={{ color: C.neon }}
        >
          <Bot size={14} /> Asking AI
        </div>
      )}
      <div className="flex items-end gap-2">
        <button
          className="p-2 rounded-full flex-shrink-0"
          style={{ color: C.textMuted }}
          aria-label="Attach file"
        >
          <Paperclip size={20} />
        </button>
        <div
          className="flex-1 flex items-end gap-2 rounded-2xl px-3 py-2"
          style={{
            background: C.elevated,
            border: `1px solid ${mentioningAI ? C.neon + "55" : C.border}`,
          }}
        >
          <textarea
            rows={1}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            placeholder="Type a message, or @AI to ask the assistant..."
            className="flex-1 bg-transparent resize-none outline-none text-sm py-1 max-h-28"
            style={{ color: C.textPrimary }}
          />
          <button
            className="p-1 flex-shrink-0"
            style={{ color: C.textMuted }}
            aria-label="Emoji"
          >
            <Smile size={20} />
          </button>
        </div>
        <button
          onClick={onSend}
          disabled={!value.trim()}
          className="p-3 rounded-full flex-shrink-0 transition-opacity disabled:opacity-40"
          style={{
            background: mentioningAI ? C.neon : C.violet,
            color: "#0a0a0c",
          }}
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

/* Code panel: desktop = right-side dock, mobile = full-screen overlay. */
function CodePanel({ msg, onClose, onFeedback }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(msg.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 md:static md:inset-auto md:z-auto md:w-[400px] md:flex-shrink-0 flex flex-col"
      style={{ background: C.surface, borderLeft: `1px solid ${C.border}` }}
    >
      <div
        className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{ borderBottom: `1px solid ${C.border}` }}
      >
        <div className="flex items-center gap-2">
          <Code2 size={18} color={C.neon} />
          <span className="font-mono text-sm" style={{ color: C.textPrimary }}>
            {msg.language}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full"
          style={{ color: C.textMuted }}
          aria-label="Close code panel"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <pre
          className="text-sm font-mono whitespace-pre-wrap rounded-xl p-4"
          style={{ background: "#000000", color: "#D9FFEA", lineHeight: 1.6 }}
        >
          {msg.code}
        </pre>
      </div>

      <div
        className="flex-shrink-0 px-4 py-3 flex items-center gap-2"
        style={{ borderTop: `1px solid ${C.border}` }}
      >
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-colors"
          style={{ background: C.violet, color: "#100420" }}
        >
          <Copy size={16} /> {copied ? "Copied!" : "Copy code"}
        </button>
        <button
          onClick={() => onFeedback(msg.id, true)}
          className="p-2.5 rounded-xl"
          style={{
            background: msg.feedback === true ? C.neonSoft : C.elevated,
            color: msg.feedback === true ? C.neon : C.textMuted,
          }}
          aria-label="Good response"
        >
          <ThumbsUp size={18} />
        </button>
        <button
          onClick={() => onFeedback(msg.id, false)}
          className="p-2.5 rounded-xl"
          style={{
            background: msg.feedback === false ? "#3d1420" : C.elevated,
            color: msg.feedback === false ? C.hot : C.textMuted,
          }}
          aria-label="Bad response"
        >
          <ThumbsDown size={18} />
        </button>
      </div>
    </div>
  );
}

/* =========================================================================
   ROOT APP
   ========================================================================= */
export default function WorkScreen() {
  const [activeId, setActiveId] = useState("ai");
  const [mobileView, setMobileView] = useState("list"); // "list" | "chat"
  const [messagesByChat, setMessagesByChat] = useState(INITIAL_MESSAGES);
  const [draft, setDraft] = useState("");
  const [codePanelMsg, setCodePanelMsg] = useState(null);
  const scrollRef = useRef(null);

  const activeContact = CONTACTS.find((c) => c.id === activeId);
  const messages = messagesByChat[activeId] || [];

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, activeId]);

  const openChat = (id) => {
    setActiveId(id);
    setMobileView("chat");
  };

  const handleSend = () => {
    if (!draft.trim()) return;
    const newMsg = {
      id: Date.now(),
      from: "me",
      type: "text",
      text: draft.trim(),
      time: "now",
    };
    setMessagesByChat((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), newMsg],
    }));
    setDraft("");

    // ---------------------------------------------------------------------
    // BACKEND HOOK: send over your socket connection, e.g.
    //   socket.emit("message:send", { chatId: activeId, text: newMsg.text });
    // If newMsg.text mentions "@AI", your server decides whether to route it
    // to the AI service and emits back a "message:new" event with
    // { from: "ai", type: "text" | "code", ... } which you'd push into state
    // the same way the mock INITIAL_MESSAGES.ai entries are shaped above.
    // ---------------------------------------------------------------------
  };

  const handleFeedback = (msgId, good) => {
    setMessagesByChat((prev) => ({
      ...prev,
      [activeId]: prev[activeId].map((m) =>
        m.id === msgId ? { ...m, feedback: good } : m,
      ),
    }));
    if (codePanelMsg?.id === msgId)
      setCodePanelMsg((m) => ({ ...m, feedback: good }));

    // BACKEND HOOK: POST /api/ai/feedback { messageId: msgId, rating: good }
  };

  return (
    <div
      className="flex w-full h-screen overflow-hidden"
      style={{ background: C.void, fontFamily: "Inter, system-ui, sans-serif" }}
    >
      {/* ---------------- Sidebar / chat list ---------------- */}
      <div
        className={`w-full md:w-[340px] md:flex-shrink-0 flex-col ${mobileView === "list" ? "flex" : "hidden md:flex"}`}
        style={{ background: C.surface, borderRight: `1px solid ${C.border}` }}
      >
        <div className="flex items-center justify-between px-4 py-4 flex-shrink-0">
          <h1
            className="text-lg font-semibold"
            style={{ color: C.textPrimary }}
          >
            Chats
          </h1>
          <button
            className="p-2 rounded-full"
            style={{ background: C.violetSoft, color: C.violet }}
            aria-label="New chat"
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="px-3 pb-3 flex-shrink-0">
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2"
            style={{ background: C.elevated }}
          >
            <Search size={16} color={C.textMuted} />
            <input
              placeholder="Search by name or username"
              className="bg-transparent outline-none text-sm flex-1"
              style={{ color: C.textPrimary }}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {CONTACTS.map((c) => (
            <ContactRow
              key={c.id}
              contact={c}
              active={c.id === activeId}
              onClick={() => openChat(c.id)}
            />
          ))}
        </div>
      </div>

      {/* ---------------- Chat window ---------------- */}
      <div
        className={`flex-1 min-w-0 flex-col ${mobileView === "chat" ? "flex" : "hidden md:flex"}`}
      >
        <ChatHeader
          contact={activeContact}
          onBack={() => setMobileView("list")}
        />

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-3 md:px-6 py-4 flex flex-col gap-4"
        >
          {messages.map((m) => (
            <MessageBubble key={m.id} msg={m} onOpenCode={setCodePanelMsg} />
          ))}
        </div>

        <MessageInput value={draft} onChange={setDraft} onSend={handleSend} />
      </div>

      {/* ---------------- Code panel (desktop dock / mobile overlay) ---------------- */}
      {codePanelMsg && (
        <CodePanel
          msg={codePanelMsg}
          onClose={() => setCodePanelMsg(null)}
          onFeedback={handleFeedback}
        />
      )}
    </div>
  );
}
