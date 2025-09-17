import { LiveKitRoom } from "@livekit/components-react";
import { useEffect, useState } from "react";
import { joinLivekitRoom } from "../lib/livekit";

interface LiveKitRoomProviderProps {
  roomId: string;
  children: React.ReactNode;
}

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL;

export function LiveKitRoomProvider({ roomId, children }: LiveKitRoomProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const token = await joinLivekitRoom(roomId, { signal: controller.signal });
        setToken(token);
      } catch (err: unknown) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Failed to join room");
        }
      }
    })();
    return () => controller.abort();
  }, [roomId]);

  if (error) return <div>Error: {error}</div>;
  if (!token) return <div>Joining room...</div>;

  return (
    <LiveKitRoom
      serverUrl={LIVEKIT_URL}
      token={token}
      style={{ height: "100dvh", width: "100%" }}
      data-lk-theme="default"
    >
      {children}
    </LiveKitRoom>
  );
}
