import { Input } from "@/components/common/ui/input";
import EditModal from "@/components/Workspace/Modals/EditModal";
import { useModal } from "@/store/useModalStore";
import { useUserStore } from "@/store/useUserStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useMicrophone } from "@/components/Workspace/hooks/useMicrophone";
import { useDeleteAccount } from "@/components/Workspace/hooks/useDeleteAccount";
import { useState, useEffect } from "react";
import { Mic } from "lucide-react";

interface Props {
  selectedDeviceId: string | undefined;
  setSelectedDeviceId: (id: string) => void;
  selectedCameraId: string | undefined;
  setSelectedCameraId: (id: string) => void;
  setCameraLabel: (label: string) => void;
}

export default function ProfileModals({ selectedDeviceId, setSelectedDeviceId, selectedCameraId, setSelectedCameraId, setCameraLabel }: Props) {
  const closeModal = useModal((state) => state.closeModal);
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const deleteAccount = useDeleteAccount();
  const { devices, selectDevice, startTest, stopTest, isTesting, canvasRef } = useMicrophone();

  const [newNickname, setNewNickname] = useState(user?.nickname || "");
  const [newBio, setNewBio] = useState(user?.bio || "");
  const [newAccentColor, setNewAccentColor] = useState(user?.accent_color || "#7e22ce");
  const [newPassword, setNewPassword] = useState("");
  const [tempDeviceId, setTempDeviceId] = useState<string | undefined>(selectedDeviceId);

  const [tempCameraId, setTempCameraId] = useState<string | undefined>(selectedCameraId);
  const [cameraDevices, setCameraDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    const loadCameraDevices = async () => {
      try {
        const cams = await navigator.mediaDevices.enumerateDevices();
        setCameraDevices(cams.filter(d => d.kind === "videoinput"));
      } catch (err) {
        console.error(err);
      }
    };
    loadCameraDevices();
  }, []);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => setNewAccentColor(e.target.value);

  if (!user) return null;

  return (
    <>
      {/* 별명 변경 */}
      <EditModal
        modalType="changeName"
        title="별명 변경"
        description="프로필에 표시될 이름을 입력하세요"
        confirmLabel="변경"
        onConfirm={async () => {
          if (newNickname.trim()) {
            await useUserStore.getState().updateNickname(newNickname.trim());
            closeModal();
          }
        }}
      >
        <Input value={newNickname} onChange={(e) => setNewNickname(e.target.value)} placeholder="이름을 입력하세요" className="w-full" />
      </EditModal>

      {/* 소개글 변경 */}
      <EditModal
        modalType="editBio"
        title="소개글 변경"
        description="프로필에 표시될 소개글을 입력하세요."
        confirmLabel="변경"
        onConfirm={async () => {
          if (newBio.trim()) {
            await useUserStore.getState().updateBio(newBio.trim());
            closeModal();
          }
        }}
      >
        <Input value={newBio} onChange={(e) => setNewBio(e.target.value)} placeholder="소개글을 입력하세요" className="w-full" />
      </EditModal>

      {/* 색상 변경 */}
      <EditModal
        modalType="editColor"
        title="프로필 색 변경"
        description="변경할 색상을 선택하세요."
        confirmLabel="변경"
        onConfirm={async () => {
          if (newAccentColor.trim()) {
            await useUserStore.getState().updateAccentColor(newAccentColor.trim());
            closeModal();
          }
        }}
      >
        <div className="flex items-center gap-2">
          <Input type="color" className="h-10 w-16 rounded border" value={newAccentColor} onChange={handleColorChange} />
          <Input value={newAccentColor} onChange={handleColorChange} placeholder="배경색을 입력하세요" />
        </div>
      </EditModal>

      {/* 카메라 변경 */}
      <EditModal
        modalType="editCamera"
        title="카메라 변경"
        description="사용할 카메라를 선택하세요."
        confirmLabel="변경"
        onConfirm={() => {
          if (tempCameraId) {
            const cam = cameraDevices.find(d => d.deviceId === tempCameraId);
            setCameraLabel(cam?.label || "알 수 없는 카메라");
            setSelectedCameraId(tempCameraId);
            localStorage.setItem("selectedCameraId", tempCameraId);
            closeModal();
          }
        }}
      >
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
          {cameraDevices.length === 0 && <p>사용 가능한 카메라가 없습니다.</p>}
          {cameraDevices.map(cam => (
            <button
              key={cam.deviceId}
              className={`px-3 py-2 border rounded text-left ${cam.deviceId === tempCameraId ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-[#23242e] text-gray-800 dark:text-gray-200"}`}
              onClick={() => setTempCameraId(cam.deviceId)}
            >
              {cam.label || "알 수 없는 카메라"}
            </button>
          ))}
        </div>
      </EditModal>

      {/* 마이크 변경 */}
      <EditModal
        modalType="editMic"
        title="마이크 설정"
        description="사용할 마이크를 선택하세요."
        confirmLabel="변경"
        onConfirm={() => {
          if (tempDeviceId) {
            selectDevice(tempDeviceId);
            setSelectedDeviceId(tempDeviceId);
          }
          closeModal();
        }}
      >
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
          {devices.length === 0 && <p>사용 가능한 마이크가 없습니다.</p>}
          {devices.map(device => (
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

      {/* 마이크 테스트 */}
      <EditModal
        modalType="micTest"
        title="마이크 테스트"
        description="마이크를 테스트하세요."
        confirmLabel="닫기"
        onConfirm={() => { if (isTesting) stopTest();
        closeModal(); }}
      >
        <div className="flex justify-end gap-2">
          <button
            className={`px-3 py-1 border rounded ${isTesting ? "bg-blue-500 text-white" : ""}`}
            onClick={() => isTesting ? stopTest() : startTest(selectedDeviceId)}
          >
            {isTesting ? "중지" : "시작"}
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-white dark:bg-[#111827] p-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Mic className="text-gray-500 dark:text-gray-300" size={18} />
              <div className="flex-1 h-6 md:h-7 rounded-full bg-blue-100 dark:bg-blue-950/50 overflow-hidden">
                <canvas ref={canvasRef} className="w-full h-full block" />
              </div>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300">
              장치: {devices.find(d => d.deviceId === selectedDeviceId)?.label || "장치를 선택하세요"}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {isTesting ? "마이크 테스트 중..." : "마이크를 테스트 해보세요!"}
            </div>
          </div>
        </div>
      </EditModal>

      {/* 비밀번호 변경 */}
      <EditModal
        modalType="editPW"
        title="비밀번호 변경"
        description="새 비밀번호를 입력하세요."
        confirmLabel="변경"
        onConfirm={async () => {
          if (!newPassword.trim()) return alert("비밀번호를 입력해주세요");
          const { error } = await useAuthStore.getState().updatePassword(newPassword);
          if (error) return alert("비밀번호 변경 실패: " + error.message);
          alert("비밀번호가 변경되었습니다");
          setNewPassword("");
          closeModal();
        }}
      >
        <Input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="새 비밀번호"
          className="w-full"
        />
      </EditModal>

      {/* 로그아웃 */}
      <EditModal
        modalType="logout"
        title="로그아웃"
        description="현재 계정에서 로그아웃 하시겠습니까?"
        confirmLabel="로그아웃"
        onConfirm={async () => await logout()}
      />

      {/* 회원 탈퇴 */}
      <EditModal
        modalType="deleteUser"
        title="회원 탈퇴"
        description="⚠️ 이 작업은 되돌릴 수 없습니다! 계정과 모든 데이터가 영구 삭제됩니다. 계속 진행하시겠습니까?"
        confirmLabel="탈퇴"
        onConfirm={deleteAccount}
      />
    </>
  );
}
