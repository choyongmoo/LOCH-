import { create } from "zustand";
import type { Friend, Message } from "@/types/workspace";

interface ChatState {
    selectedFriend: Friend | null;
    messages: Message[];
    setSelectedFriend: (friend: Friend) => void;
    addMessage: (msg: Message) => void;
    setMessages: (msgs: Message[]) => void;
    clearChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
    selectedFriend: null,
    messages: [],
    setSelectedFriend: (friend) =>
        set({ selectedFriend: friend, messages: []}),
    addMessage: (msg) => set((state) => ({messages: [...state.messages, msg]})),
    setMessages: (msgs) => set({ messages: msgs }),
    clearChat: () => set({ selectedFriend: null, messages: [] }),
}));