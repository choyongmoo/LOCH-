// MeetingDetailsModalProps
export type MeetingDetailsModalProps = {
  visible: boolean;
  onClose: () => void;
  details?: string;
  meetingInfo?: {
    roomName: string;
    roomId: string;
    createdAt: string;
    host: string;
    status: string;
    participants: number;
    maxParticipants: number;
    duration: string;
    description: string;
  };
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
  onUserClick?: (name: string) => void;
};

// SlideNotification
export type SlideNotificationProps = {
  message: string;
  visible: boolean;
  duration?: number;
  className?: string;
};
