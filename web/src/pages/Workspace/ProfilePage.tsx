import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/common/ui/scroll-area";
import { useUserStore } from "@/store/useUserStore";
import { useMicrophone } from "@/components/Workspace/hooks/useMicrophone";
import ProfileHeader from "@/components/Workspace/Profile/ProfileHeader";
import ProfilePersonal from "@/components/Workspace/Profile/ProfilePersonal";
import ProfileAccount from "@/components/Workspace/Profile/ProfileAccount";
import ProfileModals from "@/components/Workspace/Profile/ProfileModals";
import Divider from "@/components/Workspace/Profile/Divider";

export default function ProfilePage() {
  const user = useUserStore((state) => state.user);
  const { devices, selectedDeviceId: initialDeviceId } = useMicrophone();

  const actionButtonClass = "text-blue-600 dark:text-blue-400 text-sm hover:underline px-2";

  // 상위 상태에서 관리
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(initialDeviceId);
  const [cameraLabel, setCameraLabel] = useState("설정되지 않음");
  const [selectedCameraId, setSelectedCameraId] = useState<string | undefined>(() => localStorage.getItem("selectedCameraId") || undefined);

  useEffect(() => {
    // 선택된 카메라가 있으면 레이블 업데이트
    const loadCameraLabel = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cam = devices.find(d => d.deviceId === selectedCameraId);
        setCameraLabel(cam?.label || "설정되지 않음");
      } catch (err) {
        console.error(err);
      }
    };
    loadCameraLabel();
  }, [selectedCameraId]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="h-screen w-full flex flex-col bg-[#f8fafc] dark:bg-[#18191c]">
      <ScrollArea className="flex-1 p-4 md:p-6 lg:p-8">
        <ProfileHeader {...user} />
        <Divider />
        <ProfilePersonal
          user={user}
          cameraLabel={cameraLabel}
          devices={devices}
          selectedDeviceId={selectedDeviceId}
          actionButtonClass={actionButtonClass}
        />
        <Divider />
        <ProfileAccount
          user={user}
          isEmail={true}
          actionButtonClass={actionButtonClass}
        />
      </ScrollArea>

      <ProfileModals
        selectedDeviceId={selectedDeviceId}
        setSelectedDeviceId={setSelectedDeviceId}
        selectedCameraId={selectedCameraId}
        setSelectedCameraId={setSelectedCameraId}
        setCameraLabel={setCameraLabel}
      />
    </div>
  );
}
