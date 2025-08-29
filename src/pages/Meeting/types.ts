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

// Supabase 연동 타입들
export interface Meeting {
  id: string;
  name: string;
  description?: string;
  host_id: number;
  max_participants: number;
  status: 'active' | 'ended' | 'scheduled';
  created_at: string;
  started_at?: string;
  ended_at?: string;
}

export interface MeetingMember {
  id: number;
  meeting_id: string;
  user_id: number;
  role: 'host' | 'participant' | 'observer';
  is_active: boolean;
  joined_at: string;
  left_at?: string;
}

export interface MeetingMessage {
  id: number;
  meeting_id: string;
  sender_id: number;
  content: string;
  message_type: 'general' | 'private' | 'system';
  receiver_id?: number;
  created_at: string;
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
  role: string;
}

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
