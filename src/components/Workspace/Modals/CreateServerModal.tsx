import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useServers } from "@/store/useServers";
import { useNavigate } from "react-router";
import { Button } from "../../common/ui/button";

export default function CreateRoomModal({ close }: { close: () => void }) {
    const [roomName, setRoomName] = useState("");
    const [description, setDescription] = useState("");
    const [maxParticipants, setMaxParticipants] = useState(1);
    const [isPrivate, setIsPrivate] = useState(false);
    const [password, setPassword] = useState("");
    const addRoom = useServers((state) => state.addServer);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!roomName.trim()) 
            return alert("방 이름은 필수입니다.");
        if (maxParticipants < 1 || maxParticipants > 10)
            return alert("최대 인원은 1~10명 사이여야 합니다.");

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: room, error } = await supabase
        .from("servers")
        .insert([
            {
            room_name: roomName,
            description,
            host: user.id,
            max_participants: maxParticipants,
            is_private: isPrivate,
            password: isPrivate ? password : null,
            status: "active",
            },
        ])
        .select()
        .single();

        if (error || !room) return console.error(error);

        addRoom(room);
        close();
        navigate(`/workspace/${room.id}`);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-[#36393f] p-6 rounded-2xl shadow-2xl w-[360px] text-white">
                <h3 className="text-xl font-semibold mb-5">새 서버 만들기</h3>

                {/* 서버 이름 */}
                <div className="mb-4">
                    <label className="block text-sm text-gray-300 mb-1">방 이름</label>
                    <input
                        type="text"
                        placeholder="방 이름을 입력하세요"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        className="w-full p-2 rounded-md border border-gray-600 bg-[#202225] text-white focus:outline-none focus:border-blue-500"
                    />
                </div>

                {/* 소개 */}
                <div className="mb-4">
                    <label className="block text-sm text-gray-300 mb-1">소개</label>
                    <input
                        type="text"
                        placeholder="방을 소개해주세요!"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 rounded-md border border-gray-600 bg-[#202225] text-white focus:outline-none focus:border-blue-500"
                    />
                </div>

                {/* 최대 인원 */}
                <div className="mb-4">
                    <label className="block text-sm text-gray-300 mb-1">최대 인원</label>
                    <input
                        type="number"
                        value={maxParticipants}
                        min={1}
                        max={10}
                        onChange={(e) =>
                        setMaxParticipants(Math.max(1, Math.min(10, Number(e.target.value))))
                        }
                        className="w-20 p-2 rounded-md border border-gray-600 bg-[#202225] text-white focus:outline-none focus:border-blue-500"
                    />
                    <span className="ml-2 text-gray-400 text-sm">1~10명</span>
                </div>

                {/* 비공개 체크 */}
                <div className="mb-4 flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={isPrivate}
                        onChange={(e) => setIsPrivate(e.target.checked)}
                        className="w-4 h-4 accent-blue-500"
                    />
                    <label className="text-sm text-gray-300">비공개</label>
                </div>

                {/* 비밀번호 */}
                {isPrivate && (
                    <div className="mb-4">
                        <label className="block text-sm text-gray-300 mb-1">비밀번호</label>
                        <input
                        type="text"
                        placeholder="비밀번호 입력"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 rounded-md border border-gray-600 bg-[#202225] text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                )}

                {/* 버튼 */}
                <div className="flex justify-end gap-3 mt-5">
                    <button
                        className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500"
                        onClick={close}
                    >
                        취소
                    </button>
                    <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                        확인
                    </Button>
                </div>
            </div>
        </div>
    );
}
