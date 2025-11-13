import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Friend, Message } from "@/types/workspace";

export const useChatMessages = (currentUserId?: string, selectedFriend?: Friend | null) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!currentUserId || !selectedFriend) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${currentUserId},receiver_id.eq.${selectedFriend.id}),and(sender_id.eq.${selectedFriend.id},receiver_id.eq.${currentUserId})`
        )
        .order("created_at", { ascending: true });

      if (error) {
        console.error(error);
        return;
      }

      const formatted: Message[] = (data ?? []).map((m: any) => ({
        id: m.id,
        sender: m.sender_id === currentUserId ? "me" : "friend",
        text: m.content,
        timestamp: new Date(m.created_at).getTime(),
        type: m.type ?? "text",
        serverId: m.server_id ?? undefined,
      }));

      setMessages(formatted);
    };

    void loadMessages();
  }, [currentUserId, selectedFriend]);

  const addMessage = (msg: Message) => setMessages((prev) => [...prev, msg]);

  return { messages, addMessage };
};
