import { create } from "zustand";
import type { Server } from "@/types/workspace";

export type ModalType =
  | "addGroup"
  | "changeName"
  | "editBio"
  | "editColor"
  | "cameraTest"
  | "editCamera"
  | "micTest"
  | "editMic"
  | "editPW"
  | "logout"
  | "deleteUser"
  | "addFriend"
  | "serverModal"
  | "RecentActivityModal"
  | "userProfile"
  | null;

type ModalStore = {
    currentModal: ModalType;
    selectedServer?: Server;
    openModal: (type: ModalType, server?: Server) => void;
    closeModal: () => void;
};

export const useModal = create<ModalStore>((set) => ({
    currentModal: null,
    selectedServer: undefined,
    openModal: (type, server) => set({ currentModal: type, selectedServer: server }),
    closeModal: () => set({ currentModal: null, selectedServer: undefined }),
}));
