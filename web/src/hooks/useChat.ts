import { useState, useEffect } from 'react';

export const useChat = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ user: string; text: string; timestamp: string }>>([
    { user: "시스템", text: "회의가 시작되었습니다.", timestamp: new Date().toISOString() }
  ]);
  const [input, setInput] = useState("");

  // 채팅방 외부 클릭 시 닫기 이벤트 리스너
  useEffect(() => {
    const handleCloseChatBox = () => {
      setChatOpen(false);
    };

    window.addEventListener('closeChatBox', handleCloseChatBox);
    return () => {
      window.removeEventListener('closeChatBox', handleCloseChatBox);
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      setMessages(prev => [...prev, {
        user: "나",
        text: input.trim(),
        timestamp: new Date().toISOString()
      }]);
      setInput("");
    }
  };

  const toggleChat = () => {
    setChatOpen(prev => !prev);
  };

  return {
    chatOpen,
    messages,
    input,
    setInput,
    sendMessage,
    toggleChat
  };
};