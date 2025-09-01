import { useEffect, useState, useCallback } from "react";
//import { useNavigate } from "react-router";
import AddGroupButton from "./AddGroupButton"
import GroupItem from "./GroupItem"
import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { Button } from "../../common/ui/button";
import { Input } from "@/components/common/ui/input";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/common/ui/skeleton";

const MiniSidebar = () => {
  //const navigate = useNavigate(); //나중에 쓸거임
  type MeetingItem = { id: string; room_name: string; description: string | null };
  const [meetings, setMeetings] = useState<MeetingItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [skeletonCount, setSkeletonCount] = useState<number>(0);
  const [isNameModalOpen, setIsNameModalOpen] = useState<boolean>(false);
  const [newGroupName, setNewGroupName] = useState<string>("");
  const [newGroupDescription, setNewGroupDescription] = useState<string>("");
  const { toggleTheme } = useThemeStore();

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

    const { data, error } = await supabase
      .from("meetings")
      .insert({ room_name: name, description: description || null, host })
      .select("id, room_name, description")
      .single();

    if (data) {
      // 내가 속한 meeting_members에 추가
      const { data: usersRow } = await supabase
        .from("users")
        .select("id")
        .eq("user_uuid", host)
        .maybeSingle();
      const userPk = (usersRow as { id: number } | null)?.id;
      if (userPk) {
        await supabase
          .from("meeting_members")
          .insert({ meeting_id: data.id, user_id: userPk });
      }
      setMeetings((prev) => [...prev, data]);
      setNewGroupName("");
      setNewGroupDescription("");
      setIsNameModalOpen(false);
      window.dispatchEvent(new Event('meetings-updated'));
    } else {
      }
  };

  const reloadMeetings = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      // 현재 유저
      const { data: auth } = await supabase.auth.getUser();
      const uuid = auth.user?.id ?? null;
      let userPk: number | null = null;
      if (uuid) {
        const { data: userRow } = await supabase
          .from("users")
          .select("id")
          .eq("user_uuid", uuid)
          .maybeSingle();
        userPk = (userRow as { id: number } | null)?.id ?? null;
      }

      // 내 멤버십 meeting_ids
      let meetingIds: string[] = [];
      if (userPk) {
        const { data: mm } = await supabase
          .from("meeting_members")
          .select("meeting_id")
          .eq("user_id", userPk);
        meetingIds = (mm ?? []).map((r: { meeting_id: string }) => r.meeting_id);
      }

      // 내 서버 목록: 내가 멤버이거나(host이거나)
      const { data } = await supabase
        .from("meetings")
        .select("id, room_name, description, host, created_at")
        .in("id", meetingIds.length > 0 ? meetingIds : ["00000000-0000-0000-0000-000000000000"]) // in은 빈 배열 불가
        .order("created_at", { ascending: true });
      type MeetingRec = { id: string; room_name: string; description: string | null; host: string; created_at?: string };
      let list = (data ?? []) as MeetingRec[];
      if (uuid) {
        const { data: hosted } = await supabase
          .from("meetings")
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
      .channel("realtime:meetings:mini")
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'meetings' },
        (payload) => {
          const newRow = payload.new as { id: string; room_name: string; description: string | null };
          setMeetings((prev) => (prev.some((m) => m.id === newRow.id) ? prev : [...prev, newRow]));
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'meetings' },
        (payload) => {
          const updated = payload.new as { id: string; room_name: string; description: string | null };
          setMeetings((prev) => prev.map((m) => (m.id === updated.id ? { id: updated.id, room_name: updated.room_name, description: updated.description } : m)));
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'meetings' },
        (payload) => {
          const oldRow = payload.old as { id: string };
          setMeetings((prev) => prev.filter((m) => m.id !== oldRow.id));
        }
      )
      .subscribe();

    // meeting_members 변경도 반영
    const mmChannel = supabase
      .channel("realtime:meeting_members:mini")
      .on('postgres_changes', { event: '*', schema: 'public', table: 'meeting_members' }, () => {
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
  }, [reloadMeetings]);
  return (
    <div className="min-h-screen flex flex-col items-center py-4 w-14 bg-gray-100 dark:bg-[#1E1F2B] border-r border-gray-300 dark:border-gray-700">
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
          meetings.map((m) => (
            <GroupItem key={m.id} name={m.room_name} />
          ))
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
