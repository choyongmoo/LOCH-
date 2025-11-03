import { useState } from "react";
import { useCameraDevices } from "../hooks/useCameraDevices";

interface EditCameraModalProps {
  onSelect: (camera: MediaDeviceInfo) => void;
}

export default function EditCameraModal({ onSelect }: EditCameraModalProps) {
  const cameras = useCameraDevices();
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  return (
    <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
      {cameras.length === 0 && (
        <p className="text-sm text-gray-500">사용 가능한 카메라가 없습니다.</p>
      )}

      {cameras.map((camera) => (
        <button
          key={camera.deviceId}
          className={`px-3 py-2 border rounded text-left ${
            camera.deviceId === selectedId
              ? "bg-blue-500 text-white"
              : "bg-gray-100 dark:bg-[#23242e] text-gray-800 dark:text-gray-200"
          }`}
          onClick={() => {
            setSelectedId(camera.deviceId);
            onSelect(camera);

            localStorage.setItem("selectedCameraId", camera.deviceId);
          }}
        >
          {camera.label || "알 수 없는 카메라"}
        </button>
      ))}
    </div>
  );
}
