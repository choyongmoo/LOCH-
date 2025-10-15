import { SignJWT } from "https://deno.land/x/jose@v4.14.4/index.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};
// Utility to build a LiveKit JWT using HS256
async function createLiveKitToken(params) {
  const { apiKey, apiSecret, identity, name, roomName, ttlSeconds = 60 * 60 } = params;
  const now = Math.floor(Date.now() / 1000);
  const exp = now + ttlSeconds;
  const claims = {
    iss: apiKey,
    sub: identity,
    name,
    nbf: now,
    exp,
    jti: crypto.randomUUID(),
    // LiveKit video access grants
    video: {
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
      roomCreate: false
    }
  };
  const encoder = new TextEncoder();
  const secretKey = encoder.encode(apiSecret);
  const jwt = await new SignJWT({
    ...claims
  }).setProtectedHeader({
    alg: "HS256",
    typ: "JWT"
  }).setIssuedAt(now).setExpirationTime(exp).sign(secretKey);
  return jwt;
}
Deno.serve(async (req)=>{
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders
    });
  }
  try {
    const LIVEKIT_API_KEY = Deno.env.get("LIVEKIT_API_KEY");
    const LIVEKIT_API_SECRET = Deno.env.get("LIVEKIT_API_SECRET");
    const LIVEKIT_URL = Deno.env.get("LIVEKIT_URL");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? Deno.env.get("PROJECT_URL");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
    if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET || !LIVEKIT_URL) {
      return new Response(JSON.stringify({
        error: "LiveKit env not configured"
      }), {
        status: 500,
        headers: corsHeaders
      });
    }
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({
        error: "Missing Authorization header"
      }), {
        status: 401,
        headers: corsHeaders
      });
    }
    const body = await req.json().catch(()=>({}));
    const roomName = body.roomName || body.room;
    if (!roomName) {
      return new Response(JSON.stringify({
        error: "roomName is required"
      }), {
        status: 400,
        headers: corsHeaders
      });
    }
    // Verify user via Supabase Auth, using the incoming Authorization header
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return new Response(JSON.stringify({
        error: "Supabase env not configured"
      }), {
        status: 500,
        headers: corsHeaders
      });
    }
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: authHeader
        }
      }
    });
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData?.user) {
      return new Response(JSON.stringify({
        error: "Unauthorized"
      }), {
        status: 401,
        headers: corsHeaders
      });
    }
    const identity = body.identity || authData.user.id;
    const displayName = body.name || authData.user.user_metadata?.name || authData.user.email || identity;
    const token = await createLiveKitToken({
      apiKey: LIVEKIT_API_KEY,
      apiSecret: LIVEKIT_API_SECRET,
      identity,
      name: displayName,
      roomName
    });
    return new Response(JSON.stringify({
      token,
      url: LIVEKIT_URL,
      identity,
      name: displayName
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
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
