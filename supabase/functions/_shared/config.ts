import { VideoGrant } from "https://esm.sh/livekit-server-sdk@2.13.3/dist/index.js";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

export function buildAdminGrant(roomId: string): VideoGrant {
  return {
    roomJoin: true,
    room: roomId,
    canPublish: true,
    canSubscribe: true,
  };
}

export function buildGuestGrant(roomId: string): VideoGrant {
  return {
    roomJoin: true,
    room: roomId,
    canPublish: true,
    canSubscribe: true,
  };
}
