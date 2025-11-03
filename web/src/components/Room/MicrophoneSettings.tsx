import { MediaDeviceMenu, TrackToggle, useLocalParticipant } from "@livekit/components-react";
import type { LocalAudioTrack } from "livekit-client";
import { Track } from "livekit-client";
import * as React from "react";

export function MicrophoneSettings() {
  const { microphoneTrack } = useLocalParticipant();

  const [volume, setVolume] = React.useState<number>(100);
  const [isSoftMuted, setIsSoftMuted] = React.useState<boolean>(false);
  const prevVolumeRef = React.useRef<number>(100);
  const audioCtxRef = React.useRef<AudioContext | null>(null);
  const sourceRef = React.useRef<MediaStreamAudioSourceNode | null>(null);
  const gainRef = React.useRef<GainNode | null>(null);
  const destRef = React.useRef<MediaStreamAudioDestinationNode | null>(null);
  const originalTrackRef = React.useRef<MediaStreamTrack | null>(null);
  const replacedRef = React.useRef<boolean>(false);

  // Build processing pipeline once when mic track becomes available
  React.useEffect(() => {
    const pub = microphoneTrack;
    const lkTrack = (pub?.track ?? null) as LocalAudioTrack | null;
    if (!lkTrack) {
      return;
    }

    // Avoid rebuilding if already built for current track id
    const currentUnderlyingTrack = lkTrack.mediaStreamTrack;
    if (replacedRef.current && originalTrackRef.current === currentUnderlyingTrack) {
      return;
    }

    // Cleanup any previous nodes/context (without restoring previous track)
    try {
      gainRef.current?.disconnect();
    } catch (_err) {
      void _err; /* ignore */
    }
    try {
      sourceRef.current?.disconnect();
    } catch (_err) {
      void _err; /* ignore */
    }
    try {
      destRef.current?.disconnect();
    } catch (_err) {
      void _err; /* ignore */
    }
    try {
      audioCtxRef.current?.close();
    } catch (_err) {
      void _err; /* ignore */
    }
    audioCtxRef.current = null;
    sourceRef.current = null;
    gainRef.current = null;
    destRef.current = null;
    replacedRef.current = false;

    const AC =
      (
        window as unknown as {
          AudioContext?: typeof AudioContext;
          webkitAudioContext?: typeof AudioContext;
        }
      ).AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) {
      return;
    }

    const setup = async () => {
      const ctx = new AC();
      try {
        if (ctx.state === "suspended") {
          await ctx.resume();
        }
      } catch (_err) {
        void _err; /* ignore */
      }
      const source = ctx.createMediaStreamSource(new MediaStream([currentUnderlyingTrack]));
      const gain = ctx.createGain();
      const dest = ctx.createMediaStreamDestination();

      // set initial volume (0..2)
      const linear = Math.max(0, Math.min(200, volume)) / 100; // 0..2
      gain.gain.value = linear;

      source.connect(gain);
      gain.connect(dest);

      audioCtxRef.current = ctx;
      sourceRef.current = source;
      gainRef.current = gain;
      destRef.current = dest;

      // Store original and replace
      originalTrackRef.current = currentUnderlyingTrack;
      const processed = dest.stream.getAudioTracks()[0];
      try {
        await lkTrack.replaceTrack(processed);
        replacedRef.current = true;
      } catch (_err) {
        void _err;
        // If replace fails, tear down created context
        try {
          gain.disconnect();
        } catch (_e) {
          void _e; /* ignore */
        }
        try {
          source.disconnect();
        } catch (_e) {
          void _e; /* ignore */
        }
        try {
          dest.disconnect();
        } catch (_e) {
          void _e; /* ignore */
        }
        try {
          ctx.close();
        } catch (_e) {
          void _e; /* ignore */
        }
        audioCtxRef.current = null;
        sourceRef.current = null;
        gainRef.current = null;
        destRef.current = null;
        originalTrackRef.current = null;
        replacedRef.current = false;
      }
    };

    setup();

    // On unmount or when microphone publication/track identity changes, do not auto-restore here
    // Restoration is handled in the top-level cleanup below to avoid mismatching tracks.
    return () => {
      // Tear down nodes/context only
      try {
        gainRef.current?.disconnect();
      } catch (_err) {
        void _err; /* ignore */
      }
      try {
        sourceRef.current?.disconnect();
      } catch (_err) {
        void _err; /* ignore */
      }
      try {
        destRef.current?.disconnect();
      } catch (_err) {
        void _err; /* ignore */
      }
      try {
        audioCtxRef.current?.close();
      } catch (_err) {
        void _err; /* ignore */
      }
      audioCtxRef.current = null;
      sourceRef.current = null;
      gainRef.current = null;
      destRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [microphoneTrack?.track]);

  // Update gain when volume changes
  React.useEffect(() => {
    if (gainRef.current) {
      const linear = Math.max(0, Math.min(200, volume)) / 100; // 0..2
      gainRef.current.gain.value = linear;
    }
    setIsSoftMuted(volume === 0);
  }, [volume]);

  // On final unmount, restore original track if we replaced it
  React.useEffect(() => {
    return () => {
      const pub = microphoneTrack;
      const lkTrack = (pub?.track ?? null) as LocalAudioTrack | null;
      if (lkTrack && replacedRef.current && originalTrackRef.current) {
        try {
          lkTrack.replaceTrack(originalTrackRef.current);
        } catch (_err) {
          void _err; /* ignore */
        }
      }
      try {
        gainRef.current?.disconnect();
      } catch (_err) {
        void _err; /* ignore */
      }
      try {
        sourceRef.current?.disconnect();
      } catch (_err) {
        void _err; /* ignore */
      }
      try {
        destRef.current?.disconnect();
      } catch (_err) {
        void _err; /* ignore */
      }
      try {
        audioCtxRef.current?.close();
      } catch (_err) {
        void _err; /* ignore */
      }
      audioCtxRef.current = null;
      sourceRef.current = null;
      gainRef.current = null;
      destRef.current = null;
      originalTrackRef.current = null;
      replacedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleSoftMute = React.useCallback(() => {
    if (isSoftMuted) {
      const restore = prevVolumeRef.current > 0 ? prevVolumeRef.current : 100;
      setVolume(restore);
    } else {
      prevVolumeRef.current = volume <= 0 ? 100 : volume;
      setVolume(0);
    }
  }, [isSoftMuted, volume]);

  const SpeakerIcon = ({ muted }: { muted: boolean }) => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M3 10v4h4l5 4V6L7 10H3z" fill="currentColor" />
      {!muted && (
        <path
          d="M16 7a5 5 0 010 10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {!muted && (
        <path
          d="M18.5 4.5a8.5 8.5 0 010 15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {muted && <path d="M20 4L4 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
    </svg>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "10px",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <section className="lk-button-group">
        <TrackToggle source={Track.Source.Microphone}>마이크</TrackToggle>
        <div className="lk-button-group-menu">
          <MediaDeviceMenu
            kind="audioinput"
            onActiveDeviceChange={(_kind, deviceId) =>
              localStorage.setItem("selectedMic", deviceId ?? "default")
            }
          />
        </div>
      </section>

      {/* Volume slider with speaker icon/mute toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 1000 }}>
        <button
          type="button"
          onClick={toggleSoftMute}
          aria-label={isSoftMuted ? "음소거 해제" : "음소거"}
          title={isSoftMuted ? "음소거 해제" : "음소거"}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 24,
            height: 24,
            border: "none",
            background: "transparent",
            color: isSoftMuted ? "#f87171" : "#DCDDDE",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <SpeakerIcon muted={isSoftMuted} />
        </button>
        <input
          type="range"
          min={0}
          max={200}
          step={1}
          value={volume}
          onChange={(e) => setVolume(Number(e.currentTarget.value))}
          style={{ width: 320 }}
        />
      </div>
    </div>
  );
}
