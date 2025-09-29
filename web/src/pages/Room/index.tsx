"use client";

import { KeyboardShortcuts } from "@/components/Room/KeyboardShortcuts";
import { RecordingIndicator } from "@/components/Room/RecordingIndicator";
import { SettingsMenu } from "@/components/Room/SettingsMenu";
import { LiveKitRoomProvider } from "@/providers/LiveKitRoomProvider";
import { formatChatMessageLinks } from "@livekit/components-react";
import { useParams } from "react-router";
import { CustomVideoConference } from "./CustomVideoConference";

export function Room() {
  const { roomId } = useParams();

  return (
    <div className="lk-room-container">
      <LiveKitRoomProvider roomId={roomId!}>
        <KeyboardShortcuts />
        <CustomVideoConference
          chatMessageFormatter={formatChatMessageLinks}
          SettingsComponent={SettingsMenu}
        />
        <RecordingIndicator />
      </LiveKitRoomProvider>
    </div>
  );
}
