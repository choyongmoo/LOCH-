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
  name: string;
  bio: string;
  color: string;
  lang?: "ko" | "en";
  micLabel?: string;
  email: string;
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