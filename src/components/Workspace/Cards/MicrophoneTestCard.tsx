// components/MicrophoneTestCard.tsx
import { useModal } from "@/store/useModalStore";
import { Mic } from "lucide-react";
import EditModal from "../Modals/EditModal";
import { useMicrophone } from "../hooks/useMicrophone";
import { useState } from "react";

export default function MicrophoneTestCard() {
  const { openModal, closeModal } = useModal();
  const { devices, selectedDeviceId, selectDevice, startTest, stopTest, isTesting, canvasRef } = useMicrophone();
  const [tempDeviceId, setTempDeviceId] = useState<string | undefined>(selectedDeviceId);

  return (
    <div className="bg-white dark:bg-[#1a1d21] rounded-xl shadow-xl p-6 flex flex-col relative h-40 md:h-48">
      {/* 상단 컨트롤 바 */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
        <button 
          onClick={() => openModal("editMic")}
          className="inline-flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-1 text-xs hover:bg-gray-100 dark:hover:bg-[#23242e] transition">
            장치 변경
        </button>

        <button 
          onClick={() => {
            if (isTesting) stopTest();
            else startTest(selectedDeviceId);
          }}
          className={`inline-flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-1 text-xs hover:bg-gray-100 dark:hover:bg-[#23242e] transition ${isTesting ? "bg-blue-500 text-white" : ""}`}
        >
          {isTesting ? "중지" : "마이크 테스트"}
        </button>
      </div>

      {/* 마이크 레벨 표시 영역 */}
      <div className="absolute left-4 right-4 bottom-4 top-14 rounded-xl border border-blue-200 dark:border-blue-900 bg-white dark:bg-[#111827] p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Mic className="text-gray-500 dark:text-gray-300" size={18} />
          <div className="flex-1 h-6 md:h-7 rounded-full bg-blue-100 dark:bg-blue-950/50 overflow-hidden">
            {/* Canvas 기반 좌→우 볼륨 표시 */}
            <canvas ref={canvasRef} className="w-full h-full block" />
          </div>
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-300 truncate">
          장치: {devices.find(d => d.deviceId === selectedDeviceId)?.label || "기본 마이크"}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {isTesting ? "마이크 테스트 중..." : "마이크를 테스트 해보세요!"}
        </div>
      </div>

      {/* 장치 변경 모달 */}
      <EditModal 
        modalType="editMic" 
        title="마이크 설정" 
        description="사용할 마이크를 선택하세요." 
        confirmLabel="변경" 
        onConfirm={() => { 
          if (tempDeviceId) selectDevice(tempDeviceId); 
          closeModal(); 
        }}
      >
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
          {devices.length === 0 && <p>사용 가능한 마이크가 없습니다.</p>}
          {devices.map((device) => (
            <button
              key={device.deviceId}
              className={`px-3 py-2 border rounded text-left ${device.deviceId === tempDeviceId ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-[#23242e] text-gray-800 dark:text-gray-200"}`}
              onClick={() => setTempDeviceId(device.deviceId)}
            >
              {device.label || "알 수 없는 마이크"}
            </button>
          ))}
        </div>
      </EditModal>
    </div>
  );
}
