import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { join } from "node:path";
import * as schema from "./schema";

/**
 * Singleton do banco de dados SQLite com proteção contra hot reload do Next.js.
 *
 * @design Em desenvolvimento, o Next.js recarrega módulos Node.js a cada
 * alteração de arquivo. Sem este padrão, cada reload criaria uma nova
 * conexão `better-sqlite3`, acumulando conexões abertas indefinidamente.
 *
 * A solução usa `globalThis` como cache: a primeira chamada cria e armazena
 * a instância; chamadas subsequentes (pós-reload) recuperam a instância já
 * existente. Em produção, o módulo é carregado uma única vez e o `globalThis`
 * é desnecessário — mas não prejudica.
 */

const globalForDb = globalThis as unknown as {
  db: ReturnType<typeof createDb> | undefined;
};

function createDb() {
  const dbPath = join(process.cwd(), "data", "homeos.db");
  const sqlite = new Database(dbPath);

  // WAL mode para durabilidade e performance
  sqlite.pragma("journal_mode = WAL");

  const db = drizzle(sqlite, { schema });

  // Inicializa FTS5 e triggers do KB (idempotente)
  initKbFts(sqlite);

  return db;
}

export const db = globalForDb.db ?? createDb();

if (process.env.NODE_ENV !== "production") {
  globalForDb.db = db;
}

/**
 * Inicializa FTS5 e triggers para o módulo Knowledge Base.
 *
 * @design Executado uma vez na inicialização do DB. FTS5 e triggers não são
 * suportados pelo drizzle-kit, portanto são criados via SQL raw.
 * - `CREATE VIRTUAL TABLE IF NOT EXISTS` é idempotente.
 * - Triggers usam `DROP IF EXISTS` + `CREATE` para evitar duplicação em hot-reload.
 * - O índice em `documents.title` acelera a resolução de wiki-links `[[Título]]`.
 */
function initKbFts(sqlite: InstanceType<typeof Database>) {
  sqlite.exec(`
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
  `);
}
