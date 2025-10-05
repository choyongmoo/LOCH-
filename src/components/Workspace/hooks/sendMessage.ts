import { supabase } from "@/lib/supabase";
import type { Friend } from "@/types/workspace";

export async function sendMessage(
    input: string,
    currentUserId: string,
    selectedFriend: Friend,
    addMessage: (msg: any) => void
    ) {
    if (!input.trim()) return;

    try {
        const { data: conv, error: convError } = await supabase
            .from("conversations")
            .insert({ is_dm: true, user1_id: currentUserId, user2_id: selectedFriend.id })
            .select()
            .single();

        if (convError) return console.error("conversation 생성 실패:", convError);

        const { data, error } = await supabase
            .from("messages")
            .insert({
                conversation_id: conv.id,
                sender_id: currentUserId,
                receiver_id: selectedFriend.id,
                content: input,
                created_at: new Date().toISOString(),
        })
            .select()
            .single();

        if (!error && data) {
            addMessage({ sender: "me", text: input, timestamp: new Date(data.created_at).getTime() });
        }
    } catch (err) {
        console.error(err);
    }
}
