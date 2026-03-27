import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type { books } from "@/lib/db/schema";

export type Book = InferSelectModel<typeof books>;
export type NewBook = InferInsertModel<typeof books>;
