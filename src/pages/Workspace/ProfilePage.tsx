import { Input } from "@/components/common/ui/input";
import { ChangeNameButton, DeleteUserButton, EditBioButton, EditColorButton, EditLanguageButton, EditMicButton, EditPWButton, LogOutButton, MicTestButton } from "@/components/Workspace/Buttons/ProfileButtons";
import { mockProfileDate } from "@/components/Workspace/mocks/modkProfileData";
import EditModal from "@/components/Workspace/Modals/EditModal";
import Divider from "@/components/Workspace/Profile/Divider";
import ProfileHeader from "@/components/Workspace/Profile/ProfileHeader";
import ProfileRow from "@/components/Workspace/Profile/ProfileRow";
import ProfileSection from "@/components/Workspace/Profile/ProfileSection";

export default function ProfilePage() {
    const profile = mockProfileDate;
    //버튼 css
    const actionButtonClass = "text-blue-600 dark:text-blue-400 text-sm hover:underline";
    
    return (
        <div className="h-screen w-full flex flex-col bg-[#f8fafc] dark:bg-[#18191c] overflow-hidden">
            <div className="w-full p-4 md:p-6 lg:p-8 overflow-y-auto">
                <ProfileHeader
                    name={profile.name}
                    bio={profile.bio}
                    color={profile.color}
                    email={profile.email}
                />
                <Divider />
                {/* 개인 섹션 */}
                <ProfileSection title="개인">
                    <ProfileRow
                        label="별명"
                        value={profile.name ?? "설정되지 않음"}
                        action={<ChangeNameButton className={actionButtonClass} />}
                    />
                    <ProfileRow
                        label="소개글"
                        value={profile.bio ?? "설정되지 않음"}
                        action={<EditBioButton className={actionButtonClass} />}
                    />
                    <ProfileRow
                        label="색상"
                        value={
                        <span
                            className="inline-block w-5 h-5 rounded"
                            style={{ backgroundColor: profile.color }}
                        />
                        }
                        action={<EditColorButton className={actionButtonClass} />}
                    />
                    <ProfileRow
                        label="언어"
                        value={profile.lang === "en" ? "English" : "한국어"}
                        action={<EditLanguageButton className={actionButtonClass} />}
                    />
                    <ProfileRow
                        label="마이크"
                        value={profile.micLabel ?? "설정되지 않음"}
                        action={
                            <>
                                <MicTestButton className={actionButtonClass} />
                                <EditMicButton className={actionButtonClass} />
                            </>
                        }
                    />
                </ProfileSection>
                <Divider />
                {/* 계정 섹션 */}
                <ProfileSection title="계정">
                    <ProfileRow
                        label="이메일"
                        value={profile.email ?? "설정되지 않음"}
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
            </div>
            <EditModal modalType="changeName" title="별명 변경" description="프로필에 표시될 이름을 입력하세요" onConfirm={() => {}} confirmLabel="변경">
                <Input value={profile.name || ""} onChange={() => {}} placeholder="이름을 입력하세요" className="w-full" />
            </EditModal>
            <EditModal modalType="editBio" title="소개글 변경" description="프로필에 표시될 소개글을 입력하세요." onConfirm={() => {}} confirmLabel="변경">
                <Input value={profile.bio || ""} onChange={() => {}} placeholder="소개글을 입력하세요" className="w-full" />
            </EditModal>
            <EditModal modalType="editLanguage" title="언어 변경" description="표시할 언어를 선택하세요." onConfirm={() => {}} confirmLabel="변경"></EditModal>
            <EditModal modalType="editColor" title="프로필 색 변경" description="변경할 색상을 선택하세요." onConfirm={() => {}} confirmLabel="변경"></EditModal>
            <EditModal modalType="micTest" title="마이크 테스트" description="마이크를 테스트하세요." ></EditModal>
            <EditModal modalType="editMic" title="마이크 설정" description="사용할 마이크를 선택하세요." onConfirm={() => {}} confirmLabel="변경"></EditModal>
            <EditModal modalType="editPW" title="비밀번호 변경" description="비밀 번호를 변경합니다." onConfirm={() => {}} confirmLabel="변경"></EditModal>
            <EditModal modalType="logOut" title="로그아웃" description="현재 계정에서 로그아웃 하시겠습니까?" onConfirm={() => {}} confirmLabel="로그아웃"></EditModal>
            <EditModal modalType="deleteUser" title="회원 탈퇴" description="현재 계정을 삭제합니다." onConfirm={() => {}} confirmLabel="탈퇴"></EditModal>
        </div>
    );
}
