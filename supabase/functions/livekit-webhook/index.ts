import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { WebhookReceiver } from "https://esm.sh/livekit-server-sdk";
const supabase = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "" // use service_role
);
const receiver = new WebhookReceiver(Deno.env.get("LIVEKIT_API_KEY") ?? "", Deno.env.get("LIVEKIT_API_SECRET") ?? "");
Deno.serve(async (req)=>{
  try {
    const body = await req.text(); // raw body
    const authHeader = req.headers.get("Authorization") ?? "";
    const event = await receiver.receive(body, authHeader);
    const roomId = event.room?.name; // we use `rooms.id` as LiveKit room name
    if (!roomId) {
      return new Response("no room id", {
        status: 400
      });
    }
    switch(event.event){
      case "room_started":
        await supabase.from("rooms").update({
          is_active: true
        }).eq("id", roomId);
        break;
      case "room_finished":
        await supabase.from("rooms").update({
          is_active: false
        }).eq("id", roomId);
        break;
    }
    return new Response("ok", {
      status: 200
    });
  } catch (err) {
    return new Response(JSON.stringify({
      error: err.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
});
