"use client";

import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { useTheme } from "next-themes";
import { useAutoSave } from "@/hooks/use-auto-save";
import { updateDocument, moveDocument } from "@/lib/kb/actions";
import { useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagManager } from "@/components/kb/tag-manager";
import type { NotebookWithCount, Tag } from "@/lib/kb/actions";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface KbEditorProps {
  id: string;
  initialTitle: string;
  initialContent: string;
  initialNotebookId: string;
  notebooks: NotebookWithCount[];
  initialTags: Tag[];
  allTags: Tag[];
}

export function KbEditor({
  id,
  initialTitle,
  initialContent,
  initialNotebookId,
  notebooks,
  initialTags,
  allTags,
}: KbEditorProps) {
  const { resolvedTheme } = useTheme();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [, startMove] = useTransition();

  const saveStatus = useAutoSave(id, title, content, updateDocument);

  function handleNotebookChange(notebookId: string | null) {
    if (!notebookId) return;
    startMove(async () => {
      await moveDocument(id, notebookId);
    });
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b px-4 py-2 shrink-0">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-2xl font-bold bg-transparent border-none outline-none w-full"
          placeholder="Sem título"
        />
        <div className="flex items-center gap-3 ml-4 shrink-0">
          {saveStatus === "saving" && (
            <span className="text-muted-foreground text-sm">salvando...</span>
          )}
          {saveStatus === "saved" && (
            <span className="text-muted-foreground text-sm">salvo</span>
          )}
          <Select defaultValue={initialNotebookId} onValueChange={handleNotebookChange}>
            <SelectTrigger className="h-7 w-36 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {notebooks.map((nb) => (
                <SelectItem key={nb.id} value={nb.id} className="text-xs">
                  {nb.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button
            onClick={() => setMode(mode === "edit" ? "preview" : "edit")}
            className="text-sm px-3 py-1 rounded-md border hover:bg-accent transition-colors"
          >
            {mode === "edit" ? "Preview" : "Editar"}
          </button>
        </div>
      </div>

      <TagManager documentId={id} initialTags={initialTags} allTags={allTags} />

      <div className="flex-1 overflow-auto">
        {mode === "edit" ? (
          <div data-color-mode={resolvedTheme === "dark" ? "dark" : "light"} className="h-full">
            <MDEditor
              value={content}
              onChange={(val) => setContent(val ?? "")}
              height="100%"
              preview="edit"
            />
          </div>
        ) : (
          <div className="prose dark:prose-invert max-w-none p-6">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
