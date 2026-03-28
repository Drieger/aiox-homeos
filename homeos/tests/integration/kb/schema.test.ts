// @vitest-environment node
import { describe, it, expect, beforeAll } from "vitest";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { resolve } from "node:path";
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

describe("KB Schema — tabelas e tipos", () => {
  let db: ReturnType<typeof createTestDb>["db"];

  beforeAll(() => {
    ({ db } = createTestDb());
  });

  it("insere e recupera um notebook", () => {
    const id = ulid();
    const now = Date.now();

    db.insert(schema.notebooks).values({ id, name: "Geral", createdAt: now, updatedAt: now }).run();

    const rows = db.select().from(schema.notebooks).all();
    expect(rows).toHaveLength(1);
    expect(rows[0].name).toBe("Geral");
    expect(rows[0].id).toBe(id);
  });

  it("insere e recupera um documento", () => {
    const notebookId = ulid();
    const docId = ulid();
    const now = Date.now();

    db.insert(schema.notebooks).values({ id: notebookId, name: "Test NB", createdAt: now, updatedAt: now }).run();
    db.insert(schema.documents).values({
      id: docId,
      notebookId,
      title: "Minha Nota",
      content: "# Hello",
      createdAt: now,
      updatedAt: now,
    }).run();

    const rows = db.select().from(schema.documents).all();
    expect(rows.some((r) => r.id === docId)).toBe(true);
    expect(rows.find((r) => r.id === docId)?.title).toBe("Minha Nota");
  });

  it("rejeita tag com nome duplicado", () => {
    db.insert(schema.tags).values({ id: ulid(), name: "typescript" }).run();

    expect(() => {
      db.insert(schema.tags).values({ id: ulid(), name: "typescript" }).run();
    }).toThrow();
  });
});
