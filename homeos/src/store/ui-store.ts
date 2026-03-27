import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

interface UIStore {
  sidebarCollapsed: boolean;
  theme: Theme;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setTheme: (theme: Theme) => void;
}

/**
 * Store global de UI com estado persistido no localStorage.
 *
 * @design Criado na Story 1.3 com `sidebarCollapsed`.
 * Expandido na Story 1.4 com `theme` (light/dark/system).
 * Usa `persist` middleware para sobreviver a reloads de página.
 */
export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      theme: "system",
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setTheme: (theme) => set({ theme }),
    }),
    { name: "ui-store" }
  )
);
