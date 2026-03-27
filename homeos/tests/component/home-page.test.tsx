import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HomePage from "@/app/(app)/page";

describe("HomePage", () => {
  it("renderiza o título 'HomeOS'", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { name: "HomeOS" })).toBeInTheDocument();
  });

  it("não contém links para /books", () => {
    render(<HomePage />);
    const links = screen.queryAllByRole("link");
    for (const link of links) {
      expect(link).not.toHaveAttribute("href", "/books");
    }
  });
});
