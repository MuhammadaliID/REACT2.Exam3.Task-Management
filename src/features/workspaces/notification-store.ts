"use client";

import { useEffect, useState } from "react";

export type WorkspaceNotification = {
  id: string;
  kind: "mention" | "assigned" | "status" | "cycle";
  title: string;
  description: string;
  time: string;
  isRead: boolean;
};

const changeEvent = "thread:notifications-changed";

const initialNotifications: WorkspaceNotification[] = [
  {
    id: "mention-retry-logic",
    kind: "mention",
    title: "Noah mentioned you",
    description: 'in “Add retry logic to sync engine”',
    time: "12 min ago",
    isRead: false,
  },
  {
    id: "assigned-keyboard-navigation",
    kind: "assigned",
    title: "Task assigned",
    description: 'Noah assigned you “Keyboard navigation”',
    time: "48 min ago",
    isRead: false,
  },
  {
    id: "status-atlas-sync",
    kind: "status",
    title: "Status changed",
    description: "Atlas sync engine moved to In Review",
    time: "2 hours ago",
    isRead: false,
  },
  {
    id: "cycle-07",
    kind: "cycle",
    title: "Cycle starts tomorrow",
    description: "Cycle 07 begins tomorrow morning",
    time: "Yesterday",
    isRead: true,
  },
];

function storageKey(slug: string) {
  return `thread:notifications:${slug}`;
}

export function getNotifications(slug: string): WorkspaceNotification[] {
  if (typeof window === "undefined") return [];

  const key = storageKey(slug);
  const stored = window.localStorage.getItem(key);
  if (!stored) {
    const seeded = initialNotifications.map((notification) => ({ ...notification }));
    window.localStorage.setItem(key, JSON.stringify(seeded));
    return seeded;
  }

  try {
    const parsed: unknown = JSON.parse(stored);
    if (Array.isArray(parsed)) return parsed as WorkspaceNotification[];
  } catch {
    // Restore the local demo data if the saved value is malformed.
  }

  const seeded = initialNotifications.map((notification) => ({ ...notification }));
  window.localStorage.setItem(key, JSON.stringify(seeded));
  return seeded;
}

export function saveNotifications(slug: string, notifications: WorkspaceNotification[]) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(storageKey(slug), JSON.stringify(notifications));
  window.dispatchEvent(new CustomEvent(changeEvent, { detail: { slug } }));
}

export function useWorkspaceNotifications(slug: string) {
  const [notifications, setNotifications] = useState<WorkspaceNotification[]>(() =>
    initialNotifications.map((notification) => ({ ...notification })),
  );

  useEffect(() => {
    const refresh = () => setNotifications(getNotifications(slug));
    const onStorage = (event: StorageEvent) => {
      if (event.key === storageKey(slug)) refresh();
    };
    const onChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ slug: string }>;
      if (customEvent.detail?.slug === slug) refresh();
    };

    refresh();
    window.addEventListener("storage", onStorage);
    window.addEventListener(changeEvent, onChange);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(changeEvent, onChange);
    };
  }, [slug]);

  return notifications;
}
