import { AccessToken } from "https://esm.sh/livekit-server-sdk";
import { corsHeaders } from "../_shared/config.ts";
import {
  buildError,
  buildResponse,
  getSupabaseClient,
  hashPasscode,
  timingSafeEq,
} from "../_shared/utils.ts";

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
    const supabase = getSupabaseClient(req);

    // --- Verify user ---
    const { data: userRes, error: userErr } = await supabase.auth.getUser();
    const user = userRes?.user;
    if (userErr || !user) return buildError("Unauthorized", 401);

    // --- Parse body ---
    const { shareCode, passcode } = await req.json().catch(() => ({}));
    if (!shareCode) return buildError("Missing shareCode", 400);

    // --- Find room by shareCode ---
    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .select("id, share_code, passcode_hash, is_active, owner_id")
      .eq("share_code", shareCode)
      .maybeSingle();
    if (roomError) {
      return buildError("Database error fetching room", 500);
    }
    if (!room) {
      return buildError("Room not found", 404);
    }
    const isOwner = user.id === room.owner_id;
    if (!room.is_active) {
      if (isOwner) {
        return generateToken();
      } else {
        return buildError("Room is not active", 403);
      }
    }

    // --- Passcode check (if room has one) ---
    if (room.passcode_hash) {
      if (!passcode) return buildError("Passcode required", 403);
      const passcodeHash = hashPasscode(passcode);
      if (timingSafeEq(await passcodeHash, room.passcode_hash)) {
        return buildError("Invalid passcode", 403);
      }
    }

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
