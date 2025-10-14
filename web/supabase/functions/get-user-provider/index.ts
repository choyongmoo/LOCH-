// Edge Function: get-user-provider
import { serve } from "https://deno.land/std@0.201.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

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

    // auth.users에서 provider 조회
    const { data, error } = await supabase
      .from("auth.users")
      .select("id, raw_app_meta_data, providers")
      .eq("id", userId)
      .maybeSingle();

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });

    let providers: string[] = [];
    if (Array.isArray(data?.raw_app_meta_data?.providers)) {
      providers = data.raw_app_meta_data.providers;
    } else if (typeof data?.raw_app_meta_data?.providers === "string") {
      providers = [data.raw_app_meta_data.providers];
    } else if (Array.isArray(data?.providers)) {
      providers = data.providers;
    }

    return new Response(JSON.stringify({ userId, providers }), { status: 200, headers });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
  }
});
