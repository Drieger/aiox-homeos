import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const books = sqliteTable(
  "books",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    author: text("author").notNull(),
    release_year: integer("release_year"),
    reading_year: integer("reading_year"),
    status: text("status", { enum: ["unread", "reading", "read"] })
      .notNull()
      .default("unread"),
    cover_path: text("cover_path"),
    synopsis: text("synopsis"),
    notes: text("notes"),
    created_at: text("created_at").notNull(),
    updated_at: text("updated_at").notNull(),
  },
  (table) => ({
    statusIdx: index("books_status_idx").on(table.status),
    authorIdx: index("books_author_idx").on(table.author),
  })
);
