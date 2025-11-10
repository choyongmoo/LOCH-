import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useServers } from "@/store/useServersStore";
import { useJoinServer } from "@/store/useServersStore";
import { Button } from "../../common/ui/button";
import { ScrollArea } from "@/components/common/ui/scroll-area";

export type ModalPage = "main" | "create" | "search";

export default function CreateRoomModal({ close, userId }: { close: () => void, userId: string }) {
  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");
  const [maxParticipants, setMaxParticipants] = useState(1);
  const [isPrivate, setIsPrivate] = useState(true);
  const [password, setPassword] = useState("");
  const [page, setPage] = useState<ModalPage>("main");

  const addRoom = useServers((state) => state.addServer);
  const joinServer = useJoinServer((state) => state.joinServer);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [passwordInputs, setPasswordInputs] = useState<{ [key: string]: string }>({});
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    if (!roomName.trim()) {
      setErrorMessage("방 이름은 필수입니다.");
      setShowErrorModal(true);
      return;
    }
    if (maxParticipants < 1 || maxParticipants > 10) {
      setErrorMessage("최대 인원은 1~10명 사이여야 합니다.");
      setShowErrorModal(true);
      return;
    }
    if (isPrivate && !password.trim()) {
      setErrorMessage("비공개 서버는 비밀번호를 입력해야 합니다.");
      setShowErrorModal(true);
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: room, error } = await supabase
      .from("servers")
      .insert([{
        room_name: roomName,
        description,
        host: user.id,
        max_participants: maxParticipants,
        is_private: isPrivate,
        password: isPrivate ? password : null,
        status: "active",
      }])
      .select()
      .maybeSingle();

    if (error || !room) return console.error(error);

    const { data: profileData } = await supabase
      .from("profile")
      .select("nickname")
      .eq("id", user.id)
      .maybeSingle();

    addRoom({
      ...room,
      host_nickname: profileData?.nickname ?? "-",
    });
    
    close();
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const { data: serversData, error } = await supabase
        .rpc("search_servers", { search_text: searchQuery });

      if (error) throw error;

      const resultsWithCount = (serversData || []).filter((s: any) => {
        if (s.host === userId) return false;

        const activeMember = s.server_members?.find(
          (m: any) => m.user_id === userId && m.is_active
        );
        return !activeMember;
      }).map((s: any) => ({
        ...s,
        host_nickname: s.host_nickname ?? "-",
        currentParticipants: s.server_members?.filter((m: any) => m.is_active).length ?? 0,
      }));

      setSearchResults(resultsWithCount);
    } catch (err) {
      console.error("검색 실패:", err);
      setSearchResults([]);
    }
  };

  const handleJoin = async (server: any) => {
    
    if (server.is_private) {
      const entered = passwordInputs[server.id];
      if (entered !== server.password) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }
    }

    await joinServer(server.id, userId);
    await useServers.getState().fetchAllUserServers(userId);
    alert(`${server.room_name} 서버에 입장했습니다!`);
    close();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-[#36393f] p-6 rounded-2xl shadow-2xl w-[360px] text-white relative">
        {/* X 닫기 버튼 */}
        <button
          className="absolute top-2 right-2 px-4 py-4 text-gray-400 hover:text-white"
          onClick={close}
        >
          ✕
        </button>
        {/* 메인 페이지 */}
        {page === "main" && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-5">서버</h3>
            <button className="w-full py-2 bg-blue-600 rounded-md hover:bg-blue-700"
              onClick={() => setPage("create")}>새 서버 만들기</button>
            <button className="w-full py-2 bg-gray-600 rounded-md hover:bg-gray-500"
              onClick={() => setPage("search")}>서버 찾기</button>
          </div>
        )}

        {/* 서버 생성 페이지 */}
        {page === "create" && (
          <div className="space-y-4">
            <button className="text-sm text-gray-400 mb-2 hover:underline" onClick={() => setPage("main")}>← 뒤로가기</button>
            <h3 className="text-xl font-semibold mb-5">새 서버 만들기</h3>

            {/* 서버 이름 */}
            <div className="mb-4">
              <label className="block text-sm text-gray-300 mb-1">방 이름</label>
              <input type="text" placeholder="방 이름을 입력하세요" value={roomName} onChange={(e) => setRoomName(e.target.value)}
                className="w-full p-2 rounded-md border border-gray-600 bg-[#202225] text-white focus:outline-none focus:border-blue-500" />
            </div>

            {/* 소개 */}
            <div className="mb-4">
              <label className="block text-sm text-gray-300 mb-1">소개</label>
              <input type="text" placeholder="방을 소개해주세요!" value={description} onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 rounded-md border border-gray-600 bg-[#202225] text-white focus:outline-none focus:border-blue-500" />
            </div>

            {/* 최대 인원 */}
            <div className="mb-4">
              <label className="block text-sm text-gray-300 mb-1">최대 인원</label>
              <input type="number" value={maxParticipants} min={1} max={10} onChange={(e) => setMaxParticipants(Math.max(1, Math.min(10, Number(e.target.value))))}
                className="w-20 p-2 rounded-md border border-gray-600 bg-[#202225] text-white focus:outline-none focus:border-blue-500" />
              <span className="ml-2 text-gray-400 text-sm">1~10명</span>
            </div>

            {/* 공개 체크박스 */}
            <div className="mb-4 flex items-center gap-2">
              <input
                type="checkbox"
                checked={!isPrivate}
                onChange={(e) => setIsPrivate(!e.target.checked)} 
                className="w-4 h-4 accent-blue-500"
              />
              <label className="text-sm text-gray-300">공개 서버로 만들기</label>
            </div>

            {/* 비밀번호 입력 */}
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

            <div className="flex justify-end gap-3 mt-5">
              <Button className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 text-white" onClick={() => close()}>취소</Button>
              <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">확인</Button>
            </div>
          </div>
        )}

        {/* 서버 검색 페이지 */}
        {page === "search" && (
          <div className="space-y-4">
            <button className="text-sm text-gray-400 mb-2 hover:underline" onClick={() => setPage("main")}>← 뒤로가기</button>

            <h3 className="text-xl font-semibold mb-3">서버 찾기</h3>

            {/* 검색창 */}
            <div className="flex gap-2">
              <input type="text" placeholder="방 이름 또는 호스트 이름 입력" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3 py-2 rounded-md bg-[#202225] border border-gray-600 text-white outline-none focus:border-blue-500"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
              <button className="px-3 py-2 bg-blue-600 rounded-md font-semibold hover:bg-blue-500" onClick={handleSearch}>검색</button>
            </div>

              {/* 검색 결과 */}
              <ScrollArea className="h-64 w-full">
              {searchResults.length === 0 ? (
                <div className="text-gray-400 text-sm text-center py-6">검색 결과가 없습니다.</div>
              ) : (
                <div className="flex flex-col gap-2 p-2">
                  {searchResults.map((server) => (
                    <div key={server.id} className="flex flex-col gap-1 bg-gray-700 p-2 rounded-md">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold">{server.room_name}</div>
                          <div className="text-sm text-gray-400">호스트: {server.host_nickname}</div>
                          <div className="text-sm text-gray-400">참여자: {server.currentParticipants} / {server.max_participants}</div>
                        </div>
                        {server.is_private && <div className="text-yellow-300 font-bold text-xl">🔒</div>}
                      </div>

                      {server.is_private && (
                        <input
                          type="password"
                          placeholder="비밀번호 입력"
                          className="px-2 py-1 rounded-md bg-[#202225] border border-gray-600 text-white outline-none"
                          value={passwordInputs[server.id] || ""}
                          onChange={(e) => setPasswordInputs((prev) => ({ ...prev, [server.id]: e.target.value }))}
                        />
                      )}

                      <Button className="bg-blue-600 hover:bg-blue-700 text-white mt-1" onClick={() => handleJoin(server)}>참가</Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        )}
        {showErrorModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-[#202225] p-4 rounded-xl shadow-lg text-white w-[300px] text-center">
              <p>{errorMessage}</p>
              <Button
                className="mt-4 bg-blue-600 hover:bg-blue-700"
                onClick={() => setShowErrorModal(false)}
              >
                확인
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
