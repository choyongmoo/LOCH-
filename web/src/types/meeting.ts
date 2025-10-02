// MeetingLayout 관련 타입들
export interface AppInstance {
  id: string;
  type: string;
  title: string;
}

export interface DynamicPanel {
  id: number;
  app?: string;
  title?: string;
  row: number;
  col: number;
  rowSpan: number;
  colSpan: number;
}

export interface PendingDrop {
  type: string;
  targetNum?: number;
  mode?: 'replace' | 'split';
}

export interface ReplaceOrSplit {
  instance: AppInstance;
  targetNum: number;
  sourceType: 'instance' | 'app';
}

export type ModalMode = 'select' | 'create';

// MeetingDetailsModalProps
export type MeetingDetailsModalProps = {
  visible: boolean;
  onClose: () => void;
  details: string;
};

// Chat 관련
export type ChatMessage = {
  user: string;
  text: string;
  timestamp: string;
};

export type ChatBoxProps = {
  messages: ChatMessage[];
  input: string;
  setInput: (val: string) => void;
  onSend: () => void;
  privateChatTabs?: string[];
  activeTab?: string;
  onSetActiveTab?: (tab: string) => void;
  onClosePrivateTab?: (targetUser: string) => void;
  privateMessages?: { [key: string]: ChatMessage[] };
  onSetPrivateMessages?: (messages: { [key: string]: ChatMessage[] }) => void;
  unreadMessages?: { [key: string]: number };
  onSetUnreadMessages?: (unread: { [key: string]: number }) => void;
  unreadGeneralMessages?: number;
};

// UserDetailsModal
export type UserDetailsModalProps = {
  visible: boolean;
  onClose: () => void;
  user: string | null;
  userInfo?: {
    name: string;
    role: string;
    department: string;
    email: string;
    status: string;
    joinDate: string;
    lastSeen: string;
    avatar: string;
    skills: string[];
    projects: string[];
    bio: string;
  };
};

// MembersBar
export type MembersBarProps = {
  members: string[];
  onOpenDetails: () => void;
  onUserClick: (name: string) => void;
  onStartPrivateChat?: (name: string) => void;
};

// SlideNotification
export type SlideNotificationProps = {
  message: string;
  visible: boolean;
  duration?: number;
  className?: string;
};

// PanelContent
export type PanelContentProps = {
  num: number;
  app?: string;
  title?: string;
  openMenu: number | null;
  onToggleMenu: (num: number) => void;
  onAdd: (targetNum: number) => void;
  onCloseAll: () => void;
  onCloseOthers: (num: number) => void;
  onClose: (num: number) => void;
  onSplit: (num: number, droppedApp: string) => void;
  onAppDrop?: (appType: string, targetNum: number) => void;
  // 앱 위치 바꾸기 관련
  showSwap?: boolean;
  showSwapHere?: boolean;
  isSwapTarget?: boolean;
  onSwapApp?: () => void;
  onSwapHere?: () => void;
  onCancelSwap?: () => void;
  // 전체 화면 관련
  onFullscreen?: (num: number) => void;
};

// Supabase Meeting 관련 타입들
export interface Meeting {
  id: string;
  room_name: string;
  description: string | null;
  host: string;
  created_at: string;
  updated_at: string;
  status: 'waiting' | 'active' | 'ended';
  max_participants: number;
  is_private: boolean;
  password?: string;
}

export interface MeetingMember {
  id: number;
  meeting_id: string;
  user_id: number;
  joined_at: string;
  left_at?: string;
  role: 'host' | 'participant' | 'observer';
  is_active: boolean;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface MeetingMessage {
  id: number;
  meeting_id: string;
  sender_id: number;
  content: string;
  message_type: 'general' | 'private' | 'system';
  receiver_id?: number;
  created_at: string;
  sender?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface MeetingParticipant {
  id: number;
  name: string;
  email: string;
  is_local: boolean;
  is_camera_on: boolean;
  is_mic_on: boolean;
  is_screen_sharing: boolean;
  is_active: boolean;
  joined_at: string;
  role: 'host' | 'participant' | 'observer';
} 