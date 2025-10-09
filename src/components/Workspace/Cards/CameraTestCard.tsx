import { useModal } from "@/store/useModalStore";
import { Camera } from "lucide-react";
import { useNavigate } from "react-router";
import EditModal from "../Modals/EditModal";

export default function CameraTestCard() {
  const navigate =useNavigate();
  const cameraDeviceName = "기본 카메라";
  const { openModal } = useModal();

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
      <EditModal modalType="editCamera" title="카메라 변경" description="사용할 카메라를 선택하세요." onConfirm={() => {}} confirmLabel="변경"/>
    </div>
  );
}
