import React, { useState } from "react";
import { useThemeStore } from "@/store/themeStore";

// FriendItem 컴포넌트
interface FriendItemProps {
  name: string;
  avatarUrl: string;
  selected: boolean;
  onClick: () => void;
}

const FriendItem: React.FC<FriendItemProps & { theme: 'dark' | 'light' }> = ({ name, avatarUrl, selected, onClick, theme }) => {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 12px',
        gap: 12,
        background: selected ? (theme === 'dark' ? '#393c41' : '#e5e7eb') : 'transparent',
        cursor: 'pointer',
        borderRadius: 6,
        margin: '2px 4px',
      }}
    >
      <img
        src={avatarUrl}
        alt={name}
        style={{ width: 32, height: 32, borderRadius: '50%', marginRight: 12 }}
      />
      <span style={{ fontSize: 16, color: theme === 'dark' ? '#fff' : '#23272a' }}>{name}</span>
    </div>
  );
};

// FriendsSidebar 컴포넌트
const friends = [
  { name: "Hyeon", avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg" },
  { name: "황자준", avatarUrl: "https://randomuser.me/api/portraits/men/34.jpg" },
  { name: "용무", avatarUrl: "https://randomuser.me/api/portraits/men/35.jpg" },
];

interface FriendsSidebarProps {
  selectedFriend: string | null;
  onSelect: (name: string) => void;
}

const FriendsSidebar: React.FC<FriendsSidebarProps> = ({ selectedFriend, onSelect }) => {
  const { theme } = useThemeStore();
  return (
    <aside
      style={{
        width: 260,
        background: theme === 'dark' ? '#1E1F2B' : '#f3f4f6',
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        borderRight: theme === 'dark' ? "1px solid #2c2f33" : "1px solid #e5e7eb",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", padding: "16px 12px", gap: 8 }}>
        <span style={{ color: theme === 'dark' ? "#fff" : "#23272a", fontWeight: 700, fontSize: 18 }}>친구</span>
        <button
          style={{
            marginLeft: "auto",
            background: theme === 'dark' ? "#5865f2" : "#e0e7ff",
            color: theme === 'dark' ? "#fff" : "#23272a",
            border: "none",
            borderRadius: 4,
            padding: "6px 14px",
            fontWeight: 500,
            cursor: "pointer",
            fontSize: 14,
          }}
        >친구 추가하기</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {friends.map((friend) => (
          <FriendItem
            key={friend.name}
            name={friend.name}
            avatarUrl={friend.avatarUrl}
            selected={selectedFriend === friend.name}
            onClick={() => onSelect(friend.name)}
            theme={theme}
          />
        ))}
      </div>
    </aside>
  );
};

// ChatBox 컴포넌트
interface Message {
  sender: string;
  text: string;
  timestamp: number;
}

interface ChatBoxProps {
  friend: { name: string; avatarUrl: string };
  messages: Message[];
  onSend: (text: string) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ friend, messages, onSend }) => {
  const [input, setInput] = useState("");
  const { theme } = useThemeStore();

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: theme === 'dark' ? '#313338' : '#f4f4f4', flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px', borderBottom: theme === 'dark' ? '1px solid #23272a' : '1px solid #e5e7eb', gap: 12, background: theme === 'dark' ? '#23272a' : '#fff' }}>
        <img src={friend.avatarUrl} alt={friend.name} style={{ width: 36, height: 36, borderRadius: '50%' }} />
        <span style={{ color: theme === 'dark' ? '#fff' : '#23272a', fontWeight: 600, fontSize: 18 }}>{friend.name}</span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.length === 0 ? (
          <span style={{ color: theme === 'dark' ? '#aaa' : '#666', textAlign: 'center', marginTop: 40 }}>메시지가 없습니다. 대화를 시작해보세요!</span>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'me' ? 'flex-end' : 'flex-start' }}>
              <div
                style={{
                  background: msg.sender === 'me'
                    ? (theme === 'dark' ? '#5865f2' : '#6366f1')
                    : (theme === 'dark' ? '#40444b' : '#e5e7eb'),
                  color: theme === 'dark' ? '#fff' : '#23272a',
                  borderRadius: 12,
                  padding: '8px 14px',
                  maxWidth: 320,
                  fontSize: 15,
                }}
              >
                {msg.text}
              </div>
              <span style={{ fontSize: 11, color: theme === 'dark' ? '#888' : '#999', marginTop: 2 }}>
                {new Date(msg.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleSend} style={{ display: 'flex', padding: '16px', borderTop: theme === 'dark' ? '1px solid #23272a' : '1px solid #e5e7eb', background: theme === 'dark' ? '#23272a' : '#fff' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="메시지를 입력하세요..."
          style={{
            flex: 1,
            border: 'none',
            borderRadius: 6,
            padding: '10px 14px',
            fontSize: 15,
            outline: 'none',
            background: theme === 'dark' ? '#40444b' : '#f1f5f9',
            color: theme === 'dark' ? '#fff' : '#23272a',
          }}
        />
        <button
          type="submit"
          style={{
            marginLeft: 8,
            background: theme === 'dark' ? '#5865f2' : '#6366f1',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '10px 18px',
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
          }}
        >전송</button>
      </form>
    </div>
  );
};

export default function ContactPage() {
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  // 친구별 메시지 상태 관리
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const { theme } = useThemeStore();

  const handleSend = (text: string) => {
    if (!selectedFriend) return;
    setMessages(prev => ({
      ...prev,
      [selectedFriend]: [
        ...(prev[selectedFriend] || []),
        { sender: 'me', text, timestamp: Date.now() },
      ],
    }));
  };

  const selectedFriendObj = friends.find(f => f.name === selectedFriend) || null;

  return (
    <div className={theme === 'dark' ? 'theme-dark' : 'theme-light'} style={{ display: 'flex', height: '100vh', width: 'calc(83.7vw)', background: theme === 'dark' ? '#313338' : '#f4f4f4', position: 'relative' }}>
      <FriendsSidebar selectedFriend={selectedFriend} onSelect={setSelectedFriend} />
      <div style={{ flex: 1, minWidth: 0 }}>
        {selectedFriendObj ? (
          <ChatBox
            friend={selectedFriendObj}
            messages={messages[selectedFriendObj.name] || []}
            onSend={handleSend}
          />
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme === 'dark' ? '#aaa' : '#333', fontSize: 20 }}>
            채팅할 친구를 선택하세요.
          </div>
        )}
      </div>
    </div>
  );
}