"use client";

import { useState, useRef, useTransition, useEffect } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { addTagToDocument, removeTagFromDocument } from "@/lib/kb/actions";
import type { Tag } from "@/lib/kb/actions";

interface TagManagerProps {
  documentId: string;
  initialTags: Tag[];
  allTags: Tag[];
}

export function TagManager({ documentId, initialTags, allTags }: TagManagerProps) {
  const [activeTags, setActiveTags] = useState<Tag[]>(initialTags);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const activeTagIds = new Set(activeTags.map((t) => t.id));

  const suggestions = allTags.filter(
    (t) =>
      !activeTagIds.has(t.id) &&
      t.name.toLowerCase().includes(input.toLowerCase())
  );

  function handleAddTag(tagName: string) {
    const trimmed = tagName.trim();
    if (!trimmed) return;

    const existing = activeTags.find(
      (t) => t.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (existing) {
      setInput("");
      setOpen(false);
      return;
    }

    const optimisticTag: Tag = {
      id: `tmp-${Date.now()}`,
      name: trimmed,
    };
    setActiveTags((prev) => [...prev, optimisticTag]);
    setInput("");
    setOpen(false);

    startTransition(async () => {
      await addTagToDocument(documentId, trimmed);
    });
  }

  function handleRemoveTag(tagId: string) {
    setActiveTags((prev) => prev.filter((t) => t.id !== tagId));
    startTransition(async () => {
      await removeTagFromDocument(documentId, tagId);
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions.length > 0 && input) {
        handleAddTag(suggestions[0]!.name);
      } else if (input.trim()) {
        handleAddTag(input);
      }
    }
    if (e.key === "Escape") {
      setOpen(false);
      setInput("");
    }
  }

  useEffect(() => {
    setOpen(input.length > 0);
  }, [input]);

  return (
    <div className="flex flex-wrap items-center gap-1.5 px-4 py-2 border-b">
      {activeTags.map((tag) => (
        <Badge
          key={tag.id}
          variant="secondary"
          className="flex items-center gap-1 text-xs"
          data-testid={`tag-chip-${tag.name}`}
        >
          {tag.name}
          <button
            onClick={() => handleRemoveTag(tag.id)}
            disabled={isPending}
            aria-label={`Remover tag ${tag.name}`}
            className="ml-0.5 hover:text-destructive transition-colors"
          >
            <X className="size-3" />
          </button>
        </Badge>
      ))}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger render={<div className="inline-flex" />} nativeButton={false}>
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Adicionar tag..."
            className="h-6 w-32 text-xs border-dashed"
            data-testid="tag-input"
          />
        </PopoverTrigger>
        {suggestions.length > 0 && (
          <PopoverContent
            className="w-48 p-1"
            align="start"
          >
            <ul>
              {suggestions.map((tag) => (
                <li key={tag.id}>
                  <button
                    onClick={() => handleAddTag(tag.name)}
                    className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-accent transition-colors"
                  >
                    {tag.name}
                  </button>
                </li>
              ))}
            </ul>
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
}
