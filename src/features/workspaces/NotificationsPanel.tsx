"use client";

import { useState } from "react";
import {
  saveNotifications,
  useWorkspaceNotifications,
  type WorkspaceNotification,
} from "@/features/workspaces/notification-store";

function NotificationIcon({ kind }: { kind: WorkspaceNotification["kind"] }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
      <svg
        aria-hidden="true"
        className="h-[18px] w-[18px]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {kind === "mention" ? (
          <path d="M8 19H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-7l-4 3v-3Z" />
        ) : null}
        {kind === "assigned" ? (
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="m8 12 2.5 2.5L16 9" />
          </>
        ) : null}
        {kind === "status" ? (
          <>
            <path d="M20 7v5h-5" />
            <path d="M4 17v-5h5" />
            <path d="M5.6 9a7 7 0 0 1 11.5-2.3L20 12M4 12l2.9 5.3A7 7 0 0 0 18.4 15" />
          </>
        ) : null}
        {kind === "cycle" ? (
          <>
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M16 3v4M8 3v4M3 10h18" />
          </>
        ) : null}
      </svg>
    </span>
  );
}

export function NotificationsPanel({ slug }: { slug: string }) {
  const notifications = useWorkspaceNotifications(slug);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const unreadCount = notifications.filter((notification) => !notification.isRead).length;
  const visibleNotifications = notifications.filter(
    (notification) => filter === "all" || !notification.isRead,
  );

  function markRead(id: string) {
    saveNotifications(
      slug,
      notifications.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification,
      ),
    );
  }

  function markAllRead() {
    saveNotifications(
      slug,
      notifications.map((notification) => ({ ...notification, isRead: true })),
    );
  }

  return (
    <div className="mx-auto w-full max-w-[960px]">
      <div className="mb-9">
        <h1 className="text-[30px] font-semibold tracking-tight text-zinc-900">Notifications</h1>
        <p className="mt-1 text-sm text-zinc-500">Updates that need your attention</p>
      </div>

      <section
        aria-label="Notifications"
        className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"
      >
        <div className="flex min-h-[68px] items-center justify-between border-b border-zinc-100 px-5 sm:px-6">
          <div className="flex items-center gap-2" role="group" aria-label="Notification filter">
            <button
              type="button"
              aria-pressed={filter === "all"}
              onClick={() => setFilter("all")}
              className={`rounded-lg px-3.5 py-2 text-xs font-medium transition ${
                filter === "all" ? "bg-zinc-100 text-zinc-900" : "text-zinc-500 hover:bg-zinc-50"
              }`}
            >
              All
            </button>
            <button
              type="button"
              aria-pressed={filter === "unread"}
              onClick={() => setFilter("unread")}
              className={`rounded-lg px-3.5 py-2 text-xs font-medium transition ${
                filter === "unread" ? "bg-zinc-100 text-zinc-900" : "text-zinc-500 hover:bg-zinc-50"
              }`}
            >
              Unread
            </button>
          </div>
          <button
            type="button"
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="text-xs font-medium text-violet-600 transition hover:text-violet-700 disabled:cursor-default disabled:text-zinc-400"
          >
            Mark all read
          </button>
        </div>

        {visibleNotifications.length > 0 ? (
          <ul className="divide-y divide-zinc-100">
            {visibleNotifications.map((notification) => (
              <li key={notification.id}>
                <button
                  type="button"
                  onClick={() => markRead(notification.id)}
                  disabled={notification.isRead}
                  aria-label={
                    notification.isRead
                      ? `${notification.title}, already read`
                      : `Mark ${notification.title} as read`
                  }
                  className={`flex min-h-[104px] w-full items-start gap-4 px-5 py-5 text-left transition sm:px-6 ${
                    notification.isRead ? "bg-white" : "bg-[#fbfaff] hover:bg-violet-50/60"
                  } disabled:cursor-default`}
                >
                  <NotificationIcon kind={notification.kind} />
                  <span className="min-w-0 flex-1 pt-0.5">
                    <span className="block text-[13px] font-semibold text-zinc-900">
                      {notification.title}
                    </span>
                    <span className="mt-1 block truncate text-xs text-zinc-500">
                      {notification.description}
                    </span>
                    <span className="mt-2 block text-[10px] text-zinc-400">
                      {notification.time}
                    </span>
                  </span>
                  <span className="flex h-10 w-2 shrink-0 items-center justify-center">
                    {!notification.isRead ? (
                      <span className="h-2 w-2 rounded-full bg-violet-500" />
                    ) : null}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-6 py-14 text-center">
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
              <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9ZM10 21h4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <p className="mt-3 text-sm font-medium text-zinc-800">You’re all caught up</p>
            <p className="mt-1 text-xs text-zinc-500">There are no unread notifications.</p>
          </div>
        )}
      </section>
    </div>
  );
}
