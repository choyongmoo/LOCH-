"use client";

import { KeyboardShortcuts } from "@/components/Room/KeyboardShortcuts";
import { RecordingIndicator } from "@/components/Room/RecordingIndicator";
import { SettingsMenu } from "@/components/Room/SettingsMenu";
import { LiveKitRoomProvider } from "@/providers/LiveKitRoomProvider";
import { formatChatMessageLinks, VideoConference } from "@livekit/components-react";
import { useParams } from "react-router";

export function Room() {
  const { roomId } = useParams();

  return (
    <div className="lk-room-container">
      <LiveKitRoomProvider roomId={roomId!}>
        <KeyboardShortcuts />
        <VideoConference
          chatMessageFormatter={formatChatMessageLinks}
          SettingsComponent={SettingsMenu}
        />
        <RecordingIndicator />
      </LiveKitRoomProvider>
    </div>
  );
}
