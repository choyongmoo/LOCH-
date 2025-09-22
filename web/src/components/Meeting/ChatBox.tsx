import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import type { ChatBoxProps } from "@/types/meeting";

function formatDateTime(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export const ChatBox = ({ 
  messages, 
  input, 
  setInput, 
  onSend, 
  privateChatTabs,
  activeTab,
  onSetActiveTab,
  onClosePrivateTab,
  privateMessages: externalPrivateMessages,
  onSetPrivateMessages,
  unreadMessages: externalUnreadMessages,
  onSetUnreadMessages,
  unreadGeneralMessages
}: ChatBoxProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<"all" | "user" | "text" | "date">("all");
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [searchIndex, setSearchIndex] = useState(0);
  const [isResizing, setIsResizing] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // 개인 메시지 관련 상태
  const privateMessages = externalPrivateMessages || {};
  const unreadMessages = externalUnreadMessages || {};
  
  // localStorage에서 저장된 크기 불러오기
  const getSavedSize = () => {
    const saved = localStorage.getItem('chatBoxSize');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { width: parsed.width || 420, height: parsed.height || 480 };
    }
    return { width: 420, height: 480 }; // 기본 크기 - 검색 UI를 고려하여 증가
  };
  
  const [size, setSize] = useState(getSavedSize);
  const resizeRef = useRef<HTMLDivElement>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  // 최소 크기 설정 - 검색창 UI가 제대로 표시되도록 크기 증가
  const minWidth = 400;  // 280 -> 400 (검색창, 드롭다운, 네비게이션, X버튼이 모두 표시되도록)
  const minHeight = 450; // 350 -> 450 (검색창이 추가될 때 충분한 높이 확보)

  // 크기가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('chatBoxSize', JSON.stringify(size));
  }, [size]);

  // 채팅방 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatBoxRef.current && !chatBoxRef.current.contains(event.target as Node)) {
        // 채팅 버튼 클릭은 제외
        const target = event.target as HTMLElement;
        if (target.closest('button[aria-label="Toggle Chat"]')) {
          return;
        }
        
        // 채팅방 외부 클릭 시 닫기 이벤트 발생
        const closeEvent = new CustomEvent('closeChatBox');
        window.dispatchEvent(closeEvent);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);



  useEffect(() => {
    if (searchTerm === "") {
      if (activeTab === 'general') {
        // 전체 채팅은 항상 맨 아래로
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      } else {
        // 개인 채팅은 읽지 않은 메시지가 있는지 확인
        const currentUnread = unreadMessages[activeTab] || 0;
        if (currentUnread > 0) {
          // 읽지 않은 메시지가 있으면 해당 위치로 스크롤
          const messages = privateMessages[activeTab] || [];
          const unreadStartIndex = Math.max(0, messages.length - currentUnread);
          const unreadElement = document.querySelector(`[data-message-index="${unreadStartIndex}"]`);
          if (unreadElement) {
            unreadElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            // 읽지 않은 메시지 위치를 찾을 수 없으면 맨 아래로
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }
        } else {
          // 읽지 않은 메시지가 없으면 맨 아래로
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  }, [messages, privateMessages, activeTab, unreadMessages, searchTerm]);

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
    setIsSearchOpen(false);
  };

  // 개인 메시지가 없으면 초기화
  useEffect(() => {
    privateChatTabs.forEach(tab => {
      if (!privateMessages[tab] && onSetPrivateMessages) {
        onSetPrivateMessages({
          ...privateMessages,
          [tab]: []
        });
      }
    });
  }, [privateChatTabs, privateMessages, onSetPrivateMessages]);

  const sendPrivateMessage = () => {
    if (activeTab === 'general' || !input.trim() || !onSetPrivateMessages) return;
    
    const newMessage = {
      user: '홍길동', // 현재 사용자 (실제로는 props로 받아야 함)
      text: input,
      timestamp: new Date().toISOString()
    };
    
    onSetPrivateMessages({
      ...privateMessages,
      [activeTab]: [...(privateMessages[activeTab] || []), newMessage]
    });
    
    setInput('');
  };





  // 현재 표시할 메시지 결정
  const currentMessages = activeTab === 'general' 
    ? messages
    : (privateMessages[activeTab] || []);

  // 날짜별로 메시지 그룹화 및 날짜 구분선 추가
  const messagesWithDateSeparators = currentMessages.reduce((acc: any[], message: any, index: number) => {
    const messageDate = new Date(message.timestamp);
    const messageDateStr = messageDate.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // 첫 번째 메시지이거나 이전 메시지와 날짜가 다른 경우 날짜 구분선 추가
    if (index === 0 || 
        new Date(currentMessages[index - 1].timestamp).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }) !== messageDateStr) {
      acc.push({
        type: 'date-separator',
        date: messageDateStr,
        key: `date-${index}`
      });
    }

    acc.push({
      ...message,
      type: 'message',
      key: `message-${index}`
    });

    return acc;
  }, []);

  // 리사이즈 핸들러
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !chatBoxRef.current) return;

      const chatBoxRect = chatBoxRef.current.getBoundingClientRect();
      
      // 채팅방의 현재 위치를 기준으로 새로운 크기 계산
      const newWidth = Math.max(minWidth, chatBoxRect.right - e.clientX);
      const newHeight = Math.max(minHeight, chatBoxRect.bottom - e.clientY);

      setSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, minWidth, minHeight]);

  return (
    <motion.div
      ref={chatBoxRef}
      key="chatbox"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ duration: 0.3 }}
      className="bg-[#2F3136] rounded-lg shadow-xl flex flex-col text-white fixed right-4 z-50 border border-[#202225]"
      style={{ 
        width: size.width, 
        height: size.height,
        cursor: isResizing ? 'nw-resize' : 'default'
      }}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between p-3 border-b border-[#202225] bg-[#292B2F] rounded-t-lg">
        <div className="flex items-center space-x-2">
          {/* 리사이즈 핸들 - 왼쪽으로 이동 */}
          <div
            ref={resizeRef}
            className="w-4 h-4 cursor-nw-resize"
            onMouseDown={handleMouseDown}
            style={{
              background: 'linear-gradient(135deg, transparent 50%, #72767D 50%)',
              borderRadius: '0.25rem 0 0 0'
            }}
          />
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          
          {/* 탭 UI - 스크롤 가능 */}
          <div className="flex-1 overflow-x-auto">
            <div className="flex items-center space-x-1 min-w-max px-1">
              {/* 전체 탭 */}
              <button
                onClick={() => {
                  onSetActiveTab('general');
                }}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors whitespace-nowrap relative ${
                  activeTab === 'general'
                    ? 'bg-[#5865F2] text-white'
                    : 'text-[#72767D] hover:text-[#DCDDDE] hover:bg-[#40444B]'
                }`}
              >
                전체
                {/* 읽지 않은 메시지 배지 */}
                {(unreadGeneralMessages || 0) > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {(unreadGeneralMessages || 0) > 99 ? '99+' : (unreadGeneralMessages || 0)}
                  </span>
                )}
              </button>
              
              {/* 개인 채팅 탭들 */}
              {privateChatTabs.map(tabUser => (
                <div key={tabUser} className="flex items-center">
                  <button
                    onClick={() => {
                      onSetActiveTab(tabUser);
                      // 탭을 클릭하면 읽지 않은 메시지 초기화
                      if (onSetUnreadMessages) {
                        onSetUnreadMessages({
                          ...unreadMessages,
                          [tabUser]: 0
                        });
                      }
                    }}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors flex items-center space-x-1 whitespace-nowrap relative ${
                      activeTab === tabUser
                        ? 'bg-[#5865F2] text-white'
                        : 'text-[#72767D] hover:text-[#DCDDDE] hover:bg-[#40444B]'
                    }`}
                  >
                    <span>{tabUser}</span>
                    {/* 읽지 않은 메시지 배지 */}
                    {(unreadMessages[tabUser] || 0) > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                        {(unreadMessages[tabUser] || 0) > 99 ? '99+' : (unreadMessages[tabUser] || 0)}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClosePrivateTab(tabUser);
                    }}
                    className="ml-1 px-1 py-1 hover:bg-red-500 rounded text-[#72767D] hover:text-white text-xs transition-colors"
                    title={`${tabUser}와의 개인 채팅 닫기`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          {/* 검색 토글 버튼 */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`p-1.5 rounded transition-colors ${
              isSearchOpen 
                ? 'bg-[#5865F2] text-white' 
                : 'text-[#72767D] hover:text-[#DCDDDE] hover:bg-[#40444B]'
            }`}
            title="검색"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* 검색 바 */}
      {isSearchOpen && (
        <div className="p-3 border-b border-[#202225] bg-[#292B2F]">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="검색어 입력..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-[#40444B] text-white rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#5865F2]"
            />
            <select
              value={searchType}
              onChange={(e) =>
                setSearchType(e.target.value as "all" | "user" | "text" | "date")
              }
              className="px-2 py-1.5 bg-[#40444B] text-white rounded text-sm cursor-pointer focus:outline-none"
            >
              <option value="all">전체</option>
              <option value="user">유저명</option>
              <option value="text">키워드</option>
              <option value="date">날짜</option>
            </select>

            {searchResults.length > 0 && (
              <div className="flex items-center space-x-1 text-xs">
                <button
                  onClick={goPrev}
                  className="px-2 py-1 bg-[#5865F2] rounded hover:bg-[#4752c4] transition"
                >
                  ◀
                </button>
                <span className="text-[#72767D]">
                  {searchIndex + 1} / {searchResults.length}
                </span>
                <button
                  onClick={goNext}
                  className="px-2 py-1 bg-[#5865F2] rounded hover:bg-[#4752c4] transition"
                >
                  ▶
                </button>
              </div>
            )}
            
            <button
              onClick={clearSearch}
              className="px-2 py-1.5 bg-[#ed4245] text-white rounded hover:bg-[#f04747] transition text-sm"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 메시지 영역 */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-3 space-y-3"
      >
        {currentMessages.length === 0 ? (
          <div className="text-center text-[#72767D] text-sm py-8">
            <div className="text-2xl mb-2">💬</div>
            <div>아직 메시지가 없습니다.</div>
            <div className="text-xs mt-1">첫 번째 메시지를 보내보세요!</div>
          </div>
        ) : (
          <>
            {messagesWithDateSeparators.map((item, i) => {
              if (item.type === 'date-separator') {
                return (
                  <div key={item.key} className="flex items-center justify-center my-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 h-px bg-[#4F545C]"></div>
                      <span className="text-xs text-[#72767D] font-medium px-3 py-1 bg-[#2F3136] rounded-full">
                        {item.date}
                      </span>
                      <div className="flex-1 h-px bg-[#4F545C]"></div>
                    </div>
                  </div>
                );
              }

              const { user, text, timestamp } = item;
              const originalIndex = currentMessages.findIndex(msg => 
                msg.user === user && msg.text === text && msg.timestamp === timestamp
              );
              const isHighlighted =
                searchResults.includes(originalIndex) &&
                originalIndex === searchResults[searchIndex];

              return (
                <div
                  key={item.key}
                  data-message-index={originalIndex}
                  className={`chat-message ${
                    isHighlighted ? "bg-yellow-500 bg-opacity-20 rounded-lg p-2 border border-yellow-500" : ""
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {/* 사용자 아바타 */}
                    <div className="w-8 h-8 rounded-full bg-[#5865F2] flex items-center justify-center text-xs font-semibold text-white flex-shrink-0">
                      {user.slice(0, 2)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      {/* 사용자명과 시간 */}
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-[#DCDDDE] text-sm">{user}</span>
                        <span className="text-xs text-[#72767D]">{formatDateTime(timestamp)}</span>
                      </div>
                      
                      {/* 메시지 내용 */}
                      <div className="text-[#DCDDDE] text-sm break-words">
                        {text}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* 입력 영역 */}
      <div className="p-3 border-t border-[#202225] bg-[#292B2F] rounded-b-lg">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-3 py-2 bg-[#40444B] text-white rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#5865F2]"
            placeholder="메시지 입력..."
            onKeyDown={(e) => e.key === "Enter" && (activeTab === 'general' ? onSend() : sendPrivateMessage())}
          />
          <button
            onClick={activeTab === 'general' ? onSend : sendPrivateMessage}
            className="px-4 py-2 bg-[#5865F2] text-white rounded-lg hover:bg-[#4752c4] transition-colors text-sm font-medium"
          >
            전송
          </button>
        </div>
      </div>
    </motion.div>
  );
};
