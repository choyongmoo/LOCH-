import { useState, useRef, useEffect } from "react";
import { useChatMessages } from "../hooks/useChatMessages";
import { useRealtimeMessages } from "../hooks/useRealtimeMessages";
import { sendMessage } from "../hooks/sendMessage";
import { ScrollArea } from "@/components/common/ui/scroll-area";
import type { Friend } from "@/types/workspace";
import { useNavigate } from "react-router-dom";

interface ChatWindowProps {
  currentUserId?: string;
  selectedFriend?: Friend | null;
}

export default function ChatWindow({ currentUserId, selectedFriend }: ChatWindowProps) {
  const { messages, addMessage } = useChatMessages(currentUserId, selectedFriend);
  useRealtimeMessages(currentUserId, selectedFriend, addMessage);

  const [input, setInput] = useState("");
  const viewportRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!currentUserId || !selectedFriend || !input.trim()) return;
    await sendMessage(input.trim(), currentUserId, selectedFriend, addMessage);
    setInput("");
  };

  const renderMessageText = (msg: any) => {
  if (msg.type === "server_invite" && msg.serverId) {
    return (
      <button
        type="button"
        className="text-blue-500 underline cursor-pointer bg-transparent p-0"
        onClick={() => navigate(`/workspace/invite/${msg.serverId}`)}
      >
        {msg.text}
      </button>
    );
  }

  return msg.text.split(" ").map((word: string, i: number) => {
    if (word.startsWith("http://") || word.startsWith("https://")) {
      return (
        <a
          key={i}
          href={word}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-blue-500 hover:text-blue-400"
        >
          {word}{" "}
        </a>
      );
    }
    return word + " ";
  });
};

  return (
    <div className="flex flex-col flex-1 h-screen bg-gray-50 dark:bg-[#313338]">
      {selectedFriend && (
        <div className="flex items-center px-4 py-3 gap-3 border-b border-gray-200 dark:border-[#23272a] bg-white dark:bg-[#23272a]">
          <div
            className="w-9 h-9 rounded-md flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: selectedFriend.accent_color || "#7e22ce" }}
          >
            {selectedFriend.nickname.charAt(0).toUpperCase()}
          </div>
          <span className="font-semibold text-lg truncate">{selectedFriend.nickname}</span>
        </div>
      )}

      <ScrollArea className="flex-1" viewportRef={viewportRef}>
        <div className="flex flex-col gap-2 p-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 dark:text-gray-500 mt-10">
              메시지가 없습니다. 대화를 시작해보세요!
            </div>
          ) : (
            messages.map((msg, idx) => {
              const currentDate = new Date(msg.timestamp);
              const prevDate = idx > 0 ? new Date(messages[idx - 1].timestamp) : null;
              const isNewDay = !prevDate || currentDate.toDateString() !== prevDate.toDateString();

              return (
                <div key={idx}>
                  {isNewDay && (
                    <div className="flex items-center my-3">
                      <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
                      <span className="mx-2 text-xs text-gray-500 dark:text-gray-400">
                        {currentDate.toLocaleDateString("ko-KR", {
                          month: "long",
                          day: "numeric",
                          weekday: "short",
                        })}
                      </span>
                      <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
                    </div>
                  )}

                  <div className={`flex flex-col ${msg.sender === "me" ? "items-end" : "items-start"}`}>
                    <div
                      className={`px-3 py-2 rounded-xl max-w-xs text-sm ${
                        msg.sender === "me"
                          ? "bg-indigo-500 text-white"
                          : "bg-gray-200 dark:bg-[#40444b] text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {renderMessageText(msg)}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {currentDate.toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      <div className="flex px-4 py-3 border-t border-gray-200 dark:border-[#23272a] bg-white dark:bg-[#23272a]">
        <input
          type="text"
          placeholder="메시지를 입력하세요..."
          className="flex-1 px-3 py-2 rounded-md text-sm bg-gray-100 dark:bg-[#40444b] text-gray-900 dark:text-white outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="ml-2 px-4 py-2 rounded-md bg-indigo-500 text-white font-semibold text-sm"
        >
          전송
        </button>
      </div>
    </div>
  );
}
