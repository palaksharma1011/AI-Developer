import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Search, Send, Paperclip, Smile, Reply, Bot, Bell } from "lucide-react";
import { useCallback } from "react";

import {
  initializeSocket,
  sendMessage,
  receiveMessage,
} from "../../config/socket";
import { UserContext } from "../../context/User.context";
import NotificationCenter from "../components/Work/NotificationCentre";
import AIContent from "../components/Work/AIContent";

/* =========================================================================
   Single message bubble
   ========================================================================= */

function MessageBubble({ msg, isMe, myUsername, onReply, onOpenAI }) {
  console.log("MessageBubble:", msg);
  console.log("MessageBubble: text=", msg.from);
  const isAI = msg.from === "AI";
  // Special styling when the message is directed at the AI
  const isAIMessage = /@ai\b/i.test(msg.text);
  // Highlight if someone mentioned the logged-in user by @username
  const mentionsMe =
    myUsername && new RegExp(`@${myUsername}\\b`, "i").test(msg.text);

  if (isAI) {
    return (
      <div className="flex justify-start">
        <button
          onClick={() => {
            onOpenAI(msg.text);
          }}
          className="bg-zinc-800 rounded-2xl px-4 py-3 border border-violet-500/20"
        >
          <div className="flex items-center gap-2">
            <Bot size={16} />
            <span>AI</span>
          </div>
          <p className="text-sm mt-2 text-emerald-400">
            ✓ Response ready. Click to view.
          </p>
        </button>
      </div>
    );
  }

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[80%] md:max-w-[65%]">
        {/* Sender name only shown for incoming messages, not my own */}
        {!isMe && (
          <p className="text-xs mb-1 ml-1 text-violet-400 font-medium">
            {msg.name}
          </p>
        )}

        {/* Quoted preview if this message is a reply to another one */}
        {msg.replyTo && (
          <div className="mb-1 rounded-lg border-l-2 border-zinc-600 bg-zinc-800/60 px-2 py-1 text-xs text-zinc-400">
            <span className="font-medium text-zinc-300">
              {msg.replyTo.name}
            </span>{" "}
            {msg.replyTo.text}
          </div>
        )}

        <div
          className={`px-4 py-2.5 text-sm leading-relaxed rounded-2xl
            ${isMe ? "rounded-br-sm bg-violet-500 text-[#100420]" : "rounded-tl-sm bg-zinc-800 text-zinc-100"}
            ${isAIMessage ? "!bg-emerald-500/15 !text-emerald-300 border border-emerald-500/40" : ""}
            ${mentionsMe && !isAIMessage ? "ring-1 ring-pink-500/70" : ""}
          `}
        >
          {isAIMessage && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 mb-1">
              <Bot size={12} /> Asking AI
            </span>
          )}
          {msg.text}
        </div>

        {/* Footer: timestamp + reply action */}
        <div
          className={`flex items-center gap-3 mt-1 ${isMe ? "justify-end" : "justify-start"}`}
        >
          <span className="text-[11px] text-zinc-500">{msg.time}</span>
          <button
            onClick={() => onReply(msg)}
            className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-300"
          >
            <Reply size={12} /> Reply
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   Root component
   ========================================================================= */

export default function WorkScreen() {
  const { id } = useParams(); // project id from route
  const { user } = useContext(UserContext); // logged-in user
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState(""); // current text in the input box
  const [replyTo, setReplyTo] = useState(null); // message being replied to, if any
  const [searchQuery, setSearchQuery] = useState(""); // filters messages / @mentions
  const [aiMode, setAiMode] = useState(false); // true once @AI is used -> swaps 70/30 layout

  const [selectedAIContent, setSelectedAIContent] = useState("");

  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);

  const scrollRef = useRef(null);

  const addNotification = (type, username) => {
    const notification = {
      id: Date.now() + Math.random(),
      type,
      username,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // History
    setNotifications((prev) => [...prev, notification]);
    // Toast
    setToasts((prev) => [notification, ...prev]);
  };
  // Set up socket listener for this project's chat room

  useEffect(() => {
    initializeSocket(id);

    const offMessage = receiveMessage("project-message", (data) => {
      setMessages((prev) => [...prev, data.newMsg]);

      if (/@ai\b/i.test(data.newMsg.text)) {
        setAiMode(true);
      }
    });

    const offJoin = receiveMessage("user-joined", (data) => {
      addNotification("join", data.username);
    });

    const offLeave = receiveMessage("user-left", (data) => {
      addNotification("leave", data.username);
    });

    return () => {
      offMessage && offMessage();
      offJoin && offJoin();
      offLeave && offLeave();
    };
  }, [id]);
  // Auto-scroll to latest message
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;

    const newMsg = {
      id: Date.now() + Math.random(),
      from: user._id,
      name: user.username,
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      project: id,
      replyTo: replyTo
        ? { id: replyTo.id, name: replyTo.name, text: replyTo.text }
        : null,
    };

    // setMessages((prev) => [...prev, newMsg]);
    sendMessage("project-message", { newMsg, sender: user._id });

    if (/@ai\b/i.test(text)) setAiMode(true);

    setDraft("");
    setReplyTo(null);
  };

  const handleProfileClick = () => {
    navigate(`/project/${id}/manage`);
  };
  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // const removeNotification = (id) => {
  //   setNotifications((prev) => prev.filter((n) => n.id !== id));
  // };

  // Text search box also works for @mentions since it's a plain substring match
  const filteredMessages = searchQuery.trim()
    ? messages.filter((m) =>
        m.text.toLowerCase().includes(searchQuery.trim().toLowerCase()),
      )
    : messages;

  const handleOpenAI = (content) => {
    setSelectedAIContent(content);
    setAiMode(true);
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-black font-sans">
      {/* ---------------- Chat column ---------------- */}
      <div
        className={`flex flex-col h-full border-r border-zinc-800 transition-all duration-300 ${
          aiMode ? "w-full md:w-[30%]" : "w-full md:w-[70%]"
        }`}
      >
        {/* Header: click avatar/name to go to profile */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 flex-shrink-0">
          <button
            onClick={handleProfileClick}
            className="flex items-center gap-2 text-left"
          >
            <span className="w-9 h-9 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Bot size={18} />
            </span>
            <p className="font-medium text-zinc-100 truncate">
              Project Discurssion
            </p>
          </button>

          <NotificationCenter
            notifications={notifications}
            toasts={toasts}
            dismissToast={dismissToast}
            removeNotification={removeNotification}
          />
        </div>

        {/* Search bar - filters messages by text or @name */}
        <div className="px-3 py-2 flex-shrink-0">
          <div className="flex items-center gap-2 rounded-xl bg-zinc-900 px-3 py-2">
            <Search size={16} className="text-zinc-500" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages or @name"
              className="bg-transparent outline-none text-sm flex-1 text-zinc-100 placeholder:text-zinc-500"
            />
          </div>
        </div>

        {/* Message list */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-3 md:px-4 py-3 flex flex-col gap-4"
        >
          {filteredMessages.length === 0 ? (
            <p className="text-sm text-center mt-8 text-zinc-500">
              No messages yet. Say hi!
            </p>
          ) : (
            filteredMessages.map((m) => (
              <MessageBubble
                key={m.id}
                msg={m}
                isMe={m.from === user._id}
                myUsername={user.username}
                onReply={setReplyTo}
                onOpenAI={handleOpenAI}
              />
            ))
          )}
        </div>

        {/* Reply preview bar - shown above input while replying */}
        {replyTo && (
          <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-t border-zinc-800 flex-shrink-0">
            <div className="text-xs text-zinc-400 truncate">
              Replying to{" "}
              <span className="text-zinc-200 font-medium">{replyTo.name}</span>:{" "}
              {replyTo.text}
            </div>
            <button
              onClick={() => setReplyTo(null)}
              className="text-zinc-500 hover:text-zinc-300 ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Message input row: attach -> textarea -> emoji -> send */}
        <div className="flex-shrink-0 px-3 py-3 border-t border-zinc-800">
          <div className="flex items-end gap-2">
            <button
              className="p-2 rounded-full text-zinc-400 hover:text-zinc-200"
              aria-label="Attach file"
            >
              <Paperclip size={20} />
            </button>

            <div className="flex-1 flex items-end gap-2 rounded-2xl bg-zinc-900 px-3 py-2">
              <textarea
                rows={1}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type a message, @name to mention, @AI to ask the assistant..."
                className="flex-1 bg-transparent resize-none outline-none text-sm py-1 max-h-28 text-zinc-100 placeholder:text-zinc-500"
              />
              <button
                className="p-1 text-zinc-400 hover:text-zinc-200"
                aria-label="Emoji"
              >
                <Smile size={20} />
              </button>
            </div>

            <button
              onClick={handleSend}
              disabled={!draft.trim()}
              className="p-3 rounded-full bg-violet-500 text-[#100420] disabled:opacity-40"
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ---------------- Right panel ---------------- */}
      {/* Blank for now. Width flips to 70% once @AI is used in the chat. */}
      {/* TODO: integrate AI panel / future work here */}
      <div
        className={`hidden md:flex bg-black transition-all duration-300 ${
          aiMode ? "md:w-[70%]" : "md:w-[30%]"
        }`}
      >
        <AIContent content={selectedAIContent} />
      </div>
    </div>
  );
}
