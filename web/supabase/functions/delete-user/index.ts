import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// CORS 헤더
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};
Deno.serve(async (req)=>{
  // 프리플라이트
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders
    });
  }
  try {
    const { userId } = await req.json(); // Auth UUID
    if (!userId) {
      return new Response(JSON.stringify({
        error: "userId is required"
      }), {
        status: 400,
        headers: corsHeaders
      });
    }
    const url = Deno.env.get("PROJECT_URL");
    const serviceKey = Deno.env.get("SERVICE_ROLE_KEY");
    const admin = createClient(url, serviceKey);
    // (선택) Auth 유저 확인
    const { error: getErr } = await admin.auth.admin.getUserById(userId);
    if (getErr) throw getErr;
    // users.user_uuid 기준으로 내 PK(id: bigint) 찾기
    const { data: urow, error: uerr } = await admin.from("users").select("id").eq("user_uuid", userId) // ✅ UUID 매칭
    .maybeSingle();
    if (uerr) throw uerr;
    const userPk = urow?.id ?? null;
    // 연관 데이터 삭제
    if (userPk) {
      // FK CASCADE가 있다면 profile 삭제는 생략 가능. 안전하게 먼저 삭제해도 OK.
      await admin.from("profile").delete().eq("id", userPk);
      await admin.from("users").delete().eq("id", userPk);
    }
    // 마지막으로 Auth 유저 삭제
    const { error: delErr } = await admin.auth.admin.deleteUser(userId);
    if (delErr) throw delErr;
    return new Response(JSON.stringify({
      ok: true
    }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({
      error: String(e?.message ?? e)
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
});
