import type { ReactNode } from "react";
import type { ModalType } from "@/store/useModal";

export interface ButtonBaseProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export interface AddGroupButtonProps {
  className?: string;
  onClick?: () => void;
}

export interface MenuGroupProps {
  title: string;
  children: ReactNode;
}

export interface CardProps {
  className?: string;
}

//ProfilePage
export interface Profile {
  id?: string;
  email: string;
  password?: string;
  birth_year?: number;
  birth_month?: number;
  birth_day?: number;
  nickname?: string;
  bio?: string;
  accent_color?: string;
  created_at?: string;
  updated_at?: string;

  // UI용 필드
  cameraLabel?: string;
  micLabel?: string;
}

export interface Manager {
  id: string;
  room_name: string;
  description?: string;
  host?: string;
}

//contact
export interface Friend {
  id: string;
  name: string;
  nickname?: string;
  email?: string;
  accent_color?: string;
}

export interface Message {
  sender: 'me' | 'friend';
  text: string;
  timestamp: number;
}

//edit modal
export interface EditModalProps {
  modalType: Exclude<ModalType, null>;
  title: string;
  description?: string;
  children?: React.ReactNode;
  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmDisabled?: boolean;
}

export interface FriendRequest {
    id: string;
    name: string;
    requestedAt: string;
    requester_id: string;
    addressee_id: string;
}