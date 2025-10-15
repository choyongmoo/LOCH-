import { ChangeNameButton, EditBioButton, EditColorButton, EditCameraButton, CameraTestButton, EditMicButton, MicTestButton } from "@/components/Workspace/Buttons/ProfileButtons";
import ProfileRow from "./ProfileRow";
import ProfileSection from "./ProfileSection";
import type { Profile } from "@/types/workspace";

interface Props {
  user: Profile;
  cameraLabel: string;
  devices: MediaDeviceInfo[];
  selectedDeviceId?: string;
  actionButtonClass: string;
}

export default function ProfilePersonal({ user, cameraLabel, devices, selectedDeviceId, actionButtonClass }: Props) {
  return (
    <ProfileSection title="개인">
      <ProfileRow
        label="별명"
        value={user.nickname ?? "설정되지 않음"}
        action={<ChangeNameButton className={actionButtonClass} />}
      />
      <ProfileRow
        label="소개글"
        value={user.bio ?? "설정되지 않음"}
        action={<EditBioButton className={actionButtonClass} />}
      />
      <ProfileRow
        label="색상"
        value={
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded border border-gray-300" style={{ backgroundColor: user.accent_color ?? "#7e22ce" }} />
            <span>{user.accent_color ?? "#7e22ce"}</span>
          </div>
        }
        action={<EditColorButton className={actionButtonClass} />}
      />
      <ProfileRow
        label="카메라"
        value={cameraLabel}
        action={
          <>
            <CameraTestButton className={actionButtonClass} />
            <EditCameraButton className={actionButtonClass} />
          </>
        }
      />
      <ProfileRow
        label="마이크"
        value={devices.find(d => d.deviceId === selectedDeviceId)?.label || "기본 마이크"}
        action={
          <>
            <MicTestButton className={actionButtonClass} />
            <EditMicButton className={actionButtonClass} />
          </>
        }
      />
    </ProfileSection>
  )
}
