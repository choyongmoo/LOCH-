import { create } from "zustand";
import type { FriendRequest, FriendRequestStatus } from "@/types/workspace";
import { supabase } from "@/lib/supabase";

interface FriendState {
  requests: FriendRequest[];
  setRequests: (requests: FriendRequest[]) => void;
  fetchFriendRequests: (userId: string) => Promise<void>;
  addFriendRequest: (addressee_id: string) => Promise<void>;
  respondFriendRequest: (id: string, status: FriendRequestStatus) => Promise<void>;
  deleteFriendRequest: (id: string) => Promise<void>;
}

export const useFriendStore = create<FriendState>((set, get) => ({
  requests: [],
  setRequests: (requests) => set({ requests }),

  fetchFriendRequests: async () => {
  const { data, error } = await supabase
    .from("friend_requests")
    .select(`
      id,
      requester_id,
      addressee_id,
      status,
      created_at,
      requester:requester_id (nickname)
    `) as { data: any[] | null; error: any };

  if (error) return console.error(error);

  if (data) {
    const formatted = data.map(req => ({
      id: req.id,
      requester_id: req.requester_id,
      addressee_id: req.addressee_id,
      status: req.status,
      created_at: req.created_at,
      name: req.requester.nickname,
      requestedAt: new Date(req.created_at).toLocaleString(),
    }));

    set({ requests: formatted });
  }
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

   respondFriendRequest: async (id: string, status: FriendRequestStatus) => {
    const { error } = await supabase
      .from("friend_requests")
      .update({ status, responded_at: new Date().toISOString() })
      .eq("id", id) as { data: FriendRequest[] | null; error: any };

    if (error) return console.error(error);

    set({
      requests: get().requests.map(req =>
        req.id === id ? { ...req, status, responded_at: new Date().toISOString() } : req
      ),
    });
  },

  deleteFriendRequest: async (id) => {
    const { error } = await supabase
      .from("friend_requests")
      .delete()
      .eq("id", id);

    if (error) return console.error(error);
    set({ requests: get().requests.filter(req => req.id !== id) });
  },

  fetchFriends: async (userId: string) => {
  const { data, error } = await supabase
    .from("friend_requests")
    .select(`
      id,
      requester_id,
      addressee_id,
      status,
      requester:requester_id (nickname, email),
      addressee:addressee_id (nickname, email)
    `)
    .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
    .eq("status", "accepted");

  if (error) {
    console.error("친구 목록 불러오기 실패:", error);
    return [];
  }

  const friends = data.map(req => {
    const isRequester = req.requester_id === userId;
    const friendUser = isRequester ? req.addressee[0] : req.requester[0];

    return {
      id: isRequester ? req.addressee_id : req.requester_id,
      nickname: friendUser?.nickname || "알 수 없음",
      email: friendUser?.email || "",
    };
  });

  return friends;
}
}));
