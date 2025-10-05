import { supabase } from "@/lib/supabase";
import { useUserStore } from "@/store/useUserStore";
import { useState } from "react";

export default function FriendAddModal({ close }: { close: () => void }) {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const currentUser = useUserStore((state) => state.user);

    const handleSearch = async () => {
        if (!search.trim()) return;
        setLoading(true);
        setError(null);

        const keyword = search.trim();

        try {
            const { data, error } = await supabase
            .from("profile")
            .select("id, nickname, email")
            .or(`nickname.ilike.%${keyword}%,email.ilike.%${keyword}%`) // encodeURIComponent 제거
            .neq("id", currentUser?.id);

            if (error) throw error;

            setResults(data || []);
        } catch (err: any) {
            console.error("검색 오류:", err);
            setError("검색 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const sendFriendRequest = async (targetId: string) => {
        if (!currentUser?.id) return;

        try {
            const { data: existing } = await supabase
                .from("friend_requests")
                .select("*")
                .or(`and(requester_id.eq.${currentUser.id},addressee_id.eq.${targetId}),and(requester_id.eq.${targetId},addressee_id.eq.${currentUser.id})`);

            if (existing && existing.length > 0) {
                alert("이미 친구 요청을 보냈거나 받은 상태입니다.");
                return;
            }

            const { error } = await supabase.from("friend_requests").insert({
                requester_id: currentUser.id,
                addressee_id: targetId,
                status: "pending", // enum 값
                created_at: new Date().toISOString(),
                responded_at: null,
            });

            if (error) throw error;
            alert("친구 요청을 보냈습니다!");
        } catch (err: any) {
            console.error(err);
            alert("친구 요청 실패: 이미 요청했거나 오류가 발생했습니다.");
        }
    };
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 text-white w-96 rounded-xl p-4 shadow-lg flex flex-col gap-3">
                {/* 타이틀 */}
                <h2 className="text-lg font-bold">친구 추가</h2>
                <p className="text-sm text-gray-400">이메일 또는 이름 일부를 입력하세요.</p>

                {/* 검색창 */}
                <div className="flex gap-2">
                    <input
                        className="flex-1 px-3 py-2 rounded-md bg-gray-700 border border-gray-600 outline-none"
                        placeholder="이메일 또는 이름"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <button 
                        className="px-3 py-2 bg-blue-600 rounded-md font-semibold hover:bg-blue-500"
                        onClick={handleSearch}
                        disabled={loading}
                    >
                        {loading ? "검색중..." : "검색"}
                    </button>
                </div>

                {/* 검색 결과 */}
                <div className="max-h-64 overflow-y-auto flex flex-col gap-2">
                    {error && <div className="text-red-400 text-sm">{error}</div>}
                    {!error && !loading && results.length === 0 && (
                        <div className="text-center text-gray-400 text-sm">
                            검색 결과가 없습니다.
                        </div>
                    )}
                    {results.map((user) => (
                        <div
                            key={user.id}
                            className="flex items-center justify-between bg-gray-700 p-2 rounded-md"
                        >
                            <div>
                                <div className="font-semibold">{user.nickname}</div>
                                <div className="text-sm text-gray-400">{user.email}</div>
                            </div>
                            <button
                                onClick={() => sendFriendRequest(user.id)}
                                className="px-2 py-1 bg-green-600 rounded-md text-sm hover:bg-green-500"
                            >
                                요청
                            </button>
                        </div>
                    ))}
                </div>

                {/* 닫기 버튼 */}
                <div className="flex justify-end mt-2">
                    <button 
                        onClick={close}
                        className="px-3 py-2 bg-gray-600 rounded-md font-semibold hover:bg-gray-500">
                            닫기
                    </button>
                </div>
            </div>
        </div>
    );
}
