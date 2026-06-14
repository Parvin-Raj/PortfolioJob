"use client";

import { useRef } from "react";
import {
  Home,
  LayoutGrid,
  Wrench,
  FolderGit2,
  Timer,
  Send,
} from "lucide-react";

type Item = { id: string; label: string; icon: React.ComponentType<{ className?: string }> };

const items: Item[] = [
  { id: "hero", label: "Intro", icon: Home },
  { id: "showcase", label: "Showcase", icon: LayoutGrid },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "timeline", label: "Timeline", icon: Timer },
  { id: "contact", label: "Contact", icon: Send },
];

export function NavBar() {
  const container = useRef<HTMLDivElement>(null);

  const onNav = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={container} className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-4xl">
      <nav
        className="flex flex-wrap items-center justify-center gap-1.5 rounded-2xl border border-gray-200 bg-white/95 px-2.5 py-2.5 shadow-nav backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/95"
        aria-label="Main navigation"
      >
        <a
          href="/ParvinRaj_SDE.pdf"
          download="ParvinRaj_SDE.pdf"
          className="order-first sm:order-none mr-auto sm:mr-0 inline-flex items-center gap-2 rounded-xl btn-primary px-3.5 py-2 text-sm font-semibold"
        >
          Download CV
        </a>
        {items.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onNav(id)}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-brand transition-colors dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <Icon className="h-4 w-4 shrink-0 opacity-80" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
