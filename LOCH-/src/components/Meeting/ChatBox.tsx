import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { ChatMessage, ChatBoxProps } from "@/pages/Meeting/ResizableLayout/types";

function formatDateTime(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}`
  );
}

export const ChatBox = ({ messages, input, setInput, onSend }: ChatBoxProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<"all" | "user" | "text" | "date">("all");
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [searchIndex, setSearchIndex] = useState(0);

  useEffect(() => {
    if (searchTerm === "") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, searchTerm]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setSearchIndex(0);
      return;
    }

    const lowerTerm = searchTerm.toLowerCase();

    if (searchType === "date") {
      const fullDateRegex = /^\d{4}-\d{2}-\d{2}$/;
      const shortDateRegex = /^\d{1,2}-\d{1,2}$/;

      if (!fullDateRegex.test(searchTerm.trim()) && !shortDateRegex.test(searchTerm.trim())) {
        setSearchResults([]);
        setSearchIndex(0);
        return;
      }

      const term = searchTerm.trim();

      const results = messages
        .map((msg, idx) => {
          const d = new Date(msg.timestamp);
          const month = d.getMonth() + 1; // 1~12
          const day = d.getDate(); // 1~31
          const fullDateStr = msg.timestamp.slice(0, 10); // YYYY-MM-DD
          const shortDateStr = `${month}-${day}`; // M-D

          if (fullDateRegex.test(term)) {
            return fullDateStr === term ? idx : -1;
          }
          if (shortDateRegex.test(term)) {
            return shortDateStr === term ? idx : -1;
          }
          return -1;
        })
        .filter((idx) => idx !== -1);

      setSearchResults(results);
      setSearchIndex(0);
      return;
    }

    const results = messages
      .map((msg, idx) => {
        if (searchType === "user") {
          return msg.user.toLowerCase().includes(lowerTerm) ? idx : -1;
        }
        if (searchType === "text") {
          return msg.text.toLowerCase().includes(lowerTerm) ? idx : -1;
        }
        // all
        return (
          msg.user.toLowerCase().includes(lowerTerm) ||
          msg.text.toLowerCase().includes(lowerTerm)
        )
          ? idx
          : -1;
      })
      .filter((idx) => idx !== -1);

    setSearchResults(results);
    setSearchIndex(0);
  }, [searchTerm, searchType, messages]);

  useEffect(() => {
    if (searchResults.length === 0) return;
    const idx = searchResults[searchIndex];
    const container = containerRef.current;
    if (!container) return;
    const messageElements = container.querySelectorAll(".chat-message");
    if (idx < 0 || idx >= messageElements.length) return;

    const targetElement = messageElements[idx] as HTMLElement;
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [searchIndex, searchResults]);

  const goNext = () => {
    if (searchResults.length === 0) return;
    setSearchIndex((prev) => (prev + 1) % searchResults.length);
  };

  const goPrev = () => {
    if (searchResults.length === 0) return;
    setSearchIndex((prev) =>
      prev === 0 ? searchResults.length - 1 : prev - 1
    );
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setSearchIndex(0);
  };

  return (
    <motion.div
      key="chatbox"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ duration: 0.3 }}
      className="w-96 h-[420px] bg-[#2F3136] rounded-2xl shadow-lg flex flex-col p-4 text-white fixed bottom-18 right-4 z-60"
    >
      <div
        className="mb-2 flex items-center gap-2 whitespace-nowrap"
        style={{ flexWrap: "nowrap" }}
      >
        <input
          type="text"
          placeholder="검색어 입력..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow rounded px-2 py-1 bg-[#40444B] text-white focus:outline-none text-sm"
          style={{ minWidth: "0" }}
        />
        <select
          value={searchType}
          onChange={(e) =>
            setSearchType(e.target.value as "all" | "user" | "text" | "date")
          }
          className="bg-[#40444B] text-white rounded px-2 py-1 text-sm cursor-pointer"
          style={{ flexShrink: 0 }}
          aria-label="검색 타입 선택"
        >
          <option value="all">전체</option>
          <option value="user">유저명</option>
          <option value="text">키워드</option>
          <option value="date">날짜</option>
        </select>

        {searchResults.length > 0 && (
          <div className="flex items-center space-x-1 text-sm">
            <button
              onClick={goPrev}
              className="px-2 py-1 bg-[#5865F2] rounded hover:bg-[#4752c4] transition"
              aria-label="이전 검색 결과"
              style={{ flexShrink: 0 }}
            >
              ◀
            </button>
            <span className="select-none">
              {searchIndex + 1} / {searchResults.length}
            </span>
            <button
              onClick={goNext}
              className="px-2 py-1 bg-[#5865F2] rounded hover:bg-[#4752c4] transition"
              aria-label="다음 검색 결과"
              style={{ flexShrink: 0 }}
            >
              ▶
            </button>
          </div>
        )}
        <button
          onClick={clearSearch}
          className="px-2 py-1 rounded transition text-white bg-[#ed4245] hover:bg-[#f04747]"
          aria-label="검색 초기화"
          style={{ flexShrink: 0 }}
        >
          ✕
        </button>
      </div>
      <div
        ref={containerRef}
        className="flex-grow overflow-y-auto mb-2 space-y-2"
      >
        {messages.length === 0 ? (
          <div className="text-gray-400 text-sm italic">채팅이 없습니다.</div>
        ) : (
          <>
            {messages.map(({ user, text, timestamp }, i) => {
              const isHighlighted =
                searchResults.includes(i) &&
                i === searchResults[searchIndex];
              return (
                <div
                  key={i}
                  className={`break-words chat-message ${
                    isHighlighted ? "bg-yellow-600 bg-opacity-40 rounded p-1" : ""
                  }`}
                >
                  <span className="text-xs text-gray-400 mr-1 select-none">
                    [{formatDateTime(timestamp)}]
                  </span>
                  <span className="font-semibold text-[#7289DA]">{user}: </span>
                  <span>{text}</span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow rounded px-2 py-1 bg-[#40444B] text-white focus:outline-none"
          placeholder="메시지 입력..."
          onKeyDown={(e) => e.key === "Enter" && onSend()}
        />
        <button
          onClick={onSend}
          className="bg-[#5865F2] px-4 rounded text-white hover:bg-[#4752c4] transition"
        >
          전송
        </button>
      </div>
    </motion.div>
  );
};
