import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Friend, Message } from "@/types/workspace";

export const useRealtimeMessages = (
  currentUserId?: string,
  selectedFriend?: Friend | null,
  addMessage?: (msg: Message) => void
) => {
  useEffect(() => {
    if (!currentUserId || !selectedFriend || !addMessage) return;

    const channel = supabase
      .channel(`chat_${currentUserId}_${selectedFriend.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${currentUserId}`,
        },
        (payload: any) => {
          console.log("Realtime payload:", payload.new);
          const newMsg: Message = {
            id: payload.new.id,
            sender: "friend",
            text: payload.new.content,
            timestamp: new Date(payload.new.created_at).getTime(),
            type: payload.new.type ?? "text",
            serverId: payload.new.server_id ?? undefined,
          };
          addMessage(newMsg);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, selectedFriend, addMessage]);
};
