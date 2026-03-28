"use server";
import { db } from "@/lib/db";
import { notebooks, documents } from "@/lib/db/schema";
import { ulid } from "ulidx";
import { eq, desc, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type NotebookWithCount = {
  id: string;
  name: string;
  documentCount: number;
};

export type DocumentWithNotebook = {
  id: string;
  title: string;
  notebookName: string;
  updatedAt: number;
};

export async function createDocument() {
  const existing = await db.select({ id: notebooks.id }).from(notebooks).limit(1);
  let notebookId: string;
  if (existing.length === 0) {
    const id = ulid();
    await db.insert(notebooks).values({ id, name: "Geral" });
    notebookId = id;
  } else {
    notebookId = existing[0]!.id;
  }
  const id = ulid();
  await db.insert(documents).values({ id, notebookId, title: "Sem título", content: "" });
  redirect(`/kb/${id}`);
}

export async function deleteDocument(id: string) {
  await db.delete(documents).where(eq(documents.id, id));
  revalidatePath("/kb");
  redirect("/kb");
}

export async function getNotebooks(): Promise<NotebookWithCount[]> {
  const result = await db
    .select({
      id: notebooks.id,
      name: notebooks.name,
      documentCount: count(documents.id),
    })
    .from(notebooks)
    .leftJoin(documents, eq(documents.notebookId, notebooks.id))
    .groupBy(notebooks.id);
  return result;
}

export async function getDocuments(): Promise<DocumentWithNotebook[]> {
  const result = await db
    .select({
      id: documents.id,
      title: documents.title,
      notebookName: notebooks.name,
      updatedAt: documents.updatedAt,
    })
    .from(documents)
    .innerJoin(notebooks, eq(notebooks.id, documents.notebookId))
    .orderBy(desc(documents.updatedAt));
  return result;
}
