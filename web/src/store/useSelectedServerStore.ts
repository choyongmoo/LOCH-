import { create } from "zustand";

interface SelectedServerState {
    selectedServerId?: string | null;
    setSelectedServerId: (id?: string | null) => void;
}

export const useSelectedServerStore = create<SelectedServerState>((set) => ({
    selectedServerId: null,
    setSelectedServerId: (id) => set({ selectedServerId: id}),
}));