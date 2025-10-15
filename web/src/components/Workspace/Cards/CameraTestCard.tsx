import { useModal } from "@/store/useModalStore";
import { Camera } from "lucide-react";
import { useNavigate } from "react-router";
import EditModal from "../Modals/EditModal";
import { useState, useEffect } from "react";
import { useCameraDevices } from "../hooks/useCameraDevices";

export default function CameraTestCard() {
  const navigate = useNavigate();
  const { openModal } = useModal();

  const [selectedCameraId, setSelectedCameraId] = useState<string | undefined>(() => {
    return localStorage.getItem("selectedCameraId") || undefined;
  });

  const [cameraDeviceName, setCameraDeviceName] = useState("장치를 선택하세요");

  const cameras = useCameraDevices();

  useEffect(() => {
    if (selectedCameraId) {
      const cam = cameras.find(c => c.deviceId === selectedCameraId);
      if (cam) setCameraDeviceName(cam.label);
    }
  }, [selectedCameraId, cameras]);

  return (
    <div className="bg-white dark:bg-[#1a1d21] rounded-xl shadow-xl p-6 flex flex-col relative h-40 md:h-48 overflow-hidden">
      
      {/* 상단 컨트롤 바 */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
        <button 
          onClick={() => openModal("editCamera")}
          className="inline-flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-1 text-xs hover:bg-gray-100 dark:hover:bg-[#23242e] transition">
          장치 변경
        </button>
        <button 
          onClick={() => navigate("/workspace/setting")}
          className="inline-flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-1 text-xs hover:bg-gray-100 dark:hover:bg-[#23242e] transition">
          카메라 테스트
        </button>
      </div>

      {/* 장치 이름 표시 영역 */}
      <div className="absolute left-4 right-4 bottom-4 top-14 rounded-xl border border-blue-200 dark:border-blue-900 bg-white dark:bg-[#111827] p-4 flex items-center justify-center">
        <Camera className="text-gray-500 dark:text-gray-300 mr-2" size={18} />
        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
          {cameraDeviceName}
        </span>
      </div>

      {/* 장치 변경 모달 */}
      <EditModal
        modalType="editCamera"
        title="카메라 변경"
        description="사용할 카메라를 선택하세요."
        confirmLabel="변경"
        onConfirm={() => {}}
      >
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
          {cameras.length === 0 && (
            <p className="text-sm text-gray-500">사용 가능한 카메라가 없습니다.</p>
          )}
          {cameras.map((camera) => (
            <button
              key={camera.deviceId}
              className={`px-3 py-2 border rounded text-left ${
                camera.deviceId === selectedCameraId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-[#23242e] text-gray-800 dark:text-gray-200"
              }`}
              onClick={() => {
                setSelectedCameraId(camera.deviceId);
                setCameraDeviceName(camera.label);
                localStorage.setItem("selectedCameraId", camera.deviceId);
              }}
            >
              {camera.label || "알 수 없는 카메라"}
            </button>
          ))}
        </div>
      </EditModal>
    </div>
  );
}
