import { create } from "zustand";

interface KbState {
  activeNotebookId: string | null;
  activeTagId: string | null;
  setActiveNotebook: (id: string | null) => void;
  setActiveTag: (id: string | null) => void;
  clearFilters: () => void;
}

export const useKbStore = create<KbState>((set) => ({
  activeNotebookId: null,
  activeTagId: null,
  setActiveNotebook: (id) => set({ activeNotebookId: id, activeTagId: null }),
  setActiveTag: (id) => set({ activeTagId: id, activeNotebookId: null }),
  clearFilters: () => set({ activeNotebookId: null, activeTagId: null }),
}));
