import { useEffect, useRef, useState } from "react";

export default function SettingPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraName, setCameraName] = useState("장치를 불러오는 중...");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraOn, setCameraOn] = useState(false);

  // 페이지 진입 시 카메라 이름만 불러오기
  useEffect(() => {
    async function loadCameraName() {
      try {
        const selectedCameraId = localStorage.getItem("selectedCameraId");
        if (!selectedCameraId) {
          setCameraName("선택된 카메라 없음");
          return;
        }
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cam = devices.find(
          (d) => d.kind === "videoinput" && d.deviceId === selectedCameraId
        );
        setCameraName(cam?.label || "알 수 없는 카메라");
      } catch (err) {
        console.error(err);
        setError("카메라 정보를 불러올 수 없습니다.");
      }
    }
    loadCameraName();
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      if (stream) videoRef.current.play();
    }
  }, [stream]);

  // 카메라 토글
  const toggleCamera = async () => {
    if (cameraOn) {
      stream?.getTracks().forEach((track) => track.stop());
      setStream(null);
      setCameraOn(false);
    } else {
      try {
        const selectedCameraId = localStorage.getItem("selectedCameraId");
        if (!selectedCameraId) {
          setError("선택된 카메라가 없습니다.");
          return;
        }
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: selectedCameraId } },
          audio: false,
        });
        setStream(newStream);
        setCameraOn(true);
      } catch (err) {
        console.error(err);
        setError("카메라를 켤 수 없습니다.");
      }
    }
  };

  // 페이지 언마운트 시 스트림 정리
  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [stream]);

  return (
    <div className="h-screen w-full flex flex-col bg-gray-100 dark:bg-[#18191c]">
      {/* 상단 */}
      <div className="relative flex justify-center items-center px-4 py-2 border-b border-gray-300 dark:border-gray-700">
        <span className="text-gray-800 dark:text-gray-200 font-medium text-center">
          {cameraName}
        </span>
        <button
          onClick={toggleCamera}
          className="absolute right-4 px-3 py-1 text-xs border rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {cameraOn ? "카메라 Off" : "카메라 On"}
        </button>
      </div>

      {error && <p className="text-red-500 px-4 py-2">{error}</p>}

      {/* 영상 영역 */}
      <div className="flex-1 w-full relative bg-black">
        {cameraOn ? (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]"
            autoPlay
            muted
          />
        ) : (
          <div className="absolute inset-0 bg-black flex items-center justify-center text-white text-lg">
            카메라 꺼짐
          </div>
        )}
      </div>
    </div>
  );
}
