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
  Users,
  MessageSquare,
} from "lucide-react";
import CreateChatModal from "../components/Work/CreateChatModal";
import {
  initializeSocket,
  sendMessage,
  receiveMessage,
} from "../../config/socket";

import { useParams } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/User.context";
/* =========================================================================
   DESIGN TOKENS (unchanged)
   ========================================================================= */
const C = {
  void: "#050506",
  surface: "#0D0D0F",
  elevated: "#17171B",
  elevatedHi: "#1F1F24",
  border: "#232327",
  violet: "#8B5CF6",
  violetSoft: "rgba(139,92,246,0.14)",
  neon: "#3DFFA4",
  neonSoft: "rgba(61,255,164,0.12)",
  hot: "#FF3B7F",
  textPrimary: "#F5F5F7",
  textMuted: "#8B8B93",
};

/* =========================================================================
   PRESENTATIONAL PIECES
   ========================================================================= */

// Avatar now understands 3 cases: AI, group (shows Users icon), single user (initials)
function Avatar({ name, isAI, isGroup, online, size = 44 }) {
  const initials =
    !isAI && !isGroup && name
      ? name
          .split(" ")
          .map((w) => w[0])
          .slice(0, 2)
          .join("")
      : "";

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
        {isAI ? (
          <Bot size={size * 0.5} />
        ) : isGroup ? (
          <Users size={size * 0.45} />
        ) : (
          initials
        )}
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
      <Avatar
        name={contact.name}
        isAI={contact.isAI}
        isGroup={contact.isGroup}
        online={contact.online}
      />
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
          {/* lastMsg is empty until real messages come in via socket */}
          <p className="text-sm truncate" style={{ color: C.textMuted }}>
            {contact.lastMsg || "No messages yet"}
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
        {/* In a group chat, show sender's name above incoming bubbles */}
        {!isMe && msg.senderName && (
          <p className="text-xs mb-1 ml-1" style={{ color: C.violet }}>
            {msg.senderName}
          </p>
        )}
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
        isGroup={contact.isGroup}
        online={contact.online}
        size={38}
      />
      <div className="min-w-0 flex-1">
        <p className="font-medium truncate" style={{ color: C.textPrimary }}>
          {contact.name}
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

/* Shown in the chat window area when there are no chats yet */
function EmptyState({ onCreate }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
      <div className="p-4 rounded-full" style={{ background: C.violetSoft }}>
        <MessageSquare size={28} color={C.violet} />
      </div>
      <p className="font-medium" style={{ color: C.textPrimary }}>
        No chats yet
      </p>
      <p className="text-sm max-w-xs" style={{ color: C.textMuted }}>
        Click the + icon to start a personal or group conversation.
      </p>
      <button
        onClick={onCreate}
        className="mt-2 px-4 py-2 rounded-xl text-sm font-medium"
        style={{ background: C.violet, color: "#100420" }}
      >
        Start a chat
      </button>
    </div>
  );
}

/* =========================================================================
   ROOT APP
   ========================================================================= */
export default function WorkScreen() {
  // CHANGED: chats now start empty — no more hardcoded CONTACTS/INITIAL_MESSAGES.
  const [chats, setChats] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [mobileView, setMobileView] = useState("list");
  const [messagesByChat, setMessagesByChat] = useState({});
  const [draft, setDraft] = useState("");
  const [codePanelMsg, setCodePanelMsg] = useState(null);
  const [openChatModal, setOpenChatModal] = useState(false);
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const scrollRef = useRef(null);

  const activeContact = chats.find((c) => c.id === activeId) || null;
  const messages = activeId ? messagesByChat[activeId] || [] : [];

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
    // console.log(id);

    initializeSocket(id);
    receiveMessage("project-message", (data) => {
      console.log(data);
    });
  }, [messages, activeId]);

  const openChat = (id) => {
    setActiveId(id);
    setMobileView("chat");
  };

  // NEW: called by CreateChatModal's onCreate({ type, users, userDetails })
  const handleCreateChat = (chatData) => {
    const { type, userDetails } = chatData;
    const isGroup = type === "group";

    // Group chats: show every member's name. Personal chats: just the other user's name.
    const name = isGroup
      ? userDetails.map((u) => u.username).join(", ")
      : userDetails[0]?.username || "Unknown user";

    const newChat = {
      id: Date.now(), // BACKEND HOOK: replace with the real chat _id from your create-chat API response
      type,
      isGroup,
      name,
      members: userDetails,
      online: false, // BACKEND HOOK: drive this from socket presence events
      lastMsg: "",
      time: "",
      unread: 0,
    };

    setChats((prev) => [newChat, ...prev]);
    setMessagesByChat((prev) => ({ ...prev, [newChat.id]: [] }));
    setActiveId(newChat.id);
    setMobileView("chat");

    // BACKEND HOOK: also emit socket.emit("chat:create", { type, users: chatData.users })
    // so the server persists it in MongoDB and can push it to the other members.
  };

  const handleSend = () => {
    if (!draft.trim() || !activeId) return;
    const newMsg = {
      id: Date.now(),
      from: user._id,
      type: "text",
      text: draft.trim(),
      time: "now",
      project: id,
    };
    setMessagesByChat((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), newMsg],
    }));
    sendMessage("project-message", {
      newMsg,
      sender: user._id,
    });
    setDraft("");

    // ---------------------------------------------------------------------
    // BACKEND HOOK: send over your socket connection, e.g.
    //   socket.emit("message:send", { chatId: activeId, text: newMsg.text });
    // If newMsg.text mentions "@AI", your server decides whether to route it
    // to the AI service and emits back a "message:new" event with
    // { from: "ai", type: "text" | "code", ... } which you'd push into state.
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
            onClick={() => setOpenChatModal(true)}
          >
            <Plus size={18} />
          </button>
          <CreateChatModal
            open={openChatModal}
            onClose={() => setOpenChatModal(false)}
            onCreate={handleCreateChat} // NEW
          />
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
          {chats.length === 0 ? (
            <p
              className="text-sm text-center mt-8 px-4"
              style={{ color: C.textMuted }}
            >
              No chats yet. Tap + to start one.
            </p>
          ) : (
            chats.map((c) => (
              <ContactRow
                key={c.id}
                contact={c}
                active={c.id === activeId}
                onClick={() => openChat(c.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* ---------------- Chat window ---------------- */}
      <div
        className={`flex-1 min-w-0 flex-col ${mobileView === "chat" ? "flex" : "hidden md:flex"}`}
      >
        {activeContact ? (
          <>
            <ChatHeader
              contact={activeContact}
              onBack={() => setMobileView("list")}
            />
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-3 md:px-6 py-4 flex flex-col gap-4"
            >
              {messages.length === 0 ? (
                <p
                  className="text-sm text-center mt-8"
                  style={{ color: C.textMuted }}
                >
                  No messages yet. Say hi!
                </p>
              ) : (
                messages.map((m) => (
                  <MessageBubble
                    key={m.id}
                    msg={m}
                    onOpenCode={setCodePanelMsg}
                  />
                ))
              )}
            </div>
            <MessageInput
              value={draft}
              onChange={setDraft}
              onSend={handleSend}
            />
          </>
        ) : (
          <EmptyState onCreate={() => setOpenChatModal(true)} />
        )}
      </div>

      {/* ---------------- Code panel ---------------- */}
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
