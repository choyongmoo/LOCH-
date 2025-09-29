import type { Friend, Message } from "@/types/workspace";

interface ChatWindowProps {
    friend?: Friend;
    messages?: Message[];
    input?: string;
}

export default function ChatWindow({ friend, messages = [], input }: ChatWindowProps) {
    return (
        <div className="flex flex-col flex-1 h-screen bg-gray-50 dark:bg-[#313338]">
            {/* 헤더 */}
            {friend && (
                <div className="flex items-center px-4 py-3 gap-3 border-b border-gray-200 dark:border-[#23272a] bg-white dark:bg-[#23272a]">
                    <div
                        className="w-9 h-9 rounded-md flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: friend.accent_color || "#7e22ce" }}
                    >
                        {friend.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-lg truncate">{friend.name}</span>
                </div>
            )}

            {/* 메시지 영역 */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-2 p-4">
                {messages.length === 0 ? (
                <div className="text-center text-gray-400 dark:text-gray-500 mt-10">
                    메시지가 없습니다. 대화를 시작해보세요!
                </div>
                ) : (
                    messages.map((msg, idx) => (
                        <div
                        key={idx}
                        className={`flex flex-col ${msg.sender === "me" ? "items-end" : "items-start"}`}
                        >
                        <div
                            className={`px-3 py-2 rounded-xl max-w-xs text-sm ${
                            msg.sender === "me"
                                ? "bg-indigo-500 text-white"
                                : "bg-gray-200 dark:bg-[#40444b] text-gray-800 dark:text-gray-200"
                            }`}
                    >
                        {msg.text}
                    </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    ))
                    )}
                </div>

            {/* 입력 영역 */}
            <div className="flex px-4 py-3 border-t border-gray-200 dark:border-[#23272a] bg-white dark:bg-[#23272a]">
                <input
                    type="text"
                    placeholder="메시지를 입력하세요..."
                    className="flex-1 px-3 py-2 rounded-md text-sm bg-gray-100 dark:bg-[#40444b] text-gray-900 dark:text-white outline-none"
                />
                <button className="ml-2 px-4 py-2 rounded-md bg-indigo-500 text-white font-semibold text-sm">
                    전송
                </button>
            </div>
        </div>
    );
}
