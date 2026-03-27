import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AppSidebar } from "@/components/layout/app-sidebar";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/books",
  Link: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

// Mock zustand store
const mockToggleSidebar = vi.fn();
let mockCollapsed = false;

vi.mock("@/store/ui-store", () => ({
  useUIStore: () => ({
    sidebarCollapsed: mockCollapsed,
    toggleSidebar: mockToggleSidebar,
  }),
}));

describe("AppSidebar", () => {
  beforeEach(() => {
    mockCollapsed = false;
    mockToggleSidebar.mockClear();
  });

  it("renderiza item 'Biblioteca' e submenu 'Livros'", () => {
    render(<AppSidebar />);
    expect(screen.getByText("Biblioteca")).toBeInTheDocument();
    expect(screen.getByText("Livros")).toBeInTheDocument();
  });

  it("renderiza item 'Design System'", () => {
    render(<AppSidebar />);
    expect(screen.getByText("Design System")).toBeInTheDocument();
  });

  it("botão de toggle chama toggleSidebar no store", () => {
    render(<AppSidebar />);
    const toggleButton = screen.getByRole("button", { name: /toggle sidebar/i });
    fireEvent.click(toggleButton);
    expect(mockToggleSidebar).toHaveBeenCalledTimes(1);
  });
});
