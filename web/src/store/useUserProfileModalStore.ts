import { create } from "zustand";
import { useModal } from "./useModalStore";

interface UserProfileModalState {
  selectedUserId: string | null;
  setSelectedUserId: (id: string | null) => void;
  openUserProfile: (id: string) => void;
  closeUserProfile: () => void;
}

export const useUserProfileModal = create<UserProfileModalState>((set) => ({
  selectedUserId: null,
  setSelectedUserId: (id) => set({ selectedUserId: id }),
  openUserProfile: (id) => {
    useModal.getState().openModal("userProfile");
    set({ selectedUserId: id });
  },
  closeUserProfile: () => {
    useModal.getState().closeModal();
    set({ selectedUserId: null });
  },
}));
