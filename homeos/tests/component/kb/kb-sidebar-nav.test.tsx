import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AppSidebar } from "@/components/layout/app-sidebar";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("@/store/ui-store", () => ({
  useUIStore: () => ({
    sidebarCollapsed: false,
    toggleSidebar: vi.fn(),
  }),
}));

describe("Sidebar — item Knowledge Base", () => {
  it("renderiza item 'Knowledge Base' na navegação", () => {
    render(<AppSidebar />);
    expect(screen.getByText("Knowledge Base")).toBeInTheDocument();
  });

  it("item 'Knowledge Base' aponta para /kb", () => {
    render(<AppSidebar />);
    const link = screen.getByText("Knowledge Base").closest("a");
    expect(link).toHaveAttribute("href", "/kb");
  });

  it("renderiza ícone BookOpen (SVG) para o item KB", () => {
    render(<AppSidebar />);
    const kbLink = screen.getByText("Knowledge Base").closest("a");
    const svg = kbLink?.querySelector("svg");
    expect(svg).toBeTruthy();
  });
});
