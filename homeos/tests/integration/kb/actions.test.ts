// @vitest-environment node
/**
 * Testes de integração para as Server Actions do KB.
 *
 * Testa as queries Drizzle diretamente em DB em memória.
 * O comportamento de redirect/revalidate é coberto por E2E.
 */
import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { resolve } from "node:path";
import { eq, desc, count } from "drizzle-orm";
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

// ── Helpers replicando a lógica das Server Actions ───────────────────────────

async function seedNotebookIfNeeded(db: ReturnType<typeof drizzle<typeof schema>>) {
  const existing = await db.select({ id: schema.notebooks.id }).from(schema.notebooks).limit(1);
  if (existing.length === 0) {
    const id = ulid();
    await db.insert(schema.notebooks).values({ id, name: "Geral" });
    return id;
  }
  return existing[0].id;
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

async function queryNotebooks(db: ReturnType<typeof drizzle<typeof schema>>) {
  return db
    .select({
      id: schema.notebooks.id,
      name: schema.notebooks.name,
      documentCount: count(schema.documents.id),
    })
    .from(schema.notebooks)
    .leftJoin(schema.documents, eq(schema.documents.notebookId, schema.notebooks.id))
    .groupBy(schema.notebooks.id);
}

async function queryDocuments(db: ReturnType<typeof drizzle<typeof schema>>) {
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

// ── Tests ────────────────────────────────────────────────────────────────────

describe("getNotebooks — query", () => {
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

  it("retorna lista vazia quando não há cadernos", async () => {
    const result = await queryNotebooks(db);
    expect(result).toEqual([]);
  });

  it("retorna cadernos com documentCount correto", async () => {
    const nbId = await seedNotebookIfNeeded(db);
    await insertDocument(db, nbId, "Doc A");
    await insertDocument(db, nbId, "Doc B");

    const result = await queryNotebooks(db);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Geral");
    expect(result[0].documentCount).toBe(2);
  });

  it("caderno sem documentos retorna documentCount = 0", async () => {
    await seedNotebookIfNeeded(db);
    const result = await queryNotebooks(db);
    expect(result[0].documentCount).toBe(0);
  });
});

describe("getDocuments — query", () => {
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

  it("retorna lista vazia quando não há documentos", async () => {
    const result = await queryDocuments(db);
    expect(result).toEqual([]);
  });

  it("retorna documentos ordenados por updatedAt desc", async () => {
    const nbId = await seedNotebookIfNeeded(db);
    const now = Date.now();

    const id1 = ulid();
    const id2 = ulid();
    await db.insert(schema.documents).values({
      id: id1,
      notebookId: nbId,
      title: "Antigo",
      content: "",
      updatedAt: now - 5000,
    });
    await db.insert(schema.documents).values({
      id: id2,
      notebookId: nbId,
      title: "Recente",
      content: "",
      updatedAt: now,
    });

    const result = await queryDocuments(db);
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe("Recente");
    expect(result[1].title).toBe("Antigo");
  });

  it("inclui o nome do caderno em cada documento", async () => {
    const nbId = await seedNotebookIfNeeded(db);
    await insertDocument(db, nbId);

    const result = await queryDocuments(db);
    expect(result[0].notebookName).toBe("Geral");
  });
});

describe("createDocument — lógica de seed", () => {
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

  it("cria caderno 'Geral' quando não existem cadernos", async () => {
    const notebooks = await queryNotebooks(db);
    expect(notebooks).toHaveLength(0);

    const notebookId = await seedNotebookIfNeeded(db);
    await insertDocument(db, notebookId);

    const notebooksAfter = await queryNotebooks(db);
    expect(notebooksAfter).toHaveLength(1);
    expect(notebooksAfter[0].name).toBe("Geral");
  });

  it("não duplica caderno 'Geral' em criações múltiplas", async () => {
    const nb1 = await seedNotebookIfNeeded(db);
    await insertDocument(db, nb1);
    const nb2 = await seedNotebookIfNeeded(db);
    await insertDocument(db, nb2);

    const notebooks = await queryNotebooks(db);
    expect(notebooks).toHaveLength(1);
    expect(notebooks[0].documentCount).toBe(2);
  });

  it("documento criado tem título 'Sem título'", async () => {
    const notebookId = await seedNotebookIfNeeded(db);
    await insertDocument(db, notebookId);

    const docs = await queryDocuments(db);
    expect(docs[0].title).toBe("Sem título");
  });
});

describe("deleteDocument — query", () => {
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

  it("remove o documento do banco de dados", async () => {
    const notebookId = await seedNotebookIfNeeded(db);
    const docId = await insertDocument(db, notebookId);

    let docs = await queryDocuments(db);
    expect(docs).toHaveLength(1);

    await db.delete(schema.documents).where(eq(schema.documents.id, docId));

    docs = await queryDocuments(db);
    expect(docs).toHaveLength(0);
  });
});
