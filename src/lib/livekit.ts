import { supabase } from "@/lib/supabase";

const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export const joinLivekitRoom = async (
  roomId: string,
  options?: { signal?: AbortSignal }
): Promise<string> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const res = await fetch(`${VITE_SUPABASE_URL}/functions/v1/join-livekit-room`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token ?? ""}`,
    },
    body: JSON.stringify({ roomId }),
    signal: options?.signal,
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error ?? "Failed to join LiveKit room");
  }

  const { token } = await res.json();
  return token;
};
