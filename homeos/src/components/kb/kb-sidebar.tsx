"use client";

import { useState, useTransition, useRef } from "react";
import { BookOpen, Plus, Tag } from "lucide-react";
import type { NotebookWithCount, Tag as TagType } from "@/lib/kb/actions";
import { createNotebook } from "@/lib/kb/actions";
import { useKbStore } from "@/stores/kb-store";

interface KbSidebarProps {
  notebooks: NotebookWithCount[];
  tags: TagType[];
}

export function KbSidebar({ notebooks, tags }: KbSidebarProps) {
  const { activeNotebookId, activeTagId, setActiveNotebook, setActiveTag, clearFilters } =
    useKbStore();

  const [showNewInput, setShowNewInput] = useState(false);
  const [newName, setNewName] = useState("");
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleShowInput() {
    setShowNewInput(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function handleSaveNotebook() {
    const trimmed = newName.trim();
    if (!trimmed) {
      setShowNewInput(false);
      setNewName("");
      return;
    }
    startTransition(async () => {
      await createNotebook(trimmed);
      setShowNewInput(false);
      setNewName("");
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSaveNotebook();
    if (e.key === "Escape") {
      setShowNewInput(false);
      setNewName("");
    }
  }

  return (
    <aside className="w-56 shrink-0 border-r flex flex-col">
      <div className="border-b px-4 py-3 shrink-0 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Cadernos</h2>
        <button
          onClick={handleShowInput}
          aria-label="Novo caderno"
          className="size-5 flex items-center justify-center rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
        >
          <Plus className="size-3.5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {/* Todos os documentos */}
        <button
          onClick={clearFilters}
          className={`w-full flex items-center px-4 py-1.5 text-sm transition-colors rounded-md mx-1 ${
            !activeNotebookId && !activeTagId
              ? "bg-accent text-accent-foreground font-medium"
              : "hover:bg-accent text-foreground"
          }`}
        >
          Todos os documentos
        </button>

        {/* Notebooks */}
        {notebooks.length === 0 ? (
          <p className="px-4 py-2 text-xs text-muted-foreground">Nenhum caderno</p>
        ) : (
          <ul>
            {notebooks.map((notebook) => (
              <li key={notebook.id}>
                <button
                  onClick={() => setActiveNotebook(notebook.id)}
                  className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors rounded-md mx-1 ${
                    activeNotebookId === notebook.id
                      ? "bg-accent text-accent-foreground font-medium"
                      : "hover:bg-accent"
                  }`}
                >
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

        {/* Inline new notebook input */}
        {showNewInput && (
          <div className="px-4 py-1">
            <input
              ref={inputRef}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSaveNotebook}
              placeholder="Nome do caderno"
              disabled={isPending}
              className="w-full text-sm bg-background border rounded px-2 py-1 outline-none focus:ring-1 focus:ring-ring"
              data-testid="new-notebook-input"
            />
          </div>
        )}

        {/* Tags section */}
        {tags.length > 0 && (
          <>
            <div className="px-4 pt-4 pb-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                <Tag className="size-3" /> Tags
              </p>
            </div>
            <ul>
              {tags.map((tag) => (
                <li key={tag.id}>
                  <button
                    onClick={() => setActiveTag(tag.id)}
                    className={`w-full flex items-center px-4 py-1.5 text-sm transition-colors rounded-md mx-1 ${
                      activeTagId === tag.id
                        ? "bg-accent text-accent-foreground font-medium"
                        : "hover:bg-accent"
                    }`}
                  >
                    <span className="truncate"># {tag.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </nav>
    </aside>
  );
}
