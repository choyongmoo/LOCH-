import { EditPWButton, LogOutButton, DeleteUserButton } from "@/components/Workspace/Buttons/ProfileButtons";
import ProfileRow from "./ProfileRow";
import ProfileSection from "./ProfileSection";

interface Props {
  user: { email?: string };
  isEmail: boolean;
  actionButtonClass: string;
}

export default function ProfileAccount({ user, isEmail, actionButtonClass }: Props) {
  return (
    <ProfileSection title="계정">
      <ProfileRow label="이메일" value={user.email ?? "설정되지 않음"} />
      <ProfileRow
        label="비밀번호 변경"
        value={isEmail ? "비밀번호를 변경할 수 있습니다" : "소셜 로그인 계정은 비밀번호를 변경할 수 없습니다"}
        action={<EditPWButton className={actionButtonClass} disabled={!isEmail} />}
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
  )
}
