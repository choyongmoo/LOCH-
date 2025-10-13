// Edge Function: delete-user
import { serve } from "https://deno.land/std@0.201.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Supabase 클라이언트 초기화
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  // CORS 헤더
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
  };

  // Preflight 요청 처리
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), { status: 405, headers });
  }

  try {
    const { userId } = await req.json();
    if (!userId) return new Response(JSON.stringify({ error: "userId required" }), { status: 400, headers });

    // 삭제 순서: 메시지, 친구 요청, 서버 멤버, 대화 멤버, 프로필, Auth
    await supabase.from("messages").delete().eq("sender_id", userId);
    await supabase
      .from("friend_requests")
      .delete()
      .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`);
    await supabase.from("server_members").delete().eq("user_id", userId);
    await supabase.from("conversation_members").delete().eq("user_id", userId);
    await supabase.from("profile").delete().eq("id", userId);

    // Supabase Auth에서 유저 삭제
    await supabase.auth.admin.deleteUser(userId);

    return new Response(JSON.stringify({ success: true }), { status: 200, headers });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
  }
});
