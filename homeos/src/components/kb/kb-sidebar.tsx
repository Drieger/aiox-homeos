"use client";

import { BookOpen } from "lucide-react";
import type { NotebookWithCount } from "@/lib/kb/actions";

interface KbSidebarProps {
  notebooks: NotebookWithCount[];
}

export function KbSidebar({ notebooks }: KbSidebarProps) {
  return (
    <aside className="w-56 shrink-0 border-r flex flex-col">
      <div className="border-b px-4 py-3 shrink-0">
        <h2 className="text-sm font-semibold text-foreground">Cadernos</h2>
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        {notebooks.length === 0 ? (
          <p className="px-4 py-2 text-xs text-muted-foreground">Nenhum caderno</p>
        ) : (
          <ul>
            {notebooks.map((notebook) => (
              <li key={notebook.id}>
                <button className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-accent transition-colors rounded-md mx-1">
                  <span className="flex items-center gap-2 min-w-0">
                    <BookOpen className="size-4 text-muted-foreground shrink-0" />
                    <span className="truncate">{notebook.name}</span>
                  </span>
                  <span className="text-xs text-muted-foreground ml-2 shrink-0">
                    {notebook.documentCount}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </aside>
  );
}
