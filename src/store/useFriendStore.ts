import { create } from "zustand";
import type { FriendRequest, FriendRequestStatus } from "@/types/workspace";
import { supabase } from "@/lib/supabase";

interface FriendState {
  requests: FriendRequest[];
  setRequests: (requests: FriendRequest[]) => void;
  fetchFriendRequests: (userId: string) => Promise<void>;
  addFriendRequest: (addressee_id: string) => Promise<void>;
  respondFriendRequest: (id: number, status: FriendRequestStatus) => Promise<void>;
  deleteFriendRequest: (id: number) => Promise<void>;
}

export const useFriendStore = create<FriendState>((set, get) => ({
  requests: [],
  setRequests: (requests) => set({ requests }),

  fetchFriendRequests: async (userId: string) => {
    const { data, error } = await supabase
      .from("friend_requests")
      .select("*") as { data: FriendRequest[] | null; error: any };

    if (error) return console.error(error);
    if (data) set({ requests: data.filter(r => r.requester_id === userId || r.addressee_id === userId) });
  },

  addFriendRequest: async (addressee_id: string) => {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData.user?.id;
    if (!userId) return;

    const { data, error } = await supabase
      .from("friend_requests")
      .insert([{ requester_id: userId, addressee_id, status: "pending" }]) as { data: FriendRequest[] | null; error: any };

    if (error) return console.error(error);
    if (data) set({ requests: [...get().requests, ...data] });
  },

  respondFriendRequest: async (id: number, status: FriendRequestStatus) => {
    const { data, error } = await supabase
      .from("friend_requests")
      .update({ status, responded_at: new Date().toISOString() })
      .eq("id", id) as { data: FriendRequest[] | null; error: any };

    if (error) return console.error(error);
    if (data && data.length > 0) {
      const updated = data[0];
      set({
        requests: get().requests.map(req =>
          req.id === id ? { ...req, status, responded_at: updated.responded_at } : req
        ),
      });
    }
  },

  deleteFriendRequest: async (id) => {
    const { error } = await supabase
      .from("friend_requests")
      .delete()
      .eq("id", id);

    if (error) return console.error(error);
    set({ requests: get().requests.filter(req => req.id !== id) });
  },
}));
