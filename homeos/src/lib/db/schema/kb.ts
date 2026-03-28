import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { ulid } from "ulidx";

export const notebooks = sqliteTable("notebooks", {
  id: text("id").primaryKey().$defaultFn(() => ulid()),
  name: text("name").notNull(),
  createdAt: integer("created_at").notNull().$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at").notNull().$defaultFn(() => Date.now()),
});

export const documents = sqliteTable("documents", {
  id: text("id").primaryKey().$defaultFn(() => ulid()),
  notebookId: text("notebook_id")
    .notNull()
    .references(() => notebooks.id),
  title: text("title").notNull().default("Sem título"),
  content: text("content").notNull().default(""),
  createdAt: integer("created_at").notNull().$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at").notNull().$defaultFn(() => Date.now()),
});

export const tags = sqliteTable("tags", {
  id: text("id").primaryKey().$defaultFn(() => ulid()),
  name: text("name").notNull().unique(),
});

export const documentTags = sqliteTable(
  "document_tags",
  {
    documentId: text("document_id")
      .notNull()
      .references(() => documents.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.documentId, t.tagId] })]
);

export const documentLinks = sqliteTable(
  "document_links",
  {
    sourceId: text("source_id")
      .notNull()
      .references(() => documents.id, { onDelete: "cascade" }),
    targetId: text("target_id")
      .notNull()
      .references(() => documents.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.sourceId, t.targetId] })]
);
