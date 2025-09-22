import { VideoConference } from "@livekit/components-react";
import { useParams } from "react-router";
import { LiveKitRoomProvider } from "../../providers/LiveKitRoomProvider";

export default function Room() {
  const { roomId } = useParams();

  if (!roomId) {
    return <div>Room not found</div>;
  }

  return (
    <div className="h-[100dvh] w-full">
      <LiveKitRoomProvider roomId={roomId}>
        <VideoConference className="h-full w-full" />
      </LiveKitRoomProvider>
    </div>
  );
}
