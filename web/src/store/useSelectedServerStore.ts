import { create } from "zustand";

interface SelectedServerState {
    selectedServerId?: string | null;
    setSelectedServerId: (id?: string | null) => void;
    resetSelectedServer: () => void;
}

export const useSelectedServerStore = create<SelectedServerState>((set) => ({
    selectedServerId: typeof window !== "undefined" ? localStorage.getItem("selectedServerId") : null,
    setSelectedServerId: (id) => {
        if (id) localStorage.setItem("selectedServerId", id);
        else localStorage.removeItem("selectedServerId");
        set({ selectedServerId: id });
    },
    resetSelectedServer: () => {
        localStorage.removeItem("selectedServerId");
        set({ selectedServerId: null });
    },
}));
