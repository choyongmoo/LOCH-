import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Friend } from "@/types/workspace";

export function useRealtimeMessages(
    currentUserId?: string,
    selectedFriend?: Friend | null,
    addMessage?: (msg: any) => void
    ) {
        useEffect(() => {
            if (!selectedFriend || !currentUserId || !addMessage) return;

            const channel = supabase
                .channel("messages_channel")
                .on(
                    "postgres_changes",
                    {
                        event: "INSERT",
                        schema: "public",
                        table: "messages",
                        filter: `or(sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId})`,
                    },
                    (payload: { new: any }) => {
                        const msg = payload.new;
                    if (
                        (msg.sender_id === currentUserId && msg.receiver_id === selectedFriend.id) ||
                        (msg.sender_id === selectedFriend.id && msg.receiver_id === currentUserId)
                    ) {
                        addMessage({
                            sender: msg.sender_id === currentUserId ? "me" : "friend",
                            text: msg.content,
                            timestamp: new Date(msg.created_at).getTime(),
                        });
                    }
                }
            );

            channel.subscribe();

            return () => {
            supabase.removeChannel(channel);
            };
        }, [selectedFriend, currentUserId, addMessage]);
}
