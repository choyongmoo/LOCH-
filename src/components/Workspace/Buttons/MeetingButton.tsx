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

export const MeetingButton = ({
  serverId = "0c2e3788-8080-4a1f-af51-4d30b4835a9d",
  className,
}: MeetingButtonProps) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("rooms")
        .select("id, is_active, user_count")
        .eq("server_id", serverId)
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
          filter: `server_id=eq.${serverId}`,
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
  }, [serverId]);

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