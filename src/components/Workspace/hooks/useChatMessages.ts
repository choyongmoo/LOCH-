import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useChatStore } from "@/store/useChatStore";
import type { Friend } from "@/types/workspace";

export function useChatMessages(currentUserId?: string, selectedFriend?: Friend | null) {
    const { messages, addMessage, setMessages } = useChatStore();

    useEffect(() => {
        if (!selectedFriend || !currentUserId) return;

        const fetchMessages = async () => {
        const { data, error } = await supabase
            .from("messages")
            .select("*")
            .or(
                `and(sender_id.eq.${currentUserId},receiver_id.eq.${selectedFriend.id}),and(sender_id.eq.${selectedFriend.id},receiver_id.eq.${currentUserId})`
            )
            .order("created_at", { ascending: true });

        if (error) return console.error(error);

        setMessages(
            (data || []).map((msg) => ({
                sender: msg.sender_id === currentUserId ? "me" : "friend",
                text: msg.content,
                timestamp: new Date(msg.created_at).getTime(),
            }))
        );
        };

        fetchMessages();
    }, [selectedFriend, currentUserId, setMessages]);

    return { messages, addMessage };
}
