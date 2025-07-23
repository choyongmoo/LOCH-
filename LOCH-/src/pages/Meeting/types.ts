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
};
