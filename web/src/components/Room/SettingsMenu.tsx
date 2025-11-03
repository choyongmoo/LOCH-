"use client";
import { MediaDeviceMenu, useMaybeLayoutContext } from "@livekit/components-react";
import * as React from "react";
import { CameraSettings } from "./CameraSettings";
import { MicrophoneSettings } from "./MicrophoneSettings";
import styles from "./styles/SettingsMenu.module.css";

export function SettingsMenu(props: React.HTMLAttributes<HTMLDivElement>) {
  const layoutContext = useMaybeLayoutContext();

  const settings = React.useMemo(() => {
    return {
      media: { camera: true, microphone: true, label: "미디어 장치", speaker: true },
    };
  }, []);

  const tabs = React.useMemo(
    () => Object.keys(settings).filter((t) => t !== undefined) as Array<keyof typeof settings>,
    [settings]
  );
  const [activeTab, setActiveTab] = React.useState(tabs[0]);

  return (
    <div className="settings-menu" style={{ width: "100%", position: "relative" }} {...props}>
      <div className={styles.tabs}>
        {tabs.map(
          (tab) =>
            settings[tab] && (
              <button
                className={`${styles.tab} lk-button`}
                key={tab}
                onClick={() => setActiveTab(tab)}
                aria-pressed={tab === activeTab}
              >
                {settings[tab].label}
              </button>
            )
        )}
      </div>
      <div className="tab-content">
        {activeTab === "media" && (
          <>
            {settings.media && settings.media.camera && (
              <>
                <h3>카메라</h3>
                <section>
                  <CameraSettings />
                </section>
              </>
            )}
            {settings.media && settings.media.microphone && (
              <>
                <h3>마이크</h3>
                <section>
                  <MicrophoneSettings />
                </section>
              </>
            )}
            {settings.media && settings.media.speaker && (
              <>
                <h3>스피커 & 헤드폰</h3>
                <section className="lk-button-group">
                  <span className="lk-button">오디오 출력</span>
                  <div className="lk-button-group-menu">
                    <MediaDeviceMenu kind="audiooutput"></MediaDeviceMenu>
                  </div>
                </section>
              </>
            )}
          </>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
        <button
          className={`lk-button`}
          onClick={() => layoutContext?.widget.dispatch?.({ msg: "toggle_settings" })}
        >
          닫기
        </button>
      </div>
    </div>
  );
}
