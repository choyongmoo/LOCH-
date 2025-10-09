import { supabase } from "@/lib/supabase";
import type { Friend, Message } from "@/types/workspace";

export async function sendMessage(
  input: string,
  currentUserId: string,
  selectedFriend: Friend,
  addMessage: (msg: Message) => void,
  serverId?: string,
  type: "text" | "server_invite" = "text"
) {
  if (!input.trim()) return;

  try {
    // 1️⃣ conversation 조회 (있으면 가져오기)
    let { data: conv } = await supabase
      .from("conversations")
      .select("*")
      .or(`user1_id.eq.${currentUserId},user2_id.eq.${currentUserId}`)
      .eq("is_dm", true)
      .maybeSingle();

    // 2️⃣ conversation 없으면 새로 생성
    if (!conv) {
      const { data: newConv, error: insertConvError } = await supabase
        .from("conversations")
        .insert({ is_dm: true, user1_id: currentUserId, user2_id: selectedFriend.id })
        .select()
        .single();

      if (insertConvError || !newConv) {
        console.error("conversation 생성 실패:", insertConvError);
        return;
      }
      conv = newConv;
    }

    // 3️⃣ 메시지 삽입
    const { data: msgData, error: msgError } = await supabase
      .from("messages")
      .insert({
        conversation_id: conv.id,
        sender_id: currentUserId,
        receiver_id: selectedFriend.id,
        content: input,
        type,
        server_id: serverId ?? null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (msgError || !msgData) {
      console.error("메시지 전송 실패:", msgError);
      return;
    }

    // 4️⃣ 로컬 상태에 추가
    addMessage({
      id: msgData.id,
      sender: "me",
      text: input,
      timestamp: new Date(msgData.created_at).getTime(),
      type: msgData.type,
      serverId: msgData.server_id ?? undefined,
    });
  } catch (err) {
    console.error(err);
  }
}
