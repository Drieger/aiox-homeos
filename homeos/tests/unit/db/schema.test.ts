import { describe, it, expectTypeOf } from "vitest";
import type { Book } from "@/types";

describe("Book type", () => {
  it("possui todos os campos obrigatórios", () => {
    expectTypeOf<Book>().toHaveProperty("id");
    expectTypeOf<Book>().toHaveProperty("title");
    expectTypeOf<Book>().toHaveProperty("author");
    expectTypeOf<Book>().toHaveProperty("release_year");
    expectTypeOf<Book>().toHaveProperty("reading_year");
    expectTypeOf<Book>().toHaveProperty("status");
    expectTypeOf<Book>().toHaveProperty("cover_path");
    expectTypeOf<Book>().toHaveProperty("synopsis");
    expectTypeOf<Book>().toHaveProperty("notes");
    expectTypeOf<Book>().toHaveProperty("created_at");
    expectTypeOf<Book>().toHaveProperty("updated_at");
  });

  it("status é union type correto", () => {
    expectTypeOf<Book["status"]>().toEqualTypeOf<"unread" | "reading" | "read">();
  });

  it("campos opcionais são nullable", () => {
    expectTypeOf<Book["release_year"]>().toEqualTypeOf<number | null>();
    expectTypeOf<Book["cover_path"]>().toEqualTypeOf<string | null>();
    expectTypeOf<Book["reading_year"]>().toEqualTypeOf<number | null>();
    expectTypeOf<Book["synopsis"]>().toEqualTypeOf<string | null>();
    expectTypeOf<Book["notes"]>().toEqualTypeOf<string | null>();
  });
});
