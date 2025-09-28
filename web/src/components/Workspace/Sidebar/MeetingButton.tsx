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
  const [selectedServerId, setSelectedServerId] = useState<string | null>(serverId ?? null);
  const navigate = useNavigate();

  // Keep internal selectedServerId in sync with prop, if provided
  useEffect(() => {
    if (serverId) {
      setSelectedServerId(serverId);
    }
  }, [serverId]);

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
