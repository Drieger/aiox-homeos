// @vitest-environment node
import { describe, it, expect, beforeAll } from "vitest";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { resolve } from "node:path";
import { ulid } from "ulidx";
import * as schema from "@/lib/db/schema";

const migrationsFolder = resolve(__dirname, "../../../src/lib/db/migrations");

const KB_FTS_SQL = `
  CREATE VIRTUAL TABLE IF NOT EXISTS documents_fts USING fts5(
    title,
    content,
    content=documents,
    content_rowid=rowid
  );

  DROP TRIGGER IF EXISTS documents_ai;
  CREATE TRIGGER documents_ai AFTER INSERT ON documents BEGIN
    INSERT INTO documents_fts(rowid, title, content)
    VALUES (new.rowid, new.title, new.content);
  END;

  DROP TRIGGER IF EXISTS documents_ad;
  CREATE TRIGGER documents_ad AFTER DELETE ON documents BEGIN
    INSERT INTO documents_fts(documents_fts, rowid, title, content)
    VALUES ('delete', old.rowid, old.title, old.content);
  END;

  DROP TRIGGER IF EXISTS documents_au;
  CREATE TRIGGER documents_au AFTER UPDATE ON documents BEGIN
    INSERT INTO documents_fts(documents_fts, rowid, title, content)
    VALUES ('delete', old.rowid, old.title, old.content);
    INSERT INTO documents_fts(rowid, title, content)
    VALUES (new.rowid, new.title, new.content);
  END;

  CREATE INDEX IF NOT EXISTS idx_documents_title ON documents(title);
`;

function createTestDb() {
  const sqlite = new Database(":memory:");
  sqlite.pragma("foreign_keys = ON");
  const db = drizzle(sqlite, { schema });
  migrate(db, { migrationsFolder });
  sqlite.exec(KB_FTS_SQL);
  return { db, sqlite };
}

describe("KB FTS5 — busca full-text", () => {
  let db: ReturnType<typeof createTestDb>["db"];
  let sqlite: InstanceType<typeof Database>;
  let notebookId: string;

  beforeAll(() => {
    ({ db, sqlite } = createTestDb());

    notebookId = ulid();
    const now = Date.now();
    db.insert(schema.notebooks).values({ id: notebookId, name: "Geral", createdAt: now, updatedAt: now }).run();
  });

  it("trigger INSERT: documento inserido é encontrado na busca FTS", () => {
    const now = Date.now();

    db.insert(schema.documents).values({
      id: ulid(),
      notebookId,
      title: "Arquitetura de Software",
      content: "Design patterns e boas práticas",
      createdAt: now,
      updatedAt: now,
    }).run();

    const results = sqlite.prepare("SELECT * FROM documents_fts WHERE documents_fts MATCH ?").all("arquitetura");
    expect(results.length).toBeGreaterThan(0);
  });

  it("busca por termo no conteúdo retorna resultado", () => {
    const now = Date.now();

    db.insert(schema.documents).values({
      id: ulid(),
      notebookId,
      title: "Nota de Reunião",
      content: "Discussão sobre infraestrutura e deploy",
      createdAt: now,
      updatedAt: now,
    }).run();

    const results = sqlite.prepare("SELECT * FROM documents_fts WHERE documents_fts MATCH ?").all("infraestrutura");
    expect(results.length).toBeGreaterThan(0);
  });

  it("trigger UPDATE: busca reflete título atualizado", () => {
    const docId = ulid();
    const now = Date.now();

    db.insert(schema.documents).values({
      id: docId,
      notebookId,
      title: "Titulo Original",
      content: "Conteúdo qualquer",
      createdAt: now,
      updatedAt: now,
    }).run();

    sqlite.prepare("UPDATE documents SET title = ?, updated_at = ? WHERE id = ?").run("Titulo Atualizado", Date.now(), docId);

    const results = sqlite.prepare("SELECT * FROM documents_fts WHERE documents_fts MATCH ?").all("\"Titulo Atualizado\"");
    expect(results.length).toBeGreaterThan(0);
  });

  it("índice idx_documents_title existe", () => {
    const row = sqlite
      .prepare("SELECT name FROM sqlite_master WHERE type='index' AND name='idx_documents_title'")
      .get() as { name: string } | undefined;
    expect(row?.name).toBe("idx_documents_title");
  });
});
