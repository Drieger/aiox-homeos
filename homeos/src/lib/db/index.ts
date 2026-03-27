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

  return drizzle(sqlite, { schema });
}

export const db = globalForDb.db ?? createDb();

if (process.env.NODE_ENV !== "production") {
  globalForDb.db = db;
}
