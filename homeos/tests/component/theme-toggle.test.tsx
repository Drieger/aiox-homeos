import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const mockSetTheme = vi.fn();

vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "system",
    setTheme: mockSetTheme,
  }),
}));

describe("ThemeToggle", () => {
  beforeEach(() => {
    mockSetTheme.mockClear();
  });

  it("renderiza trigger de alternância de tema", () => {
    render(<ThemeToggle />);
    expect(
      screen.getByRole("button", { name: /alternar tema/i })
    ).toBeInTheDocument();
  });

  it("trigger não está desabilitado", () => {
    render(<ThemeToggle />);
    expect(
      screen.getByRole("button", { name: /alternar tema/i })
    ).not.toBeDisabled();
  });

  it("contém ícone de sol (light mode)", () => {
    render(<ThemeToggle />);
    // lucide-react renderiza SVGs com classes identificáveis
    const btn = screen.getByRole("button", { name: /alternar tema/i });
    expect(btn.querySelector(".lucide-sun")).toBeTruthy();
  });

  it("contém ícone de lua (dark mode)", () => {
    render(<ThemeToggle />);
    const btn = screen.getByRole("button", { name: /alternar tema/i });
    expect(btn.querySelector(".lucide-moon")).toBeTruthy();
  });
});
