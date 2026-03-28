"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { FilePlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createDocument, deleteDocument, getDocuments } from "@/lib/kb/actions";
import type { DocumentWithNotebook } from "@/lib/kb/actions";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useKbStore } from "@/stores/kb-store";

interface DocumentListProps {
  documents: DocumentWithNotebook[];
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function DocumentList({ documents: initialDocuments }: DocumentListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [docs, setDocs] = useState<DocumentWithNotebook[]>(initialDocuments);
  const [, startFilter] = useTransition();

  const { activeNotebookId, activeTagId } = useKbStore();

  useEffect(() => {
    startFilter(async () => {
      const filtered = await getDocuments(
        activeNotebookId ?? undefined,
        activeTagId ?? undefined
      );
      setDocs(filtered);
    });
  }, [activeNotebookId, activeTagId]);

  function handleCreate() {
    startTransition(async () => {
      await createDocument();
    });
  }

  function handleDelete(id: string) {
    setDeletingId(id);
    startTransition(async () => {
      await deleteDocument(id);
    });
  }

  return (
    <div className="w-72 shrink-0 border-r flex flex-col overflow-hidden">
      <div className="border-b px-4 py-3 shrink-0 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Documentos</h2>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleCreate}
          disabled={isPending}
          aria-label="Novo documento"
        >
          <FilePlus className="size-4" />
        </Button>
      </div>
      {docs.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6">
          <p className="text-sm text-muted-foreground text-center">
            Nenhum documento. Crie um para começar.
          </p>
          <Button variant="outline" size="sm" onClick={handleCreate} disabled={isPending}>
            <FilePlus className="size-4" />
            Novo Documento
          </Button>
        </div>
      ) : (
        <ul className="flex-1 overflow-y-auto py-1">
          {docs.map((doc) => (
            <li key={doc.id} className="group flex items-center gap-1 px-2">
              <Link
                href={`/kb/${doc.id}`}
                className="flex-1 min-w-0 rounded-md px-2 py-2 hover:bg-accent transition-colors"
              >
                <p className="truncate text-sm font-medium">{doc.title}</p>
                <p className="text-xs text-muted-foreground">
                  {doc.notebookName} · {formatDate(doc.updatedAt)}
                </p>
              </Link>
              <Dialog>
                <DialogTrigger
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon-sm" }),
                    "opacity-0 group-hover:opacity-100 shrink-0"
                  )}
                  aria-label={`Excluir ${doc.title}`}
                >
                  <Trash2 className="size-3.5" />
                </DialogTrigger>
                <DialogContent showCloseButton={false}>
                  <DialogHeader>
                    <DialogTitle>Excluir documento</DialogTitle>
                    <DialogDescription>
                      Tem certeza que deseja excluir &ldquo;{doc.title}&rdquo;? Esta ação não pode
                      ser desfeita.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="destructive"
                      disabled={deletingId === doc.id && isPending}
                      onClick={() => handleDelete(doc.id)}
                    >
                      {deletingId === doc.id && isPending ? "Excluindo..." : "Excluir"}
                    </Button>
                    <DialogClose
                      className={cn(buttonVariants({ variant: "outline" }))}
                    >
                      Cancelar
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
