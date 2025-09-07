import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Skeleton } from "@/components/common/ui/skeleton";
import GroupItem from "@/components/Workspace/Sidebar/GroupItem";
import { Link } from "react-router";
import { supabase } from "@/lib/supabase";
import { useBreakpoint } from "@/hooks/useBreakpoint";

type SimpleMeeting = { id: string; room_name: string; created_at?: string };

function RecentServers() {
  const [list, setList] = useState<SimpleMeeting[]>([]);

  const reload = useCallback(async () => {
    try {
      // 현재 유저
      const { data: auth } = await supabase.auth.getUser();
      const uuid = auth.user?.id ?? null;
      let userPk: number | null = null;
      if (uuid) {
        const { data: userRow } = await supabase
          .from("users")
          .select("id")
          .eq("email", auth.user?.email ?? "")
          .maybeSingle();
        userPk = (userRow as { id: number } | null)?.id ?? null;
      }

      // 내가 멤버인 미팅들
      let meetingIds: string[] = [];
      if (userPk) {
        const { data: mm } = await supabase
          .from("meeting_members")
          .select("meeting_id")
          .eq("user_id", userPk);
        meetingIds = (mm ?? []).map((r: { meeting_id: string }) => r.meeting_id);
      }

      // 내가 멤버이거나 호스트인 미팅 목록
      const ids = meetingIds.length > 0 ? meetingIds : ["00000000-0000-0000-0000-000000000000"]; // in 보호
      const { data } = await supabase
        .from("meetings")
        .select("id, room_name, created_at, host")
        .in("id", ids)
        .order("created_at", { ascending: false });

      let combined = (data ?? []) as Array<{ id: string; room_name: string; created_at?: string; host?: string }>;
      if (uuid) {
        const { data: hosted } = await supabase
          .from("meetings")
          .select("id, room_name, created_at, host")
          .eq("host", uuid)
          .order("created_at", { ascending: false });
        const map = new Map<string, SimpleMeeting>();
        combined.forEach((m) => map.set(m.id, { id: m.id, room_name: m.room_name, created_at: m.created_at }));
        (hosted ?? []).forEach((m) => { if (!map.has(m.id)) map.set(m.id, { id: m.id, room_name: m.room_name, created_at: m.created_at }); });
        combined = Array.from(map.values()).sort((a, b) => (new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()));
      }

      setList(combined.slice(0, 3));
    } catch {
      setList([]);
    }
  }, []);

  useEffect(() => {
    void reload();
    const meetingsCh = supabase
      .channel("realtime:home:meetings")
      .on('postgres_changes', { event: '*', schema: 'public', table: 'meetings' }, () => { void reload(); })
      .subscribe();
    const mmCh = supabase
      .channel("realtime:home:meeting_members")
      .on('postgres_changes', { event: '*', schema: 'public', table: 'meeting_members' }, () => { void reload(); })
      .subscribe();
    const handleLocal = () => { void reload(); };
    window.addEventListener('meetings-updated', handleLocal as EventListener);
    return () => { supabase.removeChannel(meetingsCh); supabase.removeChannel(mmCh); window.removeEventListener('meetings-updated', handleLocal as EventListener); };
  }, [reload]);

  return (
    <div className="flex gap-4 mb-4 min-h-[72px]">
      {list.map((m) => (
        <Link key={m.id} to={`/meeting/${m.id}`} className="flex flex-col items-center w-16 flex-none">
          <GroupItem name={m.room_name} title={m.room_name} />
          <span className="text-xs font-bold text-gray-700 dark:text-gray-200 text-center w-full">
            {m.room_name && m.room_name.length > 4 ? `${m.room_name.slice(0, 4)}…` : m.room_name}
          </span>
        </Link>
      ))}
    </div>
  );
}

function ParticipantsCard({ meetingId, title, fixedHeight }: { meetingId?: string | null; title?: string; fixedHeight?: number }) {
  const [participants, setParticipants] = useState<Array<{ id: number; nickname: string; accent_color: string }>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [expectedCount, setExpectedCount] = useState<number>(0);
  const [countReady, setCountReady] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data: auth } = await supabase.auth.getUser();
        const email = auth.user?.email ?? null;
        if (!email) { setParticipants([]); return; }

        // 내 PK
        const { data: me } = await supabase.from('users').select('id').eq('email', email).maybeSingle();
        const myId = (me?.id as number | undefined) ?? null;
        if (!myId) { setParticipants([]); return; }

        // 타겟 미팅: 전달되면 사용, 없으면 내가 속한 최신 미팅
        let targetMeeting: string | null = meetingId ?? null;
        if (!targetMeeting) {
          const { data: mm } = await supabase.from('meeting_members').select('meeting_id').eq('user_id', myId);
          const meetingIds = (mm ?? []).map((r: { meeting_id: string }) => r.meeting_id);
          if (meetingIds.length > 0) {
            const { data: mrows } = await supabase
              .from('meetings')
              .select('id, created_at')
              .in('id', meetingIds)
              .order('created_at', { ascending: false })
              .limit(1);
            targetMeeting = (mrows && (mrows as Array<{ id: string }>)[0]?.id) ?? null;
          }
        }
        // 캐시된 예상 인원 즉시 반영 (로딩 중 스켈레톤 개수 정확도 향상)
        if (targetMeeting) {
          try {
            const cached = localStorage.getItem(`home:memberCount:${targetMeeting}`);
            if (cached != null) {
              const n = Number(cached);
              if (!Number.isNaN(n)) setExpectedCount(n);
            }
          } catch { /* ignore */ }
        }
        if (!targetMeeting) { setParticipants([]); setCountReady(true); setExpectedCount(0); return; }

        // 먼저 정확한 인원 수(count)만 빠르게 조회해 스켈레톤 크기 확정
        try {
          const { count } = await supabase
            .from('meeting_members')
            .select('user_id', { count: 'exact', head: true })
            .eq('meeting_id', targetMeeting);
          const n = (count ?? 0);
          setExpectedCount(n);
          try { localStorage.setItem(`home:memberCount:${targetMeeting}`, String(n)); } catch { /* ignore */ }
        } finally {
          setCountReady(true);
        }

        // 실제 참여자 id 목록 로드 후 상세 표시
        const { data: members } = await supabase.from('meeting_members').select('user_id').eq('meeting_id', targetMeeting);
        const userIds = (members ?? []).map((r: { user_id: number }) => r.user_id);
        if (userIds.length === 0) { setParticipants([]); return; }

        const [{ data: usersRows }, { data: profiles }] = await Promise.all([
          supabase.from('users').select('id, name, email').in('id', userIds),
          supabase.from('profile').select('id, nickname, accent_color').in('id', userIds),
        ]);
        const pmap = new Map<number, { nickname: string | null; accent_color: string | null }>();
        (profiles ?? []).forEach((p: { id: number; nickname: string | null; accent_color: string | null }) => pmap.set(p.id, { nickname: p.nickname, accent_color: p.accent_color }));
        const list = (usersRows ?? []).map((u: { id: number; name: string | null; email: string | null }) => {
          const prof = pmap.get(u.id);
          const nickname = (prof?.nickname && prof.nickname.trim()) ? prof.nickname : (u.name && u.name.trim()) ? u.name : (u.email ?? `사용자 #${u.id}`);
          const accent = (prof?.accent_color && /^#([0-9a-fA-F]{6})$/.test(prof.accent_color)) ? prof.accent_color : '#7e22ce';
          return { id: u.id, nickname, accent_color: accent };
        });
        setParticipants(list);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [meetingId]);

  return (
    <div
      className="bg-white dark:bg-[#1a1d21] rounded-xl shadow-xl p-8 flex flex-col items-start justify-start"
      style={fixedHeight ? { height: `${fixedHeight}px`, overflow: "auto" } : undefined}
    >
      <div className="w-full flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{title ? `${title} 참여자 목록` : '서버 참여자'}</h1>
        <button onClick={() => setShowAll(true)} className="inline-flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-1 text-sm font-bold hover:bg-gray-100 dark:hover:bg-[#23242e] transition">...</button>
      </div>
      {loading && countReady ? (
        <div className="flex flex-col gap-3 w-full">
          {Array.from({ length: Math.max(0, expectedCount) }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#23242e]" />
              <Skeleton className="h-4 w-40" />
            </div>
          ))}
        </div>
      ) : loading ? null : participants.length === 0 ? (
        <div className="text-sm text-gray-500 dark:text-gray-300">참여자 정보가 없습니다.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          {participants.slice(0, 6).map((p) => (
            <div key={p.id} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: p.accent_color }}>
                {p.nickname.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-gray-800 dark:text-gray-100">{p.nickname}</span>
            </div>
          ))}
        </div>
      )}
      {showAll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAll(false)} />
          <div className="relative bg-white dark:bg-[#1a1d21] w-full max-w-lg rounded-xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">전체 참여자</h3>
              <button onClick={() => setShowAll(false)} className="text-sm text-gray-500 hover:underline">닫기</button>
            </div>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {participants.map((p) => (
                <div key={`all-${p.id}`} className="flex items-center gap-3 p-2 border rounded-lg">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: p.accent_color }}>
                    {p.nickname.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-800 dark:text-gray-100">{p.nickname}</span>
                </div>
              ))}
              {participants.length === 0 && (
                <div className="text-sm text-gray-500 dark:text-gray-300 text-center">참여자 정보가 없습니다.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const { up, down } = useBreakpoint({ debounceMs: 120 });
  const [email, setEmail] = useState<string | null>(null);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [profileColor, setProfileColor] = useState<string | null>(null);
  const [profileBio, setProfileBio] = useState<string | null>(null);
  const [friends, setFriends] = useState<Array<{ id: number; nickname: string; accent_color: string }>>([]);
  const [isFriendsLoading, setIsFriendsLoading] = useState<boolean>(true);
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(true);
  // 사용자 PK가 필요하면 확장 예정
  // const [userPk, setUserPk] = useState<number | null>(null);
  const lastUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    const loadFromDatabase = async () => {
      setIsProfileLoading(true);
      try {
        const { data: authData } = await supabase.auth.getUser();
        const emailFromAuth = authData.user?.email ?? null;
        setEmail(emailFromAuth);
        if (!emailFromAuth) return;

        // users에서 PK 조회(없으면 생성)
        const { data: userRow } = await supabase
          .from("users")
          .select("id, name")
          .eq("email", emailFromAuth)
          .order("id", { ascending: true })
          .limit(1)
          .maybeSingle();

        let displayName = emailFromAuth.split("@")[0] ?? "";
        let pk: number | null = null;
        if (userRow?.id) {
          pk = userRow.id as unknown as number;
          if (userRow.name) displayName = userRow.name as string;
        } else {
          const { data: inserted } = await supabase
            .from("users")
            .insert({ email: emailFromAuth, name: displayName })
            .select("id")
            .single();
          pk = inserted?.id ?? null;
        }
        if (!pk) return;
        // setUserPk(pk);

        // profile 조회(없으면 기본 생성)
        const { data: profileRow } = await supabase
          .from("profile")
          .select("nickname, bio, accent_color, language, mic_device_id, mic_enabled")
          .eq("id", pk)
          .maybeSingle();

        if (!profileRow) {
          await supabase
            .from("profile")
            .upsert({ id: pk, nickname: displayName, language: "ko", mic_enabled: true }, { onConflict: "id" });
          setProfileName(displayName);
          setProfileColor(null);
          setProfileBio(null);
        } else {
          setProfileName(profileRow.nickname ?? displayName);
          const validColor =
            typeof profileRow.accent_color === "string" && /^#([0-9a-fA-F]{6})$/.test(profileRow.accent_color)
              ? profileRow.accent_color
              : null;
          setProfileColor(validColor);
          const cleanedBio = typeof profileRow.bio === "string" && profileRow.bio.trim().length > 0 ? profileRow.bio : null;
          setProfileBio(cleanedBio);
        }
      } finally {
        setIsProfileLoading(false);
      }
    };

    void loadFromDatabase();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      const newUserId = session?.user?.id ?? null;
      const prevUserId = lastUserIdRef.current;
      if (event === 'SIGNED_OUT') {
        try {
          localStorage.removeItem('home:selectedMeeting');
          Object.keys(localStorage).forEach((k) => { if (k.startsWith('home:memberCount:')) localStorage.removeItem(k); });
        } catch { /* ignore */ }
        setParticipantsView(null);
      } else if (event === 'SIGNED_IN') {
        if (prevUserId && newUserId && prevUserId !== newUserId) {
          try {
            localStorage.removeItem('home:selectedMeeting');
            Object.keys(localStorage).forEach((k) => { if (k.startsWith('home:memberCount:')) localStorage.removeItem(k); });
          } catch { /* ignore */ }
          setParticipantsView(null);
        }
      }
      lastUserIdRef.current = newUserId;
      void loadFromDatabase();
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 간단 친구 목록 로드
  useEffect(() => {
    const loadFriends = async () => {
      setIsFriendsLoading(true);
      try {
        const { data: authData } = await supabase.auth.getUser();
        const emailFromAuth = authData.user?.email ?? null;
        if (!emailFromAuth) { setFriends([]); return; }

        // 내 users.id 조회
        const { data: me } = await supabase
          .from('users')
          .select('id')
          .eq('email', emailFromAuth)
          .order('id', { ascending: true })
          .limit(1)
          .maybeSingle();
        const myId = (me?.id as number | undefined) ?? null;
        if (!myId) { setFriends([]); return; }

        // 내게 연결된 친구(accepted) id 수집
        const { data: fr } = await supabase
          .from('friend_requests')
          .select('requester_id, addressee_id, status')
          .or(`requester_id.eq.${myId},addressee_id.eq.${myId}`);
        const accepted = new Set<number>();
        (fr ?? []).forEach((r: { requester_id: number; addressee_id: number; status: string }) => {
          if (r.status === 'accepted') {
            const other = r.requester_id === myId ? r.addressee_id : r.requester_id;
            accepted.add(other);
          }
        });
        if (accepted.size === 0) { setFriends([]); return; }

        // users + profile 병합(프로필이 아직 없는 친구도 표시)
        const ids = Array.from(accepted);
        const [{ data: usersRows }, { data: profiles }] = await Promise.all([
          supabase.from('users').select('id, name, email').in('id', ids),
          supabase.from('profile').select('id, nickname, accent_color').in('id', ids),
        ]);
        const profileMap = new Map<number, { nickname: string | null; accent_color: string | null }>();
        (profiles ?? []).forEach((p: { id: number; nickname: string | null; accent_color: string | null }) => {
          profileMap.set(p.id, { nickname: p.nickname, accent_color: p.accent_color });
        });
        const rows = (usersRows ?? []).map((u: { id: number; name: string | null; email: string | null }) => {
          const prof = profileMap.get(u.id);
          const nickname = (prof?.nickname && prof.nickname.trim())
            ? prof.nickname
            : (u.name && u.name.trim())
              ? u.name
              : (u.email ?? `사용자 #${u.id}`);
          const accent = (prof?.accent_color && /^#([0-9a-fA-F]{6})$/.test(prof.accent_color))
            ? prof.accent_color
            : '#7e22ce';
          return { id: u.id, nickname, accent_color: accent };
        });
        setFriends(rows);
      } catch {
        setFriends([]);
      } finally {
        setIsFriendsLoading(false);
      }
    };

    void loadFriends();
    const handler = () => { void loadFriends(); };
    window.addEventListener('friends-updated', handler as EventListener);
    return () => window.removeEventListener('friends-updated', handler as EventListener);
  }, [email]);

  const displayName = isProfileLoading ? null : (profileName ?? email ?? "");
  const baseName = displayName ?? "";
  const initials = (baseName || "").charAt(0).toUpperCase();
  const RECENT_KEY_PREFIX = "recentWorkspacePages:";
  const getRecentKey = useCallback(() => `${RECENT_KEY_PREFIX}${email ?? "anonymous"}`, [email]);
  const MAX_RECENT = 4; // 화면에 표시 개수
  const MAX_STORE = 10; // 모달에서 최대 10개까지 표시
  const [recentPages, setRecentPages] = useState<Array<{ path: string; ts: number }>>([]);
  const [showAllModal, setShowAllModal] = useState(false);
  const [participantsView, setParticipantsView] = useState<{ meetingId: string; meetingName: string } | null>(null);
  const introCardRef = useRef<HTMLDivElement | null>(null);
  const [introCardHeight, setIntroCardHeight] = useState<number | null>(null);

  const formatVisitedAt = (ts: number): string => {
    const d = new Date(ts);
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  const getDisplayName = (path: string): string => {
    const normalized = path.replace(/\/+$/, "");
    const map: Record<string, string> = {
      "/workspace": "홈",
      "/workspace/home": "홈",
      "/workspace/mun": "문서",
      "/workspace/profile": "프로필",
      "/workspace/settings": "설정",
      "/workspace/contact": "개인 연락처",
    };
    if (map[normalized]) return map[normalized];
    // fallback: 마지막 세그먼트를 표시
    const seg = normalized.split("/").filter(Boolean).pop() ?? normalized;
    return seg;
  };

  const loadRecentPages = useCallback(() => {
    try {
      const raw = localStorage.getItem(getRecentKey());
      const parsed: Array<{ path: string; ts: number }> = raw ? JSON.parse(raw) : [];
      setRecentPages(parsed);
    } catch {
      setRecentPages([]);
    }
  }, [getRecentKey]);

  useEffect(() => {
    loadRecentPages();
    const handleUpdate = () => loadRecentPages();
    window.addEventListener('recentWorkspacePagesUpdated', handleUpdate as EventListener);
    window.addEventListener('focus', handleUpdate);
    return () => {
      window.removeEventListener('recentWorkspacePagesUpdated', handleUpdate as EventListener);
      window.removeEventListener('focus', handleUpdate);
    };
    // 이메일이 바뀌면 키가 달라지므로 재구독/재로딩
  }, [email, loadRecentPages]);

  // MiniSidebar에서 show-participants 이벤트를 수신하면 왼쪽 첫 카드만 참여자 카드로 전환
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ meetingId: string; meetingName: string }>;
      const { meetingId, meetingName } = ce.detail;
      if (!meetingId) {
        setParticipantsView(null);
        try { localStorage.removeItem('home:selectedMeeting'); } catch { /* ignore */ }
        return;
      }
      setParticipantsView({ meetingId, meetingName });
      try { localStorage.setItem('home:selectedMeeting', JSON.stringify({ meetingId, meetingName })); } catch { /* no-op */ }
    };
    window.addEventListener('show-participants', handler as EventListener);
    return () => window.removeEventListener('show-participants', handler as EventListener);
  }, []);

  // 초기 로드시 저장된 선택 복원
  useEffect(() => {
    try {
      const raw = localStorage.getItem('home:selectedMeeting');
      if (raw) {
        const parsed = JSON.parse(raw) as { meetingId: string; meetingName: string };
        if (parsed?.meetingId) {
          setParticipantsView({ meetingId: parsed.meetingId, meetingName: parsed.meetingName });
        }
      }
    } catch { /* ignore */ }
  }, []);

  // 선택된 서버가 여전히 내 멤버십인지 검증 (서버 관리에서 탈퇴 후 홈으로 돌아오면 초기화)
  useEffect(() => {
    const verifyMembership = async () => {
      if (!participantsView?.meetingId) return;
      try {
        const { data: auth } = await supabase.auth.getUser();
        const emailFromAuth = auth.user?.email ?? null;
        if (!emailFromAuth) return;
        const { data: me } = await supabase
          .from('users')
          .select('id')
          .eq('email', emailFromAuth)
          .order('id', { ascending: true })
          .limit(1)
          .maybeSingle();
        const myId = (me?.id as number | undefined) ?? null;
        if (!myId) return;
        const { count } = await supabase
          .from('meeting_members')
          .select('user_id', { count: 'exact', head: true })
          .eq('meeting_id', participantsView.meetingId)
          .eq('user_id', myId);
        if (!count || count === 0) {
          setParticipantsView(null);
          try { localStorage.removeItem('home:selectedMeeting'); } catch { /* ignore */ }
        }
      } catch { /* ignore */ }
    };
    void verifyMembership();
  }, [participantsView]);

  // 설명 카드 실제 높이를 측정해서 저장 (참여자 카드에 동일 적용)
  useEffect(() => {
    const measure = () => {
      if (introCardRef.current) {
        const rect = introCardRef.current.getBoundingClientRect();
        if (rect.height > 0) setIntroCardHeight(Math.round(rect.height));
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const rightPanelWidthClass = useMemo(() => {
    if (up["2xl"]) return "lg:grid-cols-[1fr_420px]";
    if (up.xl) return "lg:grid-cols-[1fr_380px]";
    if (up.lg) return "lg:grid-cols-[1fr_340px]";
    return "";
  }, [up]);

  const pagePaddingClass = useMemo(() => (down.md ? "gap-4" : "gap-6"), [down.md]);

  return (
    <div className={`bg-gray-50 dark:bg-[#18191c] h-screen overflow-hidden grid grid-cols-1 ${rightPanelWidthClass} ${pagePaddingClass} px-0`}> 
      {/* 왼쪽: 기존 메인 콘텐츠 */}
      <div>
        {/* 기존 상단 카드, 2단 카드, 활동 등 기존 코드 전체 */}
        <div className="ml-0 lg:ml-2 mt-2 lg:mt-4">
          <div className="bg-white dark:bg-[#1a1d21] rounded-2xl shadow-xl p-6 mb-6 flex items-center justify-between">
            {/* 왼쪽: 프로필, 이름, 소개글*/}
            <div className="flex items-center gap-6">
              {/* 프로필(이니셜) */}
              {isProfileLoading ? (
                <div className="w-16 h-16 rounded-xl bg-gray-200 dark:bg-[#23242e]" />
              ) : (
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-3xl font-bold shadow"
                  style={{ backgroundColor: profileColor ?? "#7e22ce" }}
                >
                  {initials}
                </div>
              )}
              {/* 이름, 소개글 */}
              <div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {isProfileLoading ? <Skeleton className="h-6 w-40" /> : (profileName ?? email ?? "")}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  소개글: <span className="text-gray-800 dark:text-gray-200">{isProfileLoading ? <Skeleton className="h-4 w-48" /> : (profileBio ?? "소개글을 작성해주세요!")}</span>
                </div>
              </div>
            </div>
            {/* 오른쪽: 편집 링크 */}
            <div className="flex flex-col items-end gap-2">
              <Link to="/workspace/profile" className="text-sm text-blue-600 hover:underline">편집</Link>
            </div>
          </div>
        </div>
        
        {/* 2단 가로 카드 레이아웃 */}
        <div className={`grid grid-cols-1 ${up.md ? "md:grid-cols-2" : ""} ${down.md ? "gap-4" : "gap-6"} items-stretch w-full ml-0 lg:ml-2 mt-2 lg:mt-4`}>
          {/* 왼쪽 카드: 설명 또는 참여자 */}
          {participantsView ? (
            <ParticipantsCard
              meetingId={participantsView.meetingId}
              title={participantsView.meetingName}
              fixedHeight={introCardHeight ?? undefined}
            />
          ) : (
            <div
              ref={introCardRef}
              className="bg-white dark:bg-[#1a1d21] rounded-xl shadow-xl p-8 flex flex-col items-start justify-start"
            >
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Loch
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">
                안녕하세요 Team Loch 입니다! 저희는 졸업작품으로 Discord와 Zoom을 참고로 
                <br/>
                음성 채팅을 이용해 자동으로 회의록이 작성되는 프로그램을 만들었습니다.
                <br/>
                <br/>
                만들어진 회의록을 github에 업로드 할 수 있게 하여 회의록을 공유할 수 있게 하였습니다.
                <br/>
                <br/>
                봐주셔서 감사합니다!!
                <br/>
                팀장: 조용무 팀원: 임현성, 황자준, 오택현
              </p>
            </div>
          )}

          {/* 오른쪽 카드: 내 친구 미리보기 */}
          <div className={`bg-white dark:bg-[#1a1d21] rounded-xl shadow-xl ${down.md ? "p-5" : "p-8"} flex flex-col`}>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">내 친구</h3>
            {isFriendsLoading ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={`friend-skeleton-${i}`} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#23242e]" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            ) : friends.length === 0 ? (
              <div className="text-sm text-gray-500 dark:text-gray-300">친구가 없습니다. 개인 연락처에서 추가해 보세요.</div>
            ) : (
              <div className="flex flex-col gap-3">
                {friends.slice(0, 5).map((f) => (
                  <Link
                    key={f.id}
                    to={`/workspace/contact?friendId=${encodeURIComponent(String(f.id))}`}
                    className="flex items-center hover:bg-gray-50 dark:hover:bg-[#23242e] rounded px-2 py-1"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: f.accent_color }}>
                        {f.nickname.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm text-gray-800 dark:text-gray-100">{f.nickname}</span>
                    </div>
                  </Link>
                ))}
                {friends.length > 5 && (
                  <Link to="/workspace/contact" className="self-end text-xs text-gray-500 dark:text-gray-300 hover:underline">모두 보기</Link>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="w-full px-0 pt-1">
          <div className={`bg-white dark:bg-[#1a1d21] rounded-2xl shadow-xl ${down.md ? "p-4" : "p-6"} ml-0 lg:ml-2 mt-2 lg:mt-4`}>
            {/* 상단: 제목 + 버튼 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-baseline gap-3">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">최근 활동</h2>
                {recentPages.length === 0 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">최근 활동이 없습니다.</span>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowAllModal(true)} className="inline-flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-1 text-sm font-bold hover:bg-gray-100 dark:hover:bg-[#23242e] transition">...</button>
              </div>
            </div>
            
            {/* 리스트 */}
            <div className="space-y-4">
              {/* 최근 방문 페이지 */}
              {recentPages.slice(0, MAX_RECENT).map((item) => (
                <Link
                  to={item.path}
                  key={`${item.path}-${item.ts}`}
                  className="flex items-center gap-4 p-4 border rounded-xl hover:bg-gray-50 dark:hover:bg-[#23242e] transition"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg">
                    <svg width="24" height="24" fill="none"><rect x="4" y="4" width="16" height="16" rx="4" fill="#2563eb"/><rect x="8" y="8" width="8" height="2" rx="1" fill="white"/><rect x="8" y="12" width="8" height="2" rx="1" fill="white"/></svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-blue-700 hover:underline">{getDisplayName(item.path)}</div>
                    <div className="text-xs text-gray-500">방문: {formatVisitedAt(item.ts)}</div>
                  </div>
                </Link>
              ))}
              {recentPages.length === 0 &&
                Array.from({ length: MAX_RECENT }).map((_, idx) => (
                  <div
                    key={`recent-skeleton-${idx}`}
                    className="flex items-center gap-4 p-4 border rounded-xl"
                    aria-hidden
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-[#23242e]" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* 전체 최근 활동 모달 */}
        {showAllModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowAllModal(false)} />
            <div className="relative bg-white dark:bg-[#1a1d21] w-full max-w-lg rounded-xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">전체 최근 활동</h3>
                <button onClick={() => setShowAllModal(false)} className="text-sm text-gray-500 hover:underline">닫기</button>
              </div>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {recentPages.slice(0, MAX_STORE).map((item) => (
                  <Link
                    to={item.path}
                    key={`${item.path}-${item.ts}`}
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-[#23242e] transition"
                    onClick={() => setShowAllModal(false)}
                  >
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded">
                      <svg width="20" height="20" fill="none"><rect x="3" y="3" width="14" height="14" rx="3" fill="#2563eb"/><rect x="6" y="7" width="8" height="2" rx="1" fill="white"/><rect x="6" y="11" width="8" height="2" rx="1" fill="white"/></svg>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-blue-700">{getDisplayName(item.path)}</div>
                      <div className="text-xs text-gray-500">방문: {formatVisitedAt(item.ts)}</div>
                    </div>
                  </Link>
                ))}
                {recentPages.length === 0 && (
                  <div className="text-sm text-gray-500 text-center py-6">최근 활동이 없습니다.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* 오른쪽: Zoom 스타일 블록 */}
      <div className="flex flex-col gap-6 pr-4">
        {/* Zoom 다운로드 블록 */}
        <div className="bg-white dark:bg-[#1a1d21] rounded-xl shadow-xl p-6 flex flex-col items-center text-center max-w-200 ml-2 lg:ml-4 mt-2 lg:mt-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="18" fill="#2563eb"/>
              <path d="M24.5 17.13V14.5C24.5 13.12 23.38 12 22 12H14C12.62 12 11.5 13.12 11.5 14.5V21.5C11.5 22.88 12.62 24 14 24H22C23.38 24 24.5 22.88 24.5 21.5V18.87L27.03 20.7C27.36 20.93 27.81 20.7 27.81 20.3V15.7C27.81 15.3 27.36 15.07 27.03 15.3L24.5 17.13Z" fill="white"/>
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-2">River</h2>
          <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">
            River를 다운로드 하여 사용해보세요!
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-5 py-2 mb-2">
            River 다운로드
          </button>
        </div>
        {/* 미팅 정보 블록 */}
        <div className="bg-white dark:bg-[#1a1d21] rounded-xl shadow-xl p-6 flex flex-col items-center text-center ml-4">
          <RecentServers />
          <Link to="/workspace/manager" className="text-xs text-gray-500 dark:text-gray-300 mb-1 hover:underline cursor-pointer">서버 관리</Link>
          <div className="text-lg font-bold text-gray-800 dark:text-white mb-2 tracking-widest">서버를 관리해 보세요! <button className="ml-1 text-xs text-gray-400"></button>
          </div>
        </div>
        {/* 설정 블록 */}
        <div className="bg-white dark:bg-[#1a1d21] rounded-xl shadow-xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-gray-800 dark:text-white">설정</span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-300 mb-2">설정 버튼을 눌러 설정을 해보세요!</div>
        </div>
        {/* 회의 정보 블록 */}
        <div className="bg-white dark:bg-[#1a1d21] rounded-xl shadow-xl p-23 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-gray-800 dark:text-white">회의</span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-300 mb-2">몇시 몇분 회의인걸 알 수 있게</div>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg px-4 py-2 text-xs w-fit">오디오 테스트</button>
        </div>
      </div>
    </div>
  );
}
