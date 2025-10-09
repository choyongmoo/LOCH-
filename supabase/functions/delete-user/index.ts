import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { userId } = await req.json() as { userId?: string };
    if (!userId) {
      return new Response(JSON.stringify({ error: "userId is required" }), { status: 400, headers: corsHeaders });
    }

    const url = Deno.env.get("PROJECT_URL")!;
    const serviceKey = Deno.env.get("SERVICE_ROLE_KEY")!;
    const admin = createClient(url, serviceKey);

    // Auth 유저 확인
    const { error: getErr } = await admin.auth.admin.getUserById(userId);
    if (getErr) throw getErr;

    // 연관 데이터 삭제
    await admin.from("friend_requests").delete().or(`requester_id.eq.${userId},addressee_id.eq.${userId}`);
    await admin.from("servers").delete().eq("host", userId);
    await admin.from("profile").delete().eq("id", userId);

    // Auth 삭제
    const { error: delErr } = await admin.auth.admin.deleteUser(userId);
    if (delErr) throw delErr;

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: corsHeaders });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(msg);
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers: corsHeaders });
  }
});
