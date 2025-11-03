import { useModal } from "@/store/useModalStore";
import { Camera } from "lucide-react";
import { useNavigate } from "react-router";
import EditModal from "../Modals/EditModal";
import { useState, useEffect } from "react";
import { useCameraDevices } from "../hooks/useCameraDevices";

export default function CameraTestCard() {
  const navigate = useNavigate();
  const { openModal } = useModal();

  // 카드에서 실제 적용되는 선택 상태
  const [selectedCameraId, setSelectedCameraId] = useState<string | undefined>(() => {
    return localStorage.getItem("selectedCameraId") || undefined;
  });
  const [cameraDeviceName, setCameraDeviceName] = useState("장치를 선택하세요");

  // 모달 내에서 임시로 선택 상태 관리
  const [tempCameraId, setTempCameraId] = useState<string | undefined>(selectedCameraId);
  const [tempCameraName, setTempCameraName] = useState(cameraDeviceName);

  const cameras = useCameraDevices();

  // 카드 상태가 바뀌면 이름 업데이트
  useEffect(() => {
    if (selectedCameraId) {
      const cam = cameras.find(c => c.deviceId === selectedCameraId);
      if (cam) setCameraDeviceName(cam.label);
    }
  }, [selectedCameraId, cameras]);

  // 모달 열 때 임시 상태 초기화
  const handleOpenModal = () => {
    setTempCameraId(selectedCameraId);
    setTempCameraName(cameraDeviceName);
    openModal("editCamera");
  };

  return (
    <div className="bg-white dark:bg-[#1a1d21] rounded-xl shadow-xl p-6 flex flex-col relative h-40 md:h-48 overflow-hidden">
      
      {/* 상단 컨트롤 바 */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
        <button 
          onClick={handleOpenModal}
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
        onConfirm={() => {
          if (tempCameraId && tempCameraName) {
            setSelectedCameraId(tempCameraId);
            setCameraDeviceName(tempCameraName);
            localStorage.setItem("selectedCameraId", tempCameraId);
          }
        }}
      >
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
          {cameras.length === 0 && (
            <p className="text-sm text-gray-500">사용 가능한 카메라가 없습니다.</p>
          )}
          {cameras.map((camera) => (
            <button
              key={camera.deviceId}
              className={`px-3 py-2 border rounded text-left ${
                camera.deviceId === tempCameraId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-[#23242e] text-gray-800 dark:text-gray-200"
              }`}
              onClick={() => {
                setTempCameraId(camera.deviceId);
                setTempCameraName(camera.label);
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
