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
  privateChatTabs: string[];
  activeTab: string;
  onSetActiveTab: (tab: string) => void;
  onClosePrivateTab: (targetUser: string) => void;
  privateMessages?: {[key: string]: ChatMessage[]};
  onSetPrivateMessages?: (messages: {[key: string]: ChatMessage[]}) => void;
  unreadMessages?: {[key: string]: number};
  onSetUnreadMessages?: (unread: {[key: string]: number}) => void;
  unreadGeneralMessages?: number;
};

// UserDetailsModal
export type UserDetailsModalProps = {
  visible: boolean;
  onClose: () => void;
  user: string | null;
};

// MembersBar
export type MembersBarProps = {
  members: string[];
  onOpenDetails: () => void;
  onUserClick?: (name: string) => void;
  onStartPrivateChat?: (targetUser: string) => void;
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