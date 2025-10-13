import { Button } from "@/components/common/ui/button";
import { supabase } from "@/lib/supabase";
import { useSelectedServerStore } from "@/store/useSelectedServerStore";
import { Loader2, Video } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";

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

  const { selectedServerId, setSelectedServerId } = useSelectedServerStore();

  // Initialize from localStorage and respond to MiniSidebar selections via 'show-participants'
  useEffect(() => {
    try {
      const raw = localStorage.getItem("home:selectedMeeting");
      if (raw) {
        const parsed = JSON.parse(raw) as { meetingId?: string } | null;
        setSelectedServerId(parsed?.meetingId ?? null);
      } else {
        setSelectedServerId(null);
      }
    } catch {
      setSelectedServerId(null);
    }

    const handleShowParticipants = (e: Event) => {
      try {
        const ce = e as CustomEvent<{ meetingId?: string }>;
        const id = ce.detail?.meetingId ?? "";
        setSelectedServerId(id || null);
      } catch {
        /* ignore */
      }
    };

    window.addEventListener("show-participants", handleShowParticipants as EventListener);
    return () =>
      window.removeEventListener("show-participants", handleShowParticipants as EventListener);
  }, []);

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

  const hasSelection = !!selectedServerId;

  let meetingAction: ReactNode;
  if (!hasSelection) {
    meetingAction = (
      <Button disabled variant="outline" size="lg" className={className ?? "w-full text-1xl"}>
        서버를 선택해 주세요
      </Button>
    );
  } else if (loading) {
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
            if (hasSelection) {
              navigate("/workspace/docs");
            }
          }}
          disabled={!hasSelection}
        >
          {hasSelection ? "회의 내역" : "서버를 선택해 주세요"}
        </Button>
      </div>
    </div>
  );
};