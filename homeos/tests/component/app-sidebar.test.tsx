import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AppSidebar } from "@/components/layout/app-sidebar";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
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

  it("renderiza item 'Home'", () => {
    render(<AppSidebar />);
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("renderiza item 'Design System'", () => {
    render(<AppSidebar />);
    expect(screen.getByText("Design System")).toBeInTheDocument();
  });

  it("não renderiza 'Biblioteca' nem 'Livros'", () => {
    render(<AppSidebar />);
    expect(screen.queryByText("Biblioteca")).not.toBeInTheDocument();
    expect(screen.queryByText("Livros")).not.toBeInTheDocument();
  });

  it("botão de toggle chama toggleSidebar no store", () => {
    render(<AppSidebar />);
    const toggleButton = screen.getByRole("button", { name: /toggle sidebar/i });
    fireEvent.click(toggleButton);
    expect(mockToggleSidebar).toHaveBeenCalledTimes(1);
  });
});
