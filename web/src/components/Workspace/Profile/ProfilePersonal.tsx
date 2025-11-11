import {
  ChangeNameButton,
  EditBioButton,
  EditColorButton,
  EditCameraButton,
  CameraTestButton,
  EditMicButton,
  MicTestButton,
} from "@/components/Workspace/Buttons/ProfileButtons";
import ProfileRow from "./ProfileRow";
import ProfileSection from "./ProfileSection";
import type { Profile } from "@/types/workspace";
import { User, Info, Palette, Video, Mic } from "lucide-react";

interface Props {
  user: Profile;
  cameraLabel: string;
  devices: MediaDeviceInfo[];
  selectedDeviceId?: string;
  actionButtonClass: string;
}

export default function ProfilePersonal({
  user,
  cameraLabel,
  devices,
  selectedDeviceId,
  actionButtonClass,
}: Props) {
  const accent = user.accent_color ?? "#7e22ce";

  return (
    <ProfileSection title="개인">
      <div className="flex flex-col gap-4 mt-2">
        {/* 별명 */}
        <ProfileRow
          label={
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-400" />
              <span>별명</span>
            </div>
          }
          value={
            <span className="font-medium text-gray-300">
              {user.nickname ?? "설정되지 않음"}
            </span>
          }
          action={<ChangeNameButton className={actionButtonClass} />}
          className="hover:bg-[#2b2d31]/70 transition-colors duration-200 rounded-lg p-2"
        />

        {/* 소개글 */}
        <ProfileRow
          label={
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-400" />
              <span>소개글</span>
            </div>
          }
          value={
            <span className="text-gray-300 italic">
              {user.bio ?? "설정되지 않음"}
            </span>
          }
          action={<EditBioButton className={actionButtonClass} />}
          className="hover:bg-[#2b2d31]/70 transition-colors duration-200 rounded-lg p-2"
        />

        {/* 색상 */}
        <ProfileRow
          label={
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-pink-400" />
              <span>색상</span>
            </div>
          }
          value={
            <div className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded-md border border-gray-600 shadow-sm"
                style={{ backgroundColor: accent }}
              />
              <span className="text-sm text-gray-300">{accent}</span>
            </div>
          }
          action={<EditColorButton className={actionButtonClass} />}
          className="hover:bg-[#2b2d31]/70 transition-colors duration-200 rounded-lg p-2"
        />

        {/* 카메라 */}
        <ProfileRow
          label={
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-green-400" />
              <span>카메라</span>
            </div>
          }
          value={
            <span className="text-gray-300">
              {cameraLabel ?? "기본 카메라"}
            </span>
          }
          action={
            <div className="flex justify-end items-center gap-2">
              <CameraTestButton className={actionButtonClass} />
              <EditCameraButton className={actionButtonClass} />
            </div>
          }
          className="hover:bg-[#2b2d31]/70 transition-colors duration-200 rounded-lg p-2"
        />

        {/* 마이크 */}
        <ProfileRow
          label={
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-yellow-400" />
              <span>마이크</span>
            </div>
          }
          value={
            <span className="text-gray-300">
              {devices.find((d) => d.deviceId === selectedDeviceId)?.label ??
                "기본 마이크"}
            </span>
          }
          action={
            <div className="flex justify-end items-center gap-2">
              <MicTestButton className={actionButtonClass} />
              <EditMicButton className={actionButtonClass} />
            </div>
          }
          className="hover:bg-[#2b2d31]/70 transition-colors duration-200 rounded-lg p-2"
        />
      </div>
    </ProfileSection>
  );
}
