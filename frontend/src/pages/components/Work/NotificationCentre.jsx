import React, { useState, useEffect, useCallback } from "react";
import { Bell, UserPlus, UserMinus, X } from "lucide-react";

// NOTE: adjust this import path to match where this file actually lives
// relative to src/config/socket.js

/* =========================================================================
   One temporary toast (auto-dismisses)
   ========================================================================= */

function Toast({ note, onDismiss }) {
  const isJoin = note.type === "join";

  // auto-dismiss the toast after 4s (does NOT remove it from history)
  useEffect(() => {
    const t = setTimeout(() => onDismiss(note.id), 2000);
    return () => clearTimeout(t);
  }, [note.id, onDismiss]);

  return (
    <div
      className={`flex items-center gap-3 rounded-xl px-4 py-3 shadow-lg border backdrop-blur-md animate-in slide-in-from-right
        ${
          isJoin
            ? "bg-emerald-500/15 border-emerald-400/50 text-emerald-300"
            : "bg-rose-500/15 border-rose-400/50 text-rose-300"
        }`}
    >
      <span
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
          ${isJoin ? "bg-emerald-500/20" : "bg-rose-500/20"}`}
      >
        {isJoin ? <UserPlus size={16} /> : <UserMinus size={16} />}
      </span>
      <p className="text-sm font-medium">
        <span className="font-semibold">{note.username}</span>{" "}
        {isJoin ? "joined the room" : "left the room"}
      </p>
    </div>
  );
}

/* =========================================================================
   History modal - blurred backdrop, vibrant accents, removable items
   ========================================================================= */

function NotificationModal({ open, notifications, onClose, onRemove }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-96 max-h-[70vh] flex flex-col rounded-2xl bg-zinc-900 border border-fuchsia-500/30 shadow-2xl shadow-fuchsia-500/10">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
            <Bell size={16} className="text-fuchsia-400" />
            Notifications
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-zinc-100"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
          {notifications.length === 0 ? (
            <p className="text-sm text-center text-zinc-500 mt-6">
              No notifications yet.
            </p>
          ) : (
            notifications.map((n) => {
              const isJoin = n.type === "join";
              return (
                <div
                  key={n.id}
                  className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 border
                    ${
                      isJoin
                        ? "bg-emerald-500/10 border-emerald-400/30"
                        : "bg-rose-500/10 border-rose-400/30"
                    }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0
                        ${isJoin ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"}`}
                    >
                      {isJoin ? (
                        <UserPlus size={14} />
                      ) : (
                        <UserMinus size={14} />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm text-zinc-100 truncate">
                        <span className="font-semibold">{n.username}</span>{" "}
                        {isJoin ? "joined" : "left"}
                      </p>
                      <p className="text-[11px] text-zinc-500">{n.time}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemove(n.id)}
                    className="p-1 rounded-full text-zinc-500 hover:text-rose-400 flex-shrink-0"
                    aria-label="Remove notification"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   Root: bell trigger + toast stack + history modal
   ========================================================================= */

export default function NotificationCenter({
  notifications,
  toasts,
  dismissToast,
  removeNotification,
}) {
  //   const [notifications, setNotifications] = useState([]); // full history
  const [showModal, setShowModal] = useState(false);

  //   const addNotification = useCallback((type, username) => {
  //     const time = new Date().toLocaleTimeString([], {
  //       hour: "2-digit",
  //       minute: "2-digit",
  //     });
  //     const id = Date.now() + Math.random();

  //     // store in history (kept until user removes it via the X button)
  //     setNotifications((prev) => [{ id, type, username, time }, ...prev]);

  //     // show a temporary toast (auto-dismisses on its own, doesn't affect history)
  //     setToasts((prev) => [...prev, { toastId: id, type, username }]);
  //   }, []);

  //   const dismissToast = useCallback((toastId) => {
  //     setToasts((prev) => prev.filter((t) => t.toastId !== toastId));
  //   }, []);

  //   const removeNotification = useCallback((id) => {
  //     setNotifications((prev) => prev.filter((n) => n.id !== id));
  //   }, []);

  // BACKEND HOOK: wire these up to your actual socket event names.
  // Expecting payloads like { username: "john" } from the server.
  //   useEffect(() => {
  //     receiveMessage("user-joined", (messageData) => {
  //       addNotification("join", messageData.username);
  //     });
  //     receiveMessage("user-left", (messageData) => {
  //       addNotification("leave", messageData.username);
  //     });
  //   }, [addNotification]);

  return (
    <>
      {/* Bell trigger - shows unread/total count */}
      <button
        onClick={() => setShowModal(true)}
        className="relative p-2.5 rounded-full bg-zinc-800 text-fuchsia-400 hover:bg-zinc-700"
        aria-label="Open notifications"
      >
        <Bell size={18} />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-fuchsia-500 text-white text-[10px] font-semibold flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Toast stack, fixed top-right */}
      <div className="fixed top-4 right-4 z-[60] flex flex-col gap-2 w-72">
        {toasts.map((t) => (
          <Toast key={t.id} note={t} onDismiss={dismissToast} />
        ))}
      </div>

      <NotificationModal
        open={showModal}
        notifications={notifications}
        onClose={() => setShowModal(false)}
        onRemove={removeNotification}
      />
    </>
  );
}
