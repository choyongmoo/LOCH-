import { serve } from "https://deno.land/std@0.201.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "Method Not Allowed" }), { status: 405, headers });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers });
    }

    const token = authHeader.split(" ")[1];

    // JWT 검증
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers });
    const userId = userData.user.id;

    const { action, serverId, targetUserId, newHostUserId } = await req.json();
    if (!action || !serverId) return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers });

    if (action === "kickMember") {
      if (!targetUserId) return new Response(JSON.stringify({ error: "Missing targetUserId" }), { status: 400, headers });
      await kickMember(serverId, targetUserId, userId);
      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }

    if (action === "transferHost") {
      if (!newHostUserId) return new Response(JSON.stringify({ error: "Missing newHostUserId" }), { status: 400, headers });
      await transferHost(serverId, userId, newHostUserId);
      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400, headers });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
  }
});

async function kickMember(serverId: string, targetUserId: string, currentUserId: string) {
  console.log("🟢 serverId:", serverId);
console.log("🟢 targetUserId:", targetUserId);
  const { data: hostData, error: hostError } = await supabase
    .from("server_members")
    .select("role")
    .eq("server_id", serverId)
    .eq("user_id", currentUserId)
    .maybeSingle();

  if (hostError || !hostData) throw new Error("Host verification failed");
  if (hostData.role !== "host") throw new Error("Only host can kick members");

  const { error } = await supabase
    .from("server_members")
    .delete()
    .eq("server_id", serverId)
    .eq("user_id", targetUserId);

  if (error) {
    console.error("❌ delete error:", error);
    throw error;
  } else {
    console.log("🟢 delete success");
  }
}

async function transferHost(serverId: string, currentUserId: string, newHostUserId: string) {
  const { data: hostData, error: hostError } = await supabase
    .from("server_members")
    .select("role")
    .eq("server_id", serverId)
    .eq("user_id", currentUserId)
    .maybeSingle();

  if (hostError || !hostData) throw new Error("Host verification failed");
  if (hostData.role !== "host") throw new Error("Only current host can transfer host role");

  const { error: demoteError } = await supabase
    .from("server_members")
    .update({ role: "participant" })
    .eq("server_id", serverId)
    .eq("user_id", currentUserId);
  if (demoteError) throw demoteError;

  const { error: promoteError } = await supabase
    .from("server_members")
    .update({ role: "host" })
    .eq("server_id", serverId)
    .eq("user_id", newHostUserId);
  if (promoteError) throw promoteError;

  const { error: serverError } = await supabase
    .from("servers")
    .update({ host: newHostUserId })
    .eq("id", serverId);
  if (serverError) throw serverError;
}
