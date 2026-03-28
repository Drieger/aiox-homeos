"use server";
import { db } from "@/lib/db";
import { notebooks, documents, tags, documentTags } from "@/lib/db/schema";
import { ulid } from "ulidx";
import { eq, desc, count, and } from "drizzle-orm";
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

export type Tag = {
  id: string;
  name: string;
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

export async function createNotebook(name: string) {
  const id = ulid();
  await db.insert(notebooks).values({ id, name });
  revalidatePath("/kb");
}

export async function moveDocument(id: string, notebookId: string) {
  await db
    .update(documents)
    .set({ notebookId, updatedAt: Date.now() })
    .where(eq(documents.id, id));
  revalidatePath("/kb");
  revalidatePath(`/kb/${id}`);
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

export async function getDocuments(
  notebookId?: string,
  tagId?: string
): Promise<DocumentWithNotebook[]> {
  if (tagId) {
    return db
      .select({
        id: documents.id,
        title: documents.title,
        notebookName: notebooks.name,
        updatedAt: documents.updatedAt,
      })
      .from(documents)
      .innerJoin(notebooks, eq(notebooks.id, documents.notebookId))
      .innerJoin(documentTags, eq(documentTags.documentId, documents.id))
      .where(eq(documentTags.tagId, tagId))
      .orderBy(desc(documents.updatedAt));
  }

  if (notebookId) {
    return db
      .select({
        id: documents.id,
        title: documents.title,
        notebookName: notebooks.name,
        updatedAt: documents.updatedAt,
      })
      .from(documents)
      .innerJoin(notebooks, eq(notebooks.id, documents.notebookId))
      .where(eq(documents.notebookId, notebookId))
      .orderBy(desc(documents.updatedAt));
  }

  return db
    .select({
      id: documents.id,
      title: documents.title,
      notebookName: notebooks.name,
      updatedAt: documents.updatedAt,
    })
    .from(documents)
    .innerJoin(notebooks, eq(notebooks.id, documents.notebookId))
    .orderBy(desc(documents.updatedAt));
}

export async function getDocumentById(id: string) {
  const result = await db
    .select()
    .from(documents)
    .where(eq(documents.id, id))
    .limit(1);
  return result[0] ?? null;
}

export async function updateDocument(
  id: string,
  data: { title?: string; content?: string }
) {
  await db
    .update(documents)
    .set({ ...data, updatedAt: Date.now() })
    .where(eq(documents.id, id));
  revalidatePath("/kb");
}

export async function getTags(): Promise<Tag[]> {
  return db.select({ id: tags.id, name: tags.name }).from(tags).orderBy(tags.name);
}

export async function getDocumentTags(documentId: string): Promise<Tag[]> {
  return db
    .select({ id: tags.id, name: tags.name })
    .from(tags)
    .innerJoin(documentTags, eq(documentTags.tagId, tags.id))
    .where(eq(documentTags.documentId, documentId));
}

export async function addTagToDocument(documentId: string, tagName: string) {
  let tag = await db
    .select({ id: tags.id, name: tags.name })
    .from(tags)
    .where(eq(tags.name, tagName))
    .limit(1);

  if (tag.length === 0) {
    const id = ulid();
    await db.insert(tags).values({ id, name: tagName });
    tag = [{ id, name: tagName }];
  }

  await db
    .insert(documentTags)
    .values({ documentId, tagId: tag[0]!.id })
    .onConflictDoNothing();

  revalidatePath(`/kb/${documentId}`);
}

export async function removeTagFromDocument(documentId: string, tagId: string) {
  await db
    .delete(documentTags)
    .where(
      and(
        eq(documentTags.documentId, documentId),
        eq(documentTags.tagId, tagId)
      )
    );
  revalidatePath(`/kb/${documentId}`);
}
