import { create } from "zustand"

export type ModalType = "addGroup" | "changeName" | "editBio" | "editColor" |
                        "editLanguage" | "micTest" | "editMic" | "editPW" | 
                        "logOut" | "deleteUser" |null;

type modalStore = {
    currentModal: ModalType;
    openModal: (type: ModalType) => void;
    closeModal: () => void;
};

export const useModal = create<modalStore>((set) => ({
    currentModal: null,
    openModal: (type) => set({ currentModal: type }),
    closeModal: () => set({ currentModal: null }),
}));