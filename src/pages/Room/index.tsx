import { VideoConference } from "@livekit/components-react";
import { useParams, useSearchParams } from "react-router";
import { LiveKitRoomProvider } from "../../contexts/LiveKitRoomProvider";

export default function Room() {
  const { shareCode } = useParams();

  const [searchParams] = useSearchParams();
  const passcode = searchParams.get("passcode") || "";

  if (!shareCode) {
    return <div>Room not found</div>;
  }

  return (
    <LiveKitRoomProvider shareCode={shareCode} passcode={passcode}>
      <VideoConference />
    </LiveKitRoomProvider>
  );
}
