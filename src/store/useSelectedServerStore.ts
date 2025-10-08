import { create } from "zustand";

interface SelectedServerState {
    selectedServerId?: string;
    setSelectedServerId: (id?: string) => void;
}

export const useSelectedServerStore = create<SelectedServerState>((set) => ({
    selectedServerId: undefined,
    setSelectedServerId: (id) => set({ selectedServerId: id}),
}));