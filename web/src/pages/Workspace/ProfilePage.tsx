import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/common/ui/scroll-area";
import { useUserStore } from "@/store/useUserStore";
import { useMicrophone } from "@/components/Workspace/hooks/useMicrophone";
import ProfileHeader from "@/components/Workspace/Profile/ProfileHeader";
import ProfilePersonal from "@/components/Workspace/Profile/ProfilePersonal";
import ProfileAccount from "@/components/Workspace/Profile/ProfileAccount";
import ProfileModals from "@/components/Workspace/Profile/ProfileModals";
import Divider from "@/components/Workspace/Profile/Divider";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const user = useUserStore((state) => state.user);
  const { devices, selectedDeviceId: initialDeviceId } = useMicrophone();
  const [isEmail, setIsEmail] = useState<boolean>(false);
  const actionButtonClass = "text-blue-600 dark:text-blue-400 text-sm hover:underline px-2";

  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(initialDeviceId);
  const [cameraLabel, setCameraLabel] = useState("설정되지 않음");
  const [selectedCameraId, setSelectedCameraId] = useState<string | undefined>(() => localStorage.getItem("selectedCameraId") || undefined);

  useEffect(() => {
  if (!user) return;

  const checkProvider = async () => {
    try {
      const {data, error} = await supabase.functions.invoke("get-user-provider");

      if (error) {
        return
      }

      let providers: string[] = [];
      if (data.providers && Array.isArray(data.providers)) {
        providers = data.providers;
        console.log(data);
      }

      setIsEmail(providers.length === 0 || providers.includes("email")); 
    } catch (err) {
      console.error("프로바이더 확인 실패", err);
    }
  };

  checkProvider();
}, [user]);

  useEffect(() => {
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
          isEmail={isEmail}
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
