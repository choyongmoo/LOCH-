import { Button } from "@/components/common/ui/button";
import { supabase } from "@/lib/supabase";
import { useSelectedServerStore } from "@/store/useSelectedServerStore";
import { useUserStore } from "@/store/useUserStore";
import { Loader2, Video } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { getDisplayName, getStorageKey, type RecentPage } from "../utils/recentPage";

const MAX_RECENT = 3;

interface MeetingButtonProps {
  serverId?: string;
  className?: string;
}

interface Room {
  id: string;
  is_active: boolean;
  user_count: number;
}

export const MeetingButton = ({ className }: MeetingButtonProps) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { selectedServerId } = useSelectedServerStore();

  const user = useUserStore((state) => state.user);

  const addRecentPage = (path: string) => {
    const storageKey = getStorageKey(user?.id);
    const stored: RecentPage[] = JSON.parse(localStorage.getItem(storageKey) || "[]");
    const name = getDisplayName(path);
    if (!name) return;

    const newPage: RecentPage = { path, name, ts: Date.now() };
    const updatedPages = [newPage, ...stored.filter((p) => p.path !== path)].slice(0, MAX_RECENT);
    localStorage.setItem(storageKey, JSON.stringify(updatedPages));
  };

  useEffect(() => {
    // If there is no selected server, clear state and stop loading
    if (!selectedServerId) {
      setRoom(null);
      setError(null);
      setLoading(false);
      return;
    }

    const fetchRoom = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("rooms")
        .select("id, is_active, user_count")
        .eq("server_id", selectedServerId)
        .single();

      if (!error) setRoom(data);
      setLoading(false);
      setError(error?.message ?? null);
    };

    fetchRoom();

    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes" as "system",
        {
          event: "*",
          schema: "public",
          table: "rooms",
          filter: `server_id=eq.${selectedServerId}`,
        },
        (payload: { eventType: string; new: Room | null }) => {
          if (payload.eventType === "DELETE") {
            setRoom(null);
          } else if (payload.new) {
            setRoom(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedServerId]);

  const handleButtonClick = () => {
    if (room?.id) {
      navigate(`/room/${room.id}`);
    } else {
      navigate(`/workspace`);
    }
  };

  let meetingAction: ReactNode;
  if (!selectedServerId) {
    meetingAction = (
      <Button disabled variant="outline" size="lg" className={className ?? "w-full text-1xl"}>
        서버를 선택해 주세요
      </Button>
    );
  } else if (loading || (room && room.user_count <= 0 && room.is_active)) {
    meetingAction = (
      <Button disabled variant="outline" size="lg" className={className ?? "w-full"}>
        <Loader2 className="animate-spin" />
        로딩 중...
      </Button>
    );
  } else if (error) {
    meetingAction = (
      <Button disabled variant="outline" size="lg" className={className ?? "w-full"}>
        오류
      </Button>
    );
  } else {
    meetingAction = (
      <Button onClick={handleButtonClick} size="lg" className={className ?? "w-full"}>
        <Video />
        {room && room.is_active ? `회의 참여 (${room.user_count}명)` : "회의 시작"}
      </Button>
    );
  }

  return (
    <div className="w-full">
      {meetingAction}
      <div className="mt-2 flex w-full items-center justify-center">
        <Button
          size="sm"
          variant="outline"
          className="w-full"
          onClick={() => {
            if (selectedServerId) {
              const path = `/workspace/docs`;
              addRecentPage(path);
              navigate(`/workspace/docs`);
            }
          }}
          disabled={!selectedServerId}
        >
          {selectedServerId ? "회의 내역" : "서버를 선택해 주세요"}
        </Button>
      </div>
    </div>
  );
};
