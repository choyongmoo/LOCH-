import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { AccessToken } from "https://esm.sh/livekit-server-sdk";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
};
serve(async (req)=>{
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders
    });
  }
  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_ANON_KEY"), {
      global: {
        headers: {
          Authorization: req.headers.get("Authorization")
        }
      }
    });
    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr || !user) {
      return new Response(JSON.stringify({
        error: "Unauthorized"
      }), {
        status: 401,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }
    const { roomId } = await req.json();
    if (!roomId) {
      return new Response(JSON.stringify({
        error: "Missing roomId"
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }
    const { data: room, error: roomErr } = await supabase.from("rooms").select("id, server_id").eq("id", roomId).single();
    if (roomErr || !room) {
      return new Response(JSON.stringify({
        error: "Room not found"
      }), {
        status: 404,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }
    const { count, error: memberErr } = await supabase.from("server_members").select("*", {
      count: "exact",
      head: true
    }).eq("server_id", room.server_id).eq("user_id", user.id);
    if (memberErr || count === 0) {
      return new Response(JSON.stringify({
        error: "Not a server member",
        details: memberErr
      }), {
        status: 403,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }
    const { data: profile, error: profileErr } = await supabase.from("profile").select("id, nickname").eq("id", user.id).single();
    if (profileErr || !profile.nickname) {
      return new Response(JSON.stringify({
        error: "Profile not found"
      }), {
        status: 404,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }
    const at = new AccessToken(Deno.env.get("LIVEKIT_API_KEY"), Deno.env.get("LIVEKIT_API_SECRET"), {
      identity: user.id,
      name: profile.nickname
    });
    at.addGrant({
      roomJoin: true,
      room: roomId
    });
    const token = await at.toJwt();
    return new Response(JSON.stringify({
      token
    }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({
      error: err.message
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }
});
