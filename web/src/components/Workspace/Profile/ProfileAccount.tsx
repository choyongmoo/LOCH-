import {
  EditPWButton,
  LogOutButton,
  DeleteUserButton,
} from "@/components/Workspace/Buttons/ProfileButtons";
import ProfileRow from "./ProfileRow";
import ProfileSection from "./ProfileSection";
import { Mail, Lock, LogOut, Trash2 } from "lucide-react";

interface Props {
  user: { email?: string };
  isEmail: boolean;
  actionButtonClass: string;
}

export default function ProfileAccount({
  user,
  isEmail,
  actionButtonClass,
}: Props) {
  return (
    <ProfileSection title="계정">
      <div className="flex flex-col gap-4 mt-2">
        {/* 이메일 */}
        <ProfileRow
          label={
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-400" />
              <span>이메일</span>
            </div>
          }
          value={
            <span className="font-medium text-white">
              {user.email ?? "설정되지 않음"}
            </span>
          }
          className="hover:bg-[#2b2d31]/70 transition-colors duration-200 rounded-lg p-2"
        />

        {/* 비밀번호 변경 */}
        <ProfileRow
          label={
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-400" />
              <span>비밀번호 변경</span>
            </div>
          }
          value={
            <span
              className={`${
                isEmail ? "text-gray-300" : "text-gray-500 italic"
              } text-sm`}
            >
              {isEmail
                ? "비밀번호를 변경할 수 있습니다"
                : "소셜 로그인 계정은 비밀번호를 변경할 수 없습니다"}
            </span>
          }
          action={
            <EditPWButton
              className={`${actionButtonClass} ${
                !isEmail ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!isEmail}
            />
          }
          className="hover:bg-[#2b2d31]/70 transition-colors duration-200 rounded-lg p-2"
        />

        {/* 로그아웃 */}
        <ProfileRow
          label={
            <div className="flex items-center gap-2">
              <LogOut className="w-4 h-4 text-yellow-400" />
              <span>로그아웃</span>
            </div>
          }
          value={<span className="text-gray-300">현재 계정에서 로그아웃합니다</span>}
          action={<LogOutButton className={actionButtonClass} />}
          className="hover:bg-[#2b2d31]/70 transition-colors duration-200 rounded-lg p-2"
        />

        {/* 계정 탈퇴 */}
        <ProfileRow
          label={
            <div className="flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-red-500" />
              <span>계정 탈퇴</span>
            </div>
          }
          value={<span className="text-gray-300">현재 계정을 삭제합니다</span>}
          action={<DeleteUserButton className={actionButtonClass} />}
          className="hover:bg-[#2b2d31]/70 transition-colors duration-200 rounded-lg p-2"
        />
      </div>
    </ProfileSection>
  );
}
