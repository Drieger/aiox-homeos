"use client";

import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { useTheme } from "next-themes";
import { useAutoSave } from "@/hooks/use-auto-save";
import { updateDocument } from "@/lib/kb/actions";
import { useState } from "react";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface KbEditorProps {
  id: string;
  initialTitle: string;
  initialContent: string;
}

export function KbEditor({ id, initialTitle, initialContent }: KbEditorProps) {
  const { resolvedTheme } = useTheme();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [mode, setMode] = useState<"edit" | "preview">("edit");

  const saveStatus = useAutoSave(id, title, content, updateDocument);

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
          <button
            onClick={() => setMode(mode === "edit" ? "preview" : "edit")}
            className="text-sm px-3 py-1 rounded-md border hover:bg-accent transition-colors"
          >
            {mode === "edit" ? "Preview" : "Editar"}
          </button>
        </div>
      </div>

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
