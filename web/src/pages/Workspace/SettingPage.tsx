import { useEffect, useRef, useState } from "react";

export default function SettingPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const selectedCameraId = localStorage.getItem("selectedCameraId");
        if (!selectedCameraId) return;

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: selectedCameraId } },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error(err);
        setError("카메라를 사용할 수 없습니다.");
      }
    }

    startCamera();

    // 컴포넌트 언마운트 시 스트림 정리
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="h-screen w-full min-w-0 overflow-hidden bg-gray-100 dark:bg-[#18191c] px-4 md:px-5 py-6 flex flex-col items-center justify-center">
      {error && <p className="text-red-500">{error}</p>}
      <video
        ref={videoRef}
        className="w-full max-w-md rounded-xl border border-gray-300 dark:border-gray-600"
        autoPlay
        muted
      />
    </div>
  );
}
