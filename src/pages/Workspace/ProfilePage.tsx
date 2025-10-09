import { Input } from "@/components/common/ui/input";
import { ScrollArea } from "@/components/common/ui/scroll-area";
import { CameraTestButton, ChangeNameButton, DeleteUserButton, EditBioButton, EditCameraButton, EditColorButton, EditMicButton, EditPWButton, LogOutButton, MicTestButton } from "@/components/Workspace/Buttons/ProfileButtons";
import EditModal from "@/components/Workspace/Modals/EditModal";
import Divider from "@/components/Workspace/Profile/Divider";
import ProfileHeader from "@/components/Workspace/Profile/ProfileHeader";
import ProfileRow from "@/components/Workspace/Profile/ProfileRow";
import ProfileSection from "@/components/Workspace/Profile/ProfileSection";
import { useUserStore } from "@/store/useUserStore";
import { useState } from "react";
import { useModal } from "@/store/useModalStore";
import { useMicrophone } from "@/components/Workspace/hooks/useMicrophone";
import { useDeleteAccount } from "@/components/Workspace/hooks/useDeleteAccount";

export default function ProfilePage() {
  const user = useUserStore((state) => state.user);
  const [newNickname, setNewNickname] = useState(user?.nickname || "");
  const [newBio, setNewBio] = useState(user?.bio || "");
  const [newAccent_color, setNewAccent_color] = useState(user?.accent_color || "#7e22ce");
  const closeModal = useModal((state) => state.closeModal);
  const logout = useUserStore((state) => state.logout);
  const { deleteAccount } = useDeleteAccount();
  
  const { devices, selectedDeviceId, selectDevice } = useMicrophone();
  const [tempDeviceId, setTempDeviceId] = useState<string | undefined>(selectedDeviceId);
  
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAccent_color(e.target.value);
  };

  if (!user) return <div>Loading...</div>;

  const actionButtonClass = "text-blue-600 dark:text-blue-400 text-sm hover:underline px-2";

  return (
    <div className="h-screen w-full flex flex-col bg-[#f8fafc] dark:bg-[#18191c]">
      {/* Scrollable area */}
      <ScrollArea className="flex-1 p-4 md:p-6 lg:p-8">
        <ProfileHeader
          nickname={user.nickname}
          bio={user.bio}
          accent_color={user.accent_color}
          email={user.email}
        />
        <Divider />

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
                        <div
                            className="w-6 h-6 rounded border border-gray-300"
                            style={{ backgroundColor: user.accent_color ?? "#7e22ce" }}
                        />
                            <span>{user.accent_color ?? "#7e22ce"}</span>
                    </div>}
            action={<EditColorButton className={actionButtonClass} />}
          />
          <ProfileRow
            label="카메라"
            value={user.cameraLabel ?? "설정되지 않음"}
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

        <Divider />

        <ProfileSection title="계정">
          <ProfileRow
            label="이메일"
            value={user.email ?? "설정되지 않음"}
          />
          <ProfileRow
            label="비밀번호 변경"
            value="비밀번호를 변경할 수 있습니다"
            action={<EditPWButton className={actionButtonClass} />}
          />
          <ProfileRow
            label="로그아웃"
            value="현재 계정에서 로그아웃 합니다"
            action={<LogOutButton className={actionButtonClass} />}
          />
          <ProfileRow
            label="탈퇴"
            value="현재 계정을 삭제합니다"
            action={<DeleteUserButton className={actionButtonClass} />}
          />
        </ProfileSection>
      </ScrollArea>

      {/* Edit Modals */}
      <EditModal modalType="changeName" title="별명 변경" description="프로필에 표시될 이름을 입력하세요" 
        onConfirm={async () => { if(newNickname.trim()) { await useUserStore.getState().updateNickname(newNickname.trim()); closeModal(); }}} confirmLabel="변경">
        <Input value={newNickname} onChange={(e) => setNewNickname(e.target.value)} placeholder="이름을 입력하세요" className="w-full" />
      </EditModal>

      <EditModal modalType="editBio" title="소개글 변경" description="프로필에 표시될 소개글을 입력하세요." 
        onConfirm={async () => { if(newBio.trim()) { await useUserStore.getState().updateBio(newBio.trim()); closeModal(); }}} confirmLabel="변경">
        <Input value={newBio} onChange={(e) => setNewBio(e.target.value)} placeholder="소개글을 입력하세요" className="w-full" />
      </EditModal>

      <EditModal modalType="editColor" title="프로필 색 변경" description="변경할 색상을 선택하세요." 
        onConfirm={async () => { if(newAccent_color.trim()) { await useUserStore.getState().updateAccentColor(newAccent_color.trim()); closeModal(); }}} confirmLabel="변경">
        <div className="flex items-center gap-2">
          <Input type="color" className="h-10 w-16 rounded border" value={newAccent_color} onChange={handleColorChange}/>
          <Input value={newAccent_color} onChange={handleColorChange} placeholder="배경색을 입력하세요"/>
        </div>
      </EditModal>

      <EditModal modalType="editCamera" title="카메라 변경" description="사용할 카메라를 선택하세요." onConfirm={() => {}} confirmLabel="변경"/>
      <EditModal modalType="micTest" title="마이크 테스트" description="마이크를 테스트하세요." />
      <EditModal modalType="editMic" title="마이크 설정" description="사용할 마이크를 선택하세요." confirmLabel="변경" onConfirm={() => { if (tempDeviceId) selectDevice(tempDeviceId); closeModal(); }} >
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
          {devices.length === 0 && <p>사용 가능한 마이크가 없습니다.</p>}
          {devices.map((device) => (
            <button
              key={device.deviceId}
              className={`px-3 py-2 border rounded text-left ${
                device.deviceId === tempDeviceId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-[#23242e] text-gray-800 dark:text-gray-200"
              }`}
              onClick={() => setTempDeviceId(device.deviceId)}
            >
              {device.label || "알 수 없는 마이크"}
            </button>
          ))}
        </div>
      </EditModal>
      <EditModal modalType="editPW" title="비밀번호 변경" description="비밀 번호를 변경합니다." onConfirm={() => {}} confirmLabel="변경"/>
      <EditModal modalType="logout" title="로그아웃" description="현재 계정에서 로그아웃 하시겠습니까?" 
        onConfirm={async () => { await logout(); }} confirmLabel="로그아웃"/>
      <EditModal modalType="deleteUser" title="회원 탈퇴" description="현재 계정을 삭제합니다." onConfirm={() => {deleteAccount();}} confirmLabel="탈퇴"/>
    </div>
  );
}
