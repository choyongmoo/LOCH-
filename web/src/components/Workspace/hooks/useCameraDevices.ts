import { useState, useEffect } from "react";

export function useCameraDevices() {
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    async function getDevices() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === "videoinput");
        setCameras(videoDevices);
      } catch (err) {
        console.error("카메라 장치 불러오기 실패:", err);
      }
    }

    getDevices();
  }, []);

  return cameras;
}