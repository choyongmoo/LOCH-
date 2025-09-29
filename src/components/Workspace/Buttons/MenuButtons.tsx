import type { ButtonBaseProps } from "@/types/workspace";
import MenuButtonBase from "./MenuButtonBase";

export function HomeButton({ className, onClick }: ButtonBaseProps) {
  return <MenuButtonBase className={className} onClick={onClick}>홈</MenuButtonBase>;
}

export function ProfileButton({ className, onClick }: ButtonBaseProps) {
  return <MenuButtonBase className={className} onClick={onClick}>프로필</MenuButtonBase>;
}

export function SettingButton({ className, onClick }: ButtonBaseProps) {
  return <MenuButtonBase className={className} onClick={onClick}>설정</MenuButtonBase>;
}

export function ContactButton({ className, onClick }: ButtonBaseProps) {
  return <MenuButtonBase className={className} onClick={onClick}>개인 연락처</MenuButtonBase>;
}

export function FriendRequestButton({ className, onClick }: ButtonBaseProps) {
  return <MenuButtonBase className={className} onClick={onClick}>친구 수신함</MenuButtonBase>;
}

export function RecordButton({ className, onClick }: ButtonBaseProps) {
  return <MenuButtonBase className={className} onClick={onClick}>회의록</MenuButtonBase>;
}

export function ManagerButton({ className, onClick }: ButtonBaseProps) {
  return <MenuButtonBase className={className} onClick={onClick}>서버 관리</MenuButtonBase>;
}