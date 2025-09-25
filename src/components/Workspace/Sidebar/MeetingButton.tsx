import { Button } from "@/components/common/ui/button";
import { supabase } from "@/lib/supabase";
import { Loader2, Video } from "lucide-react";
import { useEffect, useState } from "react";
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

export const MeetingButton = ({ serverId, className }: MeetingButtonProps) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
  const navigate = useNavigate();

  // 현재 선택된 서버 ID 추적 (MiniSidebar에서 "이동" 시 저장됨)
  useEffect(() => {
    const readSelected = () => {
      try {
        const raw = localStorage.getItem("home:selectedMeeting");
        if (!raw) return setSelectedServerId(null);
        const parsed = JSON.parse(raw) as { meetingId?: string } | null;
        setSelectedServerId(parsed?.meetingId ?? null);
      } catch {
        setSelectedServerId(null);
      }
    };

    readSelected();

    const onShowParticipants = (e: Event) => {
      const detail = (e as CustomEvent).detail as { meetingId?: string } | undefined;
      setSelectedServerId(detail?.meetingId ?? null);
    };
    window.addEventListener("show-participants", onShowParticipants as EventListener);

    const onStorage = (e: StorageEvent) => {
      if (e.key === "home:selectedMeeting") readSelected();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("show-participants", onShowParticipants as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const effectiveServerId = serverId ?? selectedServerId ?? null;

  useEffect(() => {
    let active = true;
    const fetchRoom = async () => {
      setLoading(true);
      setError(null);
      setRoom(null);
      if (!effectiveServerId) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("rooms")
        .select("id, is_active, user_count")
        .eq("server_id", effectiveServerId)
        .maybeSingle();

      if (!active) return;
      if (!error) setRoom(data);
      setLoading(false);
      setError(error?.message ?? null);
    };

    void fetchRoom();

    if (!effectiveServerId) return;

    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes" as "system",
        {
          event: "*",
          schema: "public",
          table: "rooms",
          filter: `server_id=eq.${effectiveServerId}`,
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
      active = false;
      supabase.removeChannel(channel);
    };
  }, [effectiveServerId]);

  const handleButtonClick = async () => {
    // 선택된 서버가 없으면 홈 유지
    if (!effectiveServerId) {
      return;
    }
    if (room?.id) {
      navigate(`/room/${room.id}`);
      return;
    }
    // 방이 없으면 즉시 생성 후 이동
    try {
      const { data, error } = await supabase
        .from("rooms")
        .insert({ server_id: effectiveServerId, is_active: true, user_count: 0 })
        .select("id")
        .single();
      if (error) throw error;
      if (data?.id) navigate(`/room/${data.id}`);
    } catch (e) {
      setError((e as Error)?.message ?? "Failed to start meeting");
    }
  };

  if (loading)
    return (
      <Button disabled variant="outline" size="lg" className={className ?? "w-full"}>
        <Loader2 className="animate-spin" />
        Loading...
      </Button>
    );
  if (error)
    return (
      <Button disabled variant="outline" size="lg" className={className ?? "w-full"}>
        Unavailable
      </Button>
    );

  return (
    <Button
      onClick={handleButtonClick}
      size="lg"
      className={className ?? "w-full"}
      title={room && room.is_active ? "Join active meeting" : "Start a new meeting"}
    >
      <Video />
      {room && room.is_active ? `Join Meeting (${room.user_count})` : "Start Meeting"}
    </Button>
  );
};
