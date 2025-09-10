import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import AddGroupButton from "./AddGroupButton"
import GroupItem from "./GroupItem"
import { Moon, Sun, Power } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { Button } from "../../common/ui/button";
import { Input } from "@/components/common/ui/input";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/common/ui/skeleton";

const MiniSidebar = () => {
  const navigate = useNavigate();
  type MeetingItem = { id: string; room_name: string; description: string | null };
  const [meetings, setMeetings] = useState<MeetingItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [skeletonCount, setSkeletonCount] = useState<number>(0);
  const [isNameModalOpen, setIsNameModalOpen] = useState<boolean>(false);
  const [showAllServers, setShowAllServers] = useState<boolean>(false);
  const [serverSearch, setServerSearch] = useState<string>("");
  const [confirmNavigate, setConfirmNavigate] = useState<{ open: boolean; meetingId: string | null; meetingName: string | null }>({ open: false, meetingId: null, meetingName: null });
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState<boolean>(false);
  const [myUserUuid, setMyUserUuid] = useState<string | null>(null);
  const [newGroupName, setNewGroupName] = useState<string>("");
  const [newGroupDescription, setNewGroupDescription] = useState<string>("");
  const { toggleTheme } = useThemeStore();
  const handleLogout = async () => {
    try {
      try {
        localStorage.removeItem('home:selectedMeeting');
        Object.keys(localStorage).forEach((k) => { if (k.startsWith('home:memberCount:')) localStorage.removeItem(k); });
      } catch { /* ignore */ }
      await supabase.auth.signOut();
    } finally {
      navigate("/");
    }
  };

  const handleAddGroup = () => {
    setIsNameModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsNameModalOpen(false);
    setNewGroupName("");
    setNewGroupDescription("");
  };

  const handleConfirmAdd = async () => {
    const name = newGroupName.trim();
    const description = newGroupDescription.trim();
    if (!name) return;

    const { data: userData } = await supabase.auth.getUser();
    const host = userData?.user?.id ?? "unknown";

    const { data } = await supabase
      .from("servers")
      .insert({ room_name: name, description: description || null, host })
      .select("id, room_name, description")
      .single();

    if (data) {
      // 내가 속한 server_members에 추가 (user_id는 uuid)
      await supabase
        .from("server_members")
        .insert({ server_id: data.id, user_id: host });
      setMeetings((prev) => [...prev, data]);
      setNewGroupName("");
      setNewGroupDescription("");
      setIsNameModalOpen(false);
      window.dispatchEvent(new Event('meetings-updated'));
    }
  };

  const reloadMeetings = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      // 현재 유저
      const { data: auth } = await supabase.auth.getUser();
      const uuid = auth.user?.id ?? null;
      setMyUserUuid(uuid);

      // 내 멤버십 meeting_ids
      let meetingIds: string[] = [];
      if (uuid) {
        const { data: mm } = await supabase
          .from("server_members")
          .select("server_id")
          .eq("user_id", uuid);
        meetingIds = (mm ?? []).map((r: { server_id: string }) => r.server_id);
      }

      // 내 서버 목록: 내가 멤버이거나(host이거나)
      const { data } = await supabase
        .from("servers")
        .select("id, room_name, description, host, created_at")
        .in("id", meetingIds.length > 0 ? meetingIds : ["00000000-0000-0000-0000-000000000000"]) // in은 빈 배열 불가
        .order("created_at", { ascending: true });
      type MeetingRec = { id: string; room_name: string; description: string | null; host: string; created_at?: string };
      let list = (data ?? []) as MeetingRec[];
      if (uuid) {
        const { data: hosted } = await supabase
          .from("servers")
          .select("id, room_name, description, host, created_at")
          .eq("host", uuid)
          .order("created_at", { ascending: true });
        const map = new Map<string, MeetingRec>();
        list.forEach((r) => map.set(r.id, r));
        (hosted ?? []).forEach((r: MeetingRec) => { if (!map.has(r.id)) map.set(r.id, r); });
        list = Array.from(map.values());
      }

      setSkeletonCount(list.length);
      setMeetings(list.map((r) => ({ id: r.id, room_name: r.room_name, description: r.description })));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reloadMeetings();
    // Realtime subscription for meetings
    const channel = supabase
      .channel("realtime:servers:mini")
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'servers' },
        (payload) => {
          const newRow = payload.new as { id: string; room_name: string; description: string | null };
          setMeetings((prev) => (prev.some((m) => m.id === newRow.id) ? prev : [...prev, newRow]));
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'servers' },
        (payload) => {
          const updated = payload.new as { id: string; room_name: string; description: string | null };
          setMeetings((prev) => prev.map((m) => (m.id === updated.id ? { id: updated.id, room_name: updated.room_name, description: updated.description } : m)));
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'servers' },
        (payload) => {
          const oldRow = payload.old as { id: string };
          setMeetings((prev) => prev.filter((m) => m.id !== oldRow.id));
        }
      )
      .subscribe();

    // server_members 변경도 반영
    const mmChannel = supabase
      .channel("realtime:server_members:mini")
      .on('postgres_changes', { event: '*', schema: 'public', table: 'server_members' }, (payload) => {
        // 멤버십 변경 시 현재 선택 초기화(홈 카드와 동기화)
        try {
          const raw = localStorage.getItem('home:selectedMeeting');
          if (raw) {
            const parsed = JSON.parse(raw) as { meetingId?: string } | null;
            const newRow = payload.new as { server_id?: string; user_id?: string } | null;
            const oldRow = payload.old as { server_id?: string; user_id?: string } | null;
            const changedServerId = newRow?.server_id ?? oldRow?.server_id ?? null;
            const changedUserId = newRow?.user_id ?? oldRow?.user_id ?? null;
            if (parsed?.meetingId && changedServerId === parsed.meetingId && myUserUuid != null && changedUserId === myUserUuid) {
              localStorage.removeItem('home:selectedMeeting');
              Object.keys(localStorage).forEach((k) => { if (k.startsWith('home:memberCount:')) localStorage.removeItem(k); });
              window.dispatchEvent(new CustomEvent('show-participants', { detail: { meetingId: '', meetingName: '' } }));
            }
          }
        } catch { /* ignore */ }
        void reloadMeetings();
      })
      .subscribe();

    const handleUpdated = (): void => { void reloadMeetings(); };
    window.addEventListener('meetings-updated', handleUpdated);

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(mmChannel);
      window.removeEventListener('meetings-updated', handleUpdated);
    };
  }, [reloadMeetings, myUserUuid]);
  return (
    <div className="h-full flex flex-col items-center py-4 w-14 bg-gray-100 dark:bg-[#1E1F2B] border-r border-gray-300 dark:border-gray-700">
      {/* 그룹 리스트 */}
      <div className="flex flex-col items-center gap-0 mb-0 font-bold">
        {loading ? (
          skeletonCount > 0 ? (
            <>
              {Array.from({ length: Math.max(0, skeletonCount) }).map((_, i) => (
                <Skeleton key={i} className="w-10 h-10 rounded-md mb-2" />
              ))}
            </>
          ) : null
        ) : (
          <>
            {meetings.slice(0, 15).map((m) => (
              <GroupItem key={m.id} name={m.room_name} onClick={() => setConfirmNavigate({ open: true, meetingId: m.id, meetingName: m.room_name })} />
            ))}
            {meetings.length > 15 && (
              <button
                aria-label="더 보기"
                className="w-10 h-10 rounded-md mb-2 bg-gray-300 dark:bg-[#2A2B32] text-gray-800 dark:text-gray-100 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-[#33354a]"
                onClick={() => setShowAllServers(true)}
                title="모든 서버 보기"
              >
                …
              </button>
            )}
          </>
        )}
      {/* + 버튼 */}
      <AddGroupButton onClick={handleAddGroup} />
      </div>

      {/* 다크모드,화이트모드 */}
      <div className="flex items-center gap-4 pointer-events-auto mt-2">
        <Button variant="outline" size="icon" onClick={toggleTheme}>
          <Sun className="scale-130 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-110" />
        </Button>
      </div>

      {/* 로그아웃(전원) 버튼 - 맨 아래 */}
      <div className="mt-auto pointer-events-auto mb-2">
        <Button variant="outline" size="icon" onClick={() => setConfirmLogoutOpen(true)} title="로그아웃">
          <Power />
        </Button>
      </div>

      {/* 전체 서버 목록 모달 */}
      {showAllServers && (
        <div>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => { setShowAllServers(false); setServerSearch(""); }} />
          <div className="fixed top-1/2 left-1/2 w-[360px] max-w-[90vw] bg-white dark:bg-[#2F3136] p-4 rounded-md shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="flex items-center gap-2 mb-3">
              <Input
                value={serverSearch}
                onChange={(e) => setServerSearch(e.target.value)}
                placeholder="서버 이름 검색"
                className="flex-1 focus:outline-none focus:ring-0 focus-visible:ring-0 ring-0 outline-none focus:border-gray-300 dark:focus:border-gray-600"
              />
              <Button variant="outline" size="sm" onClick={() => { setShowAllServers(false); setServerSearch(""); }}>닫기</Button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto pr-1">
              <div className="flex flex-col gap-2">
                {meetings
                  .filter((m) => {
                    const q = serverSearch.trim().toLowerCase();
                    if (!q) return true;
                    return (m.room_name || "").toLowerCase().includes(q);
                  })
                  .map((m) => (
                    <button
                      key={`all-${m.id}`}
                      className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-[#23242e] text-left"
                      onClick={() => { setShowAllServers(false); setConfirmNavigate({ open: true, meetingId: m.id, meetingName: m.room_name }); }}
                    >
                      <GroupItem name={m.room_name} title="" />
                      <span className="text-sm text-gray-800 dark:text-gray-200 truncate">
                        {m.room_name}
                      </span>
                    </button>
                  ))}
                {meetings.filter((m) => (serverSearch.trim() ? (m.room_name || "").toLowerCase().includes(serverSearch.trim().toLowerCase()) : true)).length === 0 && (
                  <div className="text-center text-xs text-gray-500 dark:text-gray-300 py-4">검색 결과가 없습니다.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 이동 확인 모달 */}
      {confirmNavigate.open && (
        <div>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setConfirmNavigate({ open: false, meetingId: null, meetingName: null })}
          />
          <div className="fixed top-1/2 left-1/2 w-[320px] bg-white dark:bg-[#2F3136] p-4 rounded-md shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-50">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">이동하시겠습니까?</h3>
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">선택한 서버 참여자를 홈에서 보여줍니다: {confirmNavigate.meetingName}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">회의를 누르시면 선택한 서버 회의방으로 이동됩니다.</div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setConfirmNavigate({ open: false, meetingId: null, meetingName: null })}>취소</Button>
              <Button onClick={() => {
                try {
                  if (confirmNavigate.meetingId) {
                    try { localStorage.setItem('home:selectedMeeting', JSON.stringify({ meetingId: confirmNavigate.meetingId, meetingName: confirmNavigate.meetingName || '' })); } catch { /* no-op */ }
                    window.dispatchEvent(new CustomEvent('show-participants', { detail: { meetingId: confirmNavigate.meetingId, meetingName: confirmNavigate.meetingName || '' } }));
                    try { window.focus(); } catch { /* ignore */ }
                    // 홈으로 이동하여 소개 카드가 참여자 카드로 전환되도록 보장
                    navigate('/workspace/home');
                  }
                } catch { /* no-op */ }
                setConfirmNavigate({ open: false, meetingId: null, meetingName: null });
              }}>예</Button>
            </div>
          </div>
        </div>
      )}

      {/* 로그아웃 확인 모달 */}
      {confirmLogoutOpen && (
        <div>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setConfirmLogoutOpen(false)}
          />
          <div className="fixed top-1/2 left-1/2 w-[320px] bg-white dark:bg-[#2F3136] p-4 rounded-md shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-50">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">로그아웃하시겠습니까?</h3>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setConfirmLogoutOpen(false)}>취소</Button>
              <Button onClick={() => { setConfirmLogoutOpen(false); void handleLogout(); }}>예</Button>
            </div>
          </div>
        </div>
      )}

      {isNameModalOpen && (
        <div>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={handleCloseModal}
          />
          <div className="fixed top-1/2 left-1/2 w-[320px] bg-white dark:bg-[#2F3136] p-4 rounded-md shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-50">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">설정</h3>
            <div className="space-y-2">
              <label className="text-sm text-gray-600 dark:text-gray-300">이름</label>
              <Input
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); void handleConfirmAdd(); } }}
                placeholder="서버 이름을 입력하세요"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-600 dark:text-gray-300">소개</label>
              <Input
                value={newGroupDescription}
                onChange={(e) => setNewGroupDescription(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); void handleConfirmAdd(); } }}
                placeholder="서버를 소개해주세요!"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={handleCloseModal}>취소</Button>
              <Button onClick={handleConfirmAdd} disabled={!newGroupName.trim()}>확인</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniSidebar
