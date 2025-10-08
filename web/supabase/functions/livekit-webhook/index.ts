import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { RoomServiceClient, WebhookReceiver } from "https://esm.sh/livekit-server-sdk";
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);
const receiver = new WebhookReceiver(
  Deno.env.get("LIVEKIT_API_KEY") ?? "",
  Deno.env.get("LIVEKIT_API_SECRET") ?? ""
);
Deno.serve(async (req) => {
  try {
    const body = await req.text();
    const authHeader = req.headers.get("Authorization") ?? "";
    const event = await receiver.receive(body, authHeader);
    const roomId = event.room?.name;
    if (!roomId) {
      return new Response("no room id", {
        status: 400,
      });
    }
    switch (event.event) {
      case "room_started":
        await supabase
          .from("rooms")
          .update({
            is_active: true,
          })
          .eq("id", roomId);
        break;
      case "room_finished":
        await supabase
          .from("rooms")
          .update({
            is_active: false,
            user_count: 0,
          })
          .eq("id", roomId);
        break;
      case "participant_joined": {
        const participant = event.participant?.identity ?? "";
        if (participant.startsWith("agent-")) {
          break;
        }
        await supabase.rpc("increment_user_count", {
          room_id: roomId,
        });
        break;
      }
      case "participant_left": {
        const participant = event.participant?.identity ?? "";
        if (participant.startsWith("agent-")) {
          break;
        }
        await supabase.rpc("decrement_user_count", {
          room_id: roomId,
        });
        const { data: roomRow } = await supabase
          .from("rooms")
          .select("id, is_active, user_count")
          .eq("id", roomId)
          .single();
        if (roomRow && roomRow.is_active === true && (roomRow.user_count ?? 0) === 0) {
          try {
            const svc = new RoomServiceClient(
              Deno.env.get("LIVEKIT_URL") ?? "",
              Deno.env.get("LIVEKIT_API_KEY") ?? "",
              Deno.env.get("LIVEKIT_API_SECRET") ?? ""
            );
            await svc.deleteRoom(roomId);
          } catch {}
        }
        break;
      }
    }
    return new Response("ok", {
      status: 200,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
});
