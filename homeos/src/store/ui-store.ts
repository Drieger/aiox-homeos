import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIStore {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
}

/**
 * Store global de UI com estado persistido no localStorage.
 *
 * @design Criado na Story 1.3 com apenas `sidebarCollapsed`.
 * A Story 1.4 complementará com `theme` e providers adicionais.
 * Usa `persist` middleware para sobreviver a reloads de página.
 */
export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    }),
    { name: "ui-store" }
  )
);
