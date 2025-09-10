import { AccessToken } from "https://esm.sh/livekit-server-sdk";
import { corsHeaders } from "../_shared/config.ts";
import { buildError, buildResponse, getUserClient, hashPasscode } from "../_shared/utils.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }
  if (req.method !== "POST") {
    return buildError("Method Not Allowed", 405);
  }
  try {
    const supabase = getUserClient(req);

    // --- Verify user ---
    const { data: userRes, error: userErr } = await supabase.auth.getUser();
    const user = userRes?.user;
    if (userErr || !user) return buildError("Unauthorized", 401);

    // --- Parse body ---
    const { shareCode, passcode } = await req.json().catch(() => ({}));

    // --- Find room by shareCode ---
    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .select("id, owner_id, share_code, passcode_hash, is_active")
      .eq("owner_id", user.id)
      .single();
    if (roomError) {
      return buildError("Database error fetching room", 500);
    }
    if (!room) {
      return buildError("Room not found", 404);
    }
    // already exists as poilcy -> nessesary?
    const isOwner = user.id === room.owner_id;
    if (!room.is_active) {
      if (!isOwner) {
        return buildError("Unauthorized", 401);
      }
    }
    // --- Passcode check (if room has one) ---
    const passcodeHash = passcode ? hashPasscode(passcode) : null;

    if (room.share_code !== shareCode || room.passcode_hash !== passcodeHash) {
      return generateToken();
    }

    // update room values

    // --- LiveKit credentials ---
    const LK_API_KEY = Deno.env.get("LIVEKIT_API_KEY") ?? "";
    const LK_API_SECRET = Deno.env.get("LIVEKIT_API_SECRET") ?? "";
    if (!LK_API_KEY || !LK_API_SECRET) {
      return buildError("Server misconfigured (LiveKit env vars missing)", 500);
    }
    // --- Mint LiveKit token ---
    const at = new AccessToken(LK_API_KEY, LK_API_SECRET, {
      identity: user.id,
      name: user.email ?? user.id,
    });
    at.addGrant({
      roomJoin: true,
      room: room.id,
      canPublish: true,
      canSubscribe: true,
    });
    const token = await at.toJwt();
    return buildResponse(
      {
        token,
        roomId: room.id,
        inviteCode: room.share_code,
      },
      200
    );
  } catch (err) {
    return buildError(err instanceof Error ? err.message : "Internal server error", 500);
  }
});
