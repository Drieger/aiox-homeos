// @vitest-environment node
/**
 * Testes de integração para Server Actions de organização do KB (Story 3.4).
 *
 * Testa as queries Drizzle diretamente em DB em memória.
 * O comportamento de redirect/revalidate é coberto por E2E.
 */
import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { resolve } from "node:path";
import { eq, desc, and } from "drizzle-orm";
import { ulid } from "ulidx";
import * as schema from "@/lib/db/schema";

const migrationsFolder = resolve(__dirname, "../../../src/lib/db/migrations");

function createTestDb() {
  const sqlite = new Database(":memory:");
  sqlite.pragma("foreign_keys = ON");
  const db = drizzle(sqlite, { schema });
  migrate(db, { migrationsFolder });
  return { db, sqlite };
}

// ── Query helpers (mirror server action logic) ────────────────────────────────

async function insertNotebook(
  db: ReturnType<typeof drizzle<typeof schema>>,
  name: string
) {
  const id = ulid();
  await db.insert(schema.notebooks).values({ id, name });
  return id;
}

async function insertDocument(
  db: ReturnType<typeof drizzle<typeof schema>>,
  notebookId: string,
  title = "Sem título"
) {
  const id = ulid();
  await db.insert(schema.documents).values({ id, notebookId, title, content: "" });
  return id;
}

async function insertTag(
  db: ReturnType<typeof drizzle<typeof schema>>,
  name: string
) {
  const id = ulid();
  await db.insert(schema.tags).values({ id, name });
  return id;
}

async function queryDocuments(
  db: ReturnType<typeof drizzle<typeof schema>>,
  notebookId?: string,
  tagId?: string
) {
  if (tagId) {
    return db
      .select({
        id: schema.documents.id,
        title: schema.documents.title,
        notebookName: schema.notebooks.name,
        updatedAt: schema.documents.updatedAt,
      })
      .from(schema.documents)
      .innerJoin(schema.notebooks, eq(schema.notebooks.id, schema.documents.notebookId))
      .innerJoin(
        schema.documentTags,
        eq(schema.documentTags.documentId, schema.documents.id)
      )
      .where(eq(schema.documentTags.tagId, tagId))
      .orderBy(desc(schema.documents.updatedAt));
  }

  if (notebookId) {
    return db
      .select({
        id: schema.documents.id,
        title: schema.documents.title,
        notebookName: schema.notebooks.name,
        updatedAt: schema.documents.updatedAt,
      })
      .from(schema.documents)
      .innerJoin(schema.notebooks, eq(schema.notebooks.id, schema.documents.notebookId))
      .where(eq(schema.documents.notebookId, notebookId))
      .orderBy(desc(schema.documents.updatedAt));
  }

  return db
    .select({
      id: schema.documents.id,
      title: schema.documents.title,
      notebookName: schema.notebooks.name,
      updatedAt: schema.documents.updatedAt,
    })
    .from(schema.documents)
    .innerJoin(schema.notebooks, eq(schema.notebooks.id, schema.documents.notebookId))
    .orderBy(desc(schema.documents.updatedAt));
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("createNotebook", () => {
  let db: ReturnType<typeof createTestDb>["db"];
  let sqlite: InstanceType<typeof Database>;

  beforeAll(() => {
    ({ db, sqlite } = createTestDb());
  });
  beforeEach(() => {
    sqlite.exec(
      "DELETE FROM document_links; DELETE FROM document_tags; DELETE FROM documents; DELETE FROM notebooks; DELETE FROM tags;"
    );
  });

  it("insere caderno com nome fornecido", async () => {
    const id = await insertNotebook(db, "Pesquisa");
    const result = await db
      .select()
      .from(schema.notebooks)
      .where(eq(schema.notebooks.id, id));
    expect(result).toHaveLength(1);
    expect(result[0]!.name).toBe("Pesquisa");
  });
});

describe("moveDocument", () => {
  let db: ReturnType<typeof createTestDb>["db"];
  let sqlite: InstanceType<typeof Database>;

  beforeAll(() => {
    ({ db, sqlite } = createTestDb());
  });
  beforeEach(() => {
    sqlite.exec(
      "DELETE FROM document_links; DELETE FROM document_tags; DELETE FROM documents; DELETE FROM notebooks; DELETE FROM tags;"
    );
  });

  it("atualiza notebookId e updatedAt do documento", async () => {
    const nb1 = await insertNotebook(db, "Caderno A");
    const nb2 = await insertNotebook(db, "Caderno B");
    const docId = await insertDocument(db, nb1, "Meu Doc");

    const before = await db
      .select({ notebookId: schema.documents.notebookId, updatedAt: schema.documents.updatedAt })
      .from(schema.documents)
      .where(eq(schema.documents.id, docId));

    await new Promise((r) => setTimeout(r, 2)); // garante updatedAt diferente
    const newUpdatedAt = Date.now();

    await db
      .update(schema.documents)
      .set({ notebookId: nb2, updatedAt: newUpdatedAt })
      .where(eq(schema.documents.id, docId));

    const after = await db
      .select({ notebookId: schema.documents.notebookId, updatedAt: schema.documents.updatedAt })
      .from(schema.documents)
      .where(eq(schema.documents.id, docId));

    expect(after[0]!.notebookId).toBe(nb2);
    expect(after[0]!.updatedAt).toBeGreaterThanOrEqual(before[0]!.updatedAt);
  });
});

describe("addTagToDocument / removeTagFromDocument", () => {
  let db: ReturnType<typeof createTestDb>["db"];
  let sqlite: InstanceType<typeof Database>;

  beforeAll(() => {
    ({ db, sqlite } = createTestDb());
  });
  beforeEach(() => {
    sqlite.exec(
      "DELETE FROM document_links; DELETE FROM document_tags; DELETE FROM documents; DELETE FROM notebooks; DELETE FROM tags;"
    );
  });

  it("cria tag se não existe e vincula ao documento", async () => {
    const nbId = await insertNotebook(db, "Geral");
    const docId = await insertDocument(db, nbId, "Doc Tags");

    // Simula addTagToDocument
    const tagName = "typescript";
    let tag = await db
      .select()
      .from(schema.tags)
      .where(eq(schema.tags.name, tagName))
      .limit(1);

    if (tag.length === 0) {
      const tagId = ulid();
      await db.insert(schema.tags).values({ id: tagId, name: tagName });
      tag = [{ id: tagId, name: tagName }];
    }
    await db
      .insert(schema.documentTags)
      .values({ documentId: docId, tagId: tag[0]!.id })
      .onConflictDoNothing();

    const result = await db
      .select()
      .from(schema.documentTags)
      .where(eq(schema.documentTags.documentId, docId));

    expect(result).toHaveLength(1);
    expect(result[0]!.tagId).toBe(tag[0]!.id);
  });

  it("é idempotente — adicionar mesma tag duas vezes não duplica", async () => {
    const nbId = await insertNotebook(db, "Geral");
    const docId = await insertDocument(db, nbId, "Doc Idem");
    const tagId = await insertTag(db, "react");

    await db
      .insert(schema.documentTags)
      .values({ documentId: docId, tagId })
      .onConflictDoNothing();
    await db
      .insert(schema.documentTags)
      .values({ documentId: docId, tagId })
      .onConflictDoNothing();

    const result = await db
      .select()
      .from(schema.documentTags)
      .where(eq(schema.documentTags.documentId, docId));

    expect(result).toHaveLength(1);
  });

  it("remove tag do documento corretamente", async () => {
    const nbId = await insertNotebook(db, "Geral");
    const docId = await insertDocument(db, nbId, "Doc Remove");
    const tagId = await insertTag(db, "removivel");

    await db.insert(schema.documentTags).values({ documentId: docId, tagId });

    await db
      .delete(schema.documentTags)
      .where(
        and(
          eq(schema.documentTags.documentId, docId),
          eq(schema.documentTags.tagId, tagId)
        )
      );

    const result = await db
      .select()
      .from(schema.documentTags)
      .where(eq(schema.documentTags.documentId, docId));

    expect(result).toHaveLength(0);
  });
});

describe("getDocuments com filtros", () => {
  let db: ReturnType<typeof createTestDb>["db"];
  let sqlite: InstanceType<typeof Database>;

  beforeAll(() => {
    ({ db, sqlite } = createTestDb());
  });
  beforeEach(() => {
    sqlite.exec(
      "DELETE FROM document_links; DELETE FROM document_tags; DELETE FROM documents; DELETE FROM notebooks; DELETE FROM tags;"
    );
  });

  it("retorna todos os documentos sem filtro", async () => {
    const nb1 = await insertNotebook(db, "A");
    const nb2 = await insertNotebook(db, "B");
    await insertDocument(db, nb1, "Doc A");
    await insertDocument(db, nb2, "Doc B");

    const result = await queryDocuments(db);
    expect(result).toHaveLength(2);
  });

  it("filtra por notebookId", async () => {
    const nb1 = await insertNotebook(db, "Filtrado");
    const nb2 = await insertNotebook(db, "Outro");
    await insertDocument(db, nb1, "No Filtrado");
    await insertDocument(db, nb2, "No Outro");

    const result = await queryDocuments(db, nb1);
    expect(result).toHaveLength(1);
    expect(result[0]!.notebookName).toBe("Filtrado");
  });

  it("filtra por tagId via JOIN com document_tags", async () => {
    const nbId = await insertNotebook(db, "Geral");
    const doc1 = await insertDocument(db, nbId, "Com Tag");
    await insertDocument(db, nbId, "Sem Tag");
    const tagId = await insertTag(db, "filtro");

    await db.insert(schema.documentTags).values({ documentId: doc1, tagId });

    const result = await queryDocuments(db, undefined, tagId);
    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe(doc1);
  });
});
