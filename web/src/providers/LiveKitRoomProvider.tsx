import { Button } from "@/components/common/ui/button";
import { LiveKitRoom } from "@livekit/components-react";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { joinLivekitRoom } from "../lib/livekit";

interface LiveKitRoomProviderProps {
  roomId: string;
  children: React.ReactNode;
}

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL;

export function LiveKitRoomProvider({ roomId, children }: LiveKitRoomProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [tookLong, setTookLong] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTookLong(false);
    const slowTimer = setTimeout(() => setTookLong(true), 8000);
    const controller = new AbortController();
    setError(null);
    setToken(null);
    (async () => {
      try {
        const t = await joinLivekitRoom(roomId, { signal: controller.signal });
        setToken(t);
      } catch (err: unknown) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Failed to join room");
        }
      }
    })();
    return () => {
      clearTimeout(slowTimer);
      controller.abort();
    };
  }, [roomId, retryCount]);

  if (error) {
    return (
      <div className="min-h-[100dvh] w-full flex items-center justify-center p-6">
        <div className="w-full max-w-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1F2937] p-5 text-center shadow-sm">
          <div className="text-red-600 dark:text-red-400 font-semibold mb-2">
            회의 참가에 실패했습니다
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300 break-words mb-4">{error}</div>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={() => navigate(-1)}>
              뒤로
            </Button>
            <Button onClick={() => setRetryCount((c) => c + 1)}>재시도</Button>
          </div>
        </div>
      </div>
    );
  }
  if (!token) {
    return (
      <div
        className="min-h-[100dvh] w-full flex items-center justify-center p-6"
        aria-live="polite"
      >
        <div className="w-full max-w-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1F2937] p-6 text-center shadow-sm">
          <div className="flex items-center justify-center mb-3">
            <Loader2 className="h-6 w-6 animate-spin text-gray-700 dark:text-gray-200" />
          </div>
          <div className="font-semibold text-gray-900 dark:text-gray-100">회의 참여 중…</div>
          <div className="text-xs text-gray-600 dark:text-gray-300 mt-2">
            연결을 설정하는 중입니다.{" "}
            {tookLong && "오래 걸리면 재시도하거나 네트워크를 확인해주세요."}
          </div>
          <div className="flex gap-2 justify-center mt-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              취소
            </Button>
            {tookLong && <Button onClick={() => setRetryCount((c) => c + 1)}>재시도</Button>}
          </div>
        </div>
      </div>
    );
  }

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
