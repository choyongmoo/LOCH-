import { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/common/ui/input";
import GroupItem from "@/components/Workspace/Sidebar/GroupItem";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/common/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { Settings, X as XIcon } from "lucide-react";

const ManagerPage = () => {
  type MeetingRow = { id: string; room_name: string; description: string | null; host: string };
  const [rows, setRows] = useState<MeetingRow[]>([]);
  const [hostNames, setHostNames] = useState<Record<string, string>>({});
  const [leaveTarget, setLeaveTarget] = useState<MeetingRow | null>(null);
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [leaveError, setLeaveError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [skeletonCount, setSkeletonCount] = useState<number>(0);
  const [myUuid, setMyUuid] = useState<string | null>(null);
  // create server modal
  const [createOpen, setCreateOpen] = useState<boolean>(false);
  const [creating, setCreating] = useState<boolean>(false);
  const [createName, setCreateName] = useState<string>("");
  const [createDesc, setCreateDesc] = useState<string>("");
  const [createError, setCreateError] = useState<string | null>(null);

  const navigate = useNavigate();

  const reloadMeetings = useCallback(async (): Promise<void> => {
      setLoading(true);
      try {
        // Count first to render matching skeleton rows
        // 내 유저 PK 조회
        const { data: auth } = await supabase.auth.getUser();
        const uuid = auth.user?.id ?? null;
        setMyUuid(uuid);
        let userPk: number | null = null;
        if (uuid) {
          const { data: userRow } = await supabase
            .from("users")
            .select("id")
            .eq("user_uuid", uuid)
            .maybeSingle();
          userPk = (userRow as { id: number } | null)?.id ?? null;
        }

        // 내가 속한 meeting ids
        let meetingIds: string[] = [];
        if (userPk) {
          const { data: mm } = await supabase
            .from("server_members")
            .select("server_id")
            .eq("user_id", userPk);
          meetingIds = (mm ?? []).map((r: { server_id: string }) => r.server_id);
        }

        const { data } = await supabase
          .from("servers")
          .select("id, room_name, description, host, created_at")
          .in("id", meetingIds.length > 0 ? meetingIds : ["00000000-0000-0000-0000-000000000000"]) // in 빈배열 보호
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
        const rowsData = list.map((r) => ({ id: r.id, room_name: r.room_name, description: r.description, host: r.host })) as MeetingRow[];
        setRows(rowsData);
        const hosts = Array.from(new Set(list.map((m) => m.host).filter(Boolean)));
        if (hosts.length > 0) {
          type UserRow = { id: number; user_uuid: string; name: string | null };
          const { data: usersRows } = await supabase
            .from("users")
            .select("id, user_uuid, name")
            .in("user_uuid", hosts);
          const users = (usersRows ?? []) as UserRow[];
          const ids = users.map((u) => u.id);
          type ProfileRow = { id: number; nickname: string | null };
          const { data: profilesRows } = await supabase
            .from("profile")
            .select("id, nickname")
            .in("id", ids);
          const idToNick = new Map<number, string>();
          (profilesRows ?? []).forEach((p) => {
            const pr = p as ProfileRow;
            if (pr.nickname) idToNick.set(pr.id, pr.nickname);
          });
          const map: Record<string, string> = {};
          users.forEach((u) => {
            const nick = idToNick.get(u.id) ?? u.name ?? undefined;
            if (u.user_uuid && nick) map[u.user_uuid] = nick;
          });
          setHostNames(map);
        }
      } finally {
        setLoading(false);
      }
  }, []);
  useEffect(() => {
    void reloadMeetings();
    const channel = supabase
      .channel("realtime:servers:manager")
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'servers' },
        (payload) => {
          const r = payload.new as MeetingRow;
          setRows((prev) => (prev.some((m) => m.id === r.id) ? prev : [...prev, r]));
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'servers' },
        (payload) => {
          const r = payload.new as MeetingRow;
          setRows((prev) => prev.map((m) => (m.id === r.id ? r : m)));
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'servers' },
        (payload) => {
          const oldId = (payload.old as { id: string }).id;
          setRows((prev) => prev.filter((m) => m.id !== oldId));
        }
      )
      .subscribe();

    // meeting_members 변경도 반영
    const mmChannel = supabase
      .channel("realtime:server_members:manager")
      .on('postgres_changes', { event: '*', schema: 'public', table: 'server_members' }, () => {
        void reloadMeetings();
      })
      .subscribe();

    const handleUpdated = (): void => { void reloadMeetings(); };
    window.addEventListener('meetings-updated', handleUpdated); // 이벤트명은 호환 유지

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(mmChannel);
      window.removeEventListener('meetings-updated', handleUpdated);
    };
  }, [reloadMeetings]);

  return (
    <div className="h-screen w-full min-w-0 bg-gray-100 dark:bg-[#18191c] px-4 md:px-5 py-6 flex flex-col overflow-hidden">
      {/* 테이블 헤더 */}
      <div className="flex items-center px-2 py-2 text-gray-500 dark:text-gray-400 text-sm border-b border-gray-200 dark:border-[#23242e]">
        <div className="w-8"></div>
        <div className="flex-1">서버</div>
        <div className="flex-3">소개 </div>
        <div className="w-32 text-center">관리자</div>
        <div className="w-8 text-right"></div>
      </div>
      {/* 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          skeletonCount > 0 ? (
            <>
              {Array.from({ length: Math.max(0, skeletonCount) }).map((_, i) => (
                <div key={i} className="flex items-center px-2 py-3 border-b border-gray-200 dark:border-[#23242e]">
                  <div className="w-8" />
                  <div className="flex-1 flex items-center gap-3 min-w-0">
                    <Skeleton className="w-10 h-10 rounded-md" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                  <div className="flex-3 pr-4">
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <div className="w-32 flex items-center justify-center">
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="w-8" />
                </div>
              ))}
            </>
          ) : (
            <></>
          )
        ) : (
          <>
            {rows.map((m) => (
            <div
              key={m.id}
              className="group flex items-center px-2 py-3 border-b border-gray-200 dark:border-[#23242e] cursor-pointer hover:bg-gray-50 dark:hover:bg-[#2A2B32]"
              onClick={() => navigate(`/meeting/${m.id}`)}
            >
              <div className="w-8" />
              <div className="flex-1 flex items-center gap-3 min-w-0">
                <GroupItem name={m.room_name} />
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {m.room_name}
                </div>
              </div>
              <div className="flex-3 text-sm text-gray-700 dark:text-gray-300 pr-4 truncate">
                {m.description || "-"}
              </div>
              <div className="w-32 text-sm text-gray-800 dark:text-gray-200 truncate flex items-center justify-center gap-1">
                <span>{hostNames[m.host] ?? `${m.host?.slice(0, 8)}…`}</span>
              </div>
              <div className="w-8 flex flex-col items-end justify-center gap-1">
                {myUuid && m.host === myUuid ? (
                  <>
                    <button
                      type="button"
                      aria-label="settings"
                      className="opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-gray-600"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      title="설정"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="leave"
                      className="opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation(); // 부모 클릭 이벤트 방지
                        setLeaveTarget(m);
                      }}
                      title="서버 나가기"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    aria-label="leave"
                    className="opacity-0 group-hover:opacity-100 transition text-sm text-gray-400 hover:text-red-500 font-semibold"
                    onClick={(e) => {
                      e.stopPropagation(); // 부모 클릭 이벤트 방지
                      setLeaveTarget(m);
                    }}
                    title="서버 나가기"
                  >
                    x
                  </button>
                )}
              </div>
            </div>
            ))}
            {/* plus row to add new server (항상 표시) */}
            <div className="flex items-center px-2 py-4 border-b border-gray-200 dark:border-[#23242e]">
              <div className="w-8" />
              <div className="flex-1 flex items-center justify-center min-w-0">
                <div
                  className="w-10 h-10 rounded-md bg-gray-200 dark:bg-[#2A2B32] text-gray-700 dark:text-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300 dark:hover:bg-[#343746]"
                  onClick={() => { setCreateOpen(true); setCreateError(null); }}
                  title="서버 추가"
                >
                  +
                </div>
              </div>
              <div className="w-8" />
            </div>
          </>
        )}
      </div>
      {/* create modal */}
      {createOpen && (
        <div>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => { if (!creating) { setCreateOpen(false); setCreateName(""); setCreateDesc(""); } }} />
          <div className="fixed top-1/2 left-1/2 w-[360px] max-w-[90vw] bg-white dark:bg-[#23242e] p-5 rounded-md shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="text-lg font-semibold text-gray-900 dark:text-white mb-3">서버 추가</div>
            {createError && (
              <div className="text-xs text-red-500 mb-2">{createError}</div>
            )}
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">이름</label>
                <Input value={createName} onChange={(e) => setCreateName(e.target.value)} placeholder="서버 이름" />
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">소개</label>
                <Input value={createDesc} onChange={(e) => setCreateDesc(e.target.value)} placeholder="서버 소개(선택)" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm"
                onClick={() => { if (!creating) { setCreateOpen(false); setCreateName(""); setCreateDesc(""); } }}
                disabled={creating}
              >
                취소
              </button>
              <button
                className="px-3 py-1 rounded bg-gray-900 text-white dark:bg-white dark:text-black text-sm disabled:opacity-60"
                disabled={creating || !createName.trim()}
                onClick={async () => {
                  setCreating(true);
                  setCreateError(null);
                  try {
                    const name = createName.trim();
                    const description = createDesc.trim();
                    const { data: auth } = await supabase.auth.getUser();
                    const host = auth.user?.id ?? null;
                    const { data, error } = await supabase
                      .from('servers')
                      .insert({ room_name: name, description: description || null, host })
                      .select('id, room_name, description, host')
                      .single();
                    if (error) throw error;
                    if (data) {
                      if (host) {
                        try { await supabase.from('server_members').insert({ server_id: data.id, user_id: host }); } catch { /* ignore */ }
                      }
                      setRows((prev) => ([...prev, { id: data.id, room_name: data.room_name, description: data.description, host: data.host }]));
                      window.dispatchEvent(new Event('meetings-updated'));
                      setCreateOpen(false); setCreateName(""); setCreateDesc("");
                    }
                  } catch {
                    setCreateError('생성에 실패했습니다.');
                  } finally {
                    setCreating(false);
                  }
                }}
              >
                생성
              </button>
            </div>
          </div>
        </div>
      )}
      {leaveTarget && (
        <div>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setLeaveTarget(null)} />
          <div className="fixed top-1/2 left-1/2 w-[360px] bg-white dark:bg-[#23242e] p-5 rounded-md shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">서버 나가기</div>
            <div className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              '{leaveTarget.room_name}' 서버에서 나가시겠어요? 확인 시 목록에서 사라집니다.
            </div>
            {leaveError && (
              <div className="text-xs text-red-500 mb-2">{leaveError}</div>
            )}
            <div className="flex justify-end gap-2 mt-2">
              <button
                className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm"
                onClick={() => setLeaveTarget(null)}
                disabled={leaveLoading}
              >
                취소
              </button>
              <button
                className="px-3 py-1 rounded bg-red-500 text-white text-sm disabled:opacity-60"
                disabled={leaveLoading}
                onClick={async () => {
                  if (!leaveTarget) return;
                  setLeaveLoading(true);
                  setLeaveError(null);
                  try {
                    const { data: auth } = await supabase.auth.getUser();
                    const uuid = auth.user?.id;
                    if (!uuid) throw new Error("인증 정보가 없습니다.");
                    const { data: userRow } = await supabase
                      .from("users")
                      .select("id")
                      .eq("user_uuid", uuid)
                      .maybeSingle();
                    const userId = (userRow as { id: number } | null)?.id;
                    if (!userId) throw new Error("유저 정보가 없습니다.");
                    await supabase
                      .from("server_members")
                      .delete()
                      .eq("server_id", leaveTarget.id)
                      .eq("user_id", userId);
                    await supabase
                      .from("servers")
                      .delete()
                      .eq("id", leaveTarget.id);
                    setRows((prev) => prev.filter((r) => r.id !== leaveTarget.id));
                    setLeaveTarget(null);
                    window.dispatchEvent(new Event('meetings-updated'));
                  } catch {
                    setLeaveError("나가기 처리 중 오류가 발생했습니다.");
                  } finally {
                    setLeaveLoading(false);
                  }
                }}
              >
                {leaveLoading ? "처리 중..." : "나가기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerPage;
