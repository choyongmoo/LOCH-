import { supabase } from "./supabase";

export const updateLivekitRoom = async (shareCode: string, passcode?: string): Promise<string> => {
  const { data, error } = await supabase.functions.invoke("update-livekit-room", {
    body: { shareCode, passcode },
  });
  if (error) throw error;
  return data?.token ?? "";
};

export const joinLivekitRoom = async (
  shareCode: string,
  passcode?: string,
  options?: { signal?: AbortSignal }
): Promise<string> => {
  const res = await fetch("/functions/v1/join-livekit-room", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ shareCode, passcode }),
    signal: options?.signal,
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error ?? "Failed to join LiveKit room");
  }

  const { token } = await res.json();
  return token;
};
