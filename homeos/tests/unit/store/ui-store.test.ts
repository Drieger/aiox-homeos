import { describe, it, expect, beforeEach } from "vitest";
import { useUIStore } from "@/store/ui-store";

beforeEach(() => {
  useUIStore.setState({
    sidebarCollapsed: false,
    theme: "system",
  });
});

describe("ui-store — sidebarCollapsed", () => {
  it("inicia como false", () => {
    expect(useUIStore.getState().sidebarCollapsed).toBe(false);
  });

  it("toggleSidebar alterna de false para true", () => {
    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().sidebarCollapsed).toBe(true);
  });

  it("toggleSidebar alterna de true para false", () => {
    useUIStore.getState().toggleSidebar();
    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().sidebarCollapsed).toBe(false);
  });

  it("setSidebarCollapsed(true) define como true", () => {
    useUIStore.getState().setSidebarCollapsed(true);
    expect(useUIStore.getState().sidebarCollapsed).toBe(true);
  });
});

describe("ui-store — theme", () => {
  it("theme inicia como 'system'", () => {
    expect(useUIStore.getState().theme).toBe("system");
  });

  it("setTheme('dark') define tema como dark", () => {
    useUIStore.getState().setTheme("dark");
    expect(useUIStore.getState().theme).toBe("dark");
  });
});
