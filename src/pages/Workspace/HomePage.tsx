import { useCallback, useEffect, useState } from "react";
import { Skeleton } from "@/components/common/ui/skeleton";
import { Link } from "react-router";
import { supabase } from "@/lib/supabase";

export default function HomePage() {
  const [email, setEmail] = useState<string | null>(null);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [profileColor, setProfileColor] = useState<string | null>(null);
  const [profileBio, setProfileBio] = useState<string | null>(null);
  const [friends, setFriends] = useState<Array<{ id: number; nickname: string; accent_color: string }>>([]);
  // 사용자 PK가 필요하면 확장 예정
  // const [userPk, setUserPk] = useState<number | null>(null);

  useEffect(() => {
    const loadFromDatabase = async () => {
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
    };

    void loadFromDatabase();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      void loadFromDatabase();
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 간단 친구 목록 로드
  useEffect(() => {
    const loadFriends = async () => {
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

        // profile에서 표시 정보 가져오기
        const ids = Array.from(accepted);
        const { data: profiles } = await supabase
          .from('profile')
          .select('id, nickname, accent_color')
          .in('id', ids);
        const rows = (profiles ?? []).map((p: { id: number; nickname: string | null; accent_color: string | null }) => ({
          id: p.id,
          nickname: (p.nickname && p.nickname.trim()) ? p.nickname : `사용자 #${p.id}`,
          accent_color: (typeof p.accent_color === 'string' && /^#([0-9a-fA-F]{6})$/.test(p.accent_color)) ? p.accent_color : '#7e22ce'
        }));
        setFriends(rows);
      } catch {
        setFriends([]);
      }
    };

    void loadFriends();
    const handler = () => { void loadFriends(); };
    window.addEventListener('friends-updated', handler as EventListener);
    return () => window.removeEventListener('friends-updated', handler as EventListener);
  }, [email]);

  const baseName = profileName ?? email ?? "";
  const initials = (baseName || "").charAt(0).toUpperCase();
  const RECENT_KEY_PREFIX = "recentWorkspacePages:";
  const getRecentKey = useCallback(() => `${RECENT_KEY_PREFIX}${email ?? "anonymous"}`, [email]);
  const MAX_RECENT = 4; // 화면에 표시 개수
  const MAX_STORE = 10; // 모달에서 최대 10개까지 표시
  const [recentPages, setRecentPages] = useState<Array<{ path: string; ts: number }>>([]);
  const [showAllModal, setShowAllModal] = useState(false);

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

  return (
    <div className="bg-gray-50 dark:bg-[#18191c] min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
      {/* 왼쪽: 기존 메인 콘텐츠 */}
      <div>
        {/* 기존 상단 카드, 2단 카드, 활동 등 기존 코드 전체 */}
        <div className="ml-2 lg:ml-4 mt-2 lg:mt-4">
          <div className="bg-white dark:bg-[#1a1d21] rounded-2xl shadow-xl p-6 mb-6 flex items-center justify-between">
            {/* 왼쪽: 프로필, 이름, 소개글*/}
            <div className="flex items-center gap-6">
              {/* 프로필(이니셜) */}
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-3xl font-bold shadow"
                style={{ backgroundColor: profileColor ?? "#7e22ce" }}
              >
                {initials}
              </div>
              {/* 이름, 소개글 */}
              <div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">{profileName ?? email ?? ""}</div>
                <div className="text-sm text-gray-500 mt-1">
                  소개글: <span className="text-gray-800 dark:text-gray-200">{profileBio ?? "소개글을 작성해주세요!"}</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch w-full ml-2 lg:ml-4 mt-2 lg:mt-4">
          {/* 왼쪽 카드: Loch 설명 */}
          <div className="bg-white dark:bg-[#1a1d21] rounded-xl shadow-xl p-8 flex flex-col items-start justify-start">
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

          {/* 오른쪽 카드: 내 친구 미리보기 */}
          <div className="bg-white dark:bg-[#1a1d21] rounded-xl shadow-xl p-8 flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">내 친구</h3>
            {friends.length === 0 ? (
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

        <div className="w-full px-1 pt-1">
          <div className="bg-white dark:bg-[#1a1d21] rounded-2xl shadow-xl p-6 ml-2 lg:ml-4 mt-2 lg:mt-4">
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
          <div className="flex gap-4 mb-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-1">
                <svg width='24' height='24' fill='none'><rect x='4' y='4' width='16' height='16' rx='8' fill='#2563eb'/><path d='M12 8v8M8 12h8' stroke='white' strokeWidth='2' strokeLinecap='round'/></svg>
              </div>
              <span className="text-xs text-gray-700 dark:text-gray-200">예약</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-1">
                <svg width='24' height='24' fill='none'><rect x='4' y='4' width='16' height='16' rx='8' fill='#2563eb'/><path d='M12 8v8' stroke='white' strokeWidth='2' strokeLinecap='round'/></svg>
              </div>
              <span className="text-xs text-gray-700 dark:text-gray-200">참여하기</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mb-1">
                <svg width='24' height='24' fill='none'><rect x='4' y='4' width='16' height='16' rx='8' fill='#fb923c'/><path d='M8 12h8' stroke='white' strokeWidth='2' strokeLinecap='round'/></svg>
              </div>
              <span className="text-xs text-gray-700 dark:text-gray-200">주최자</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-300 mb-1">서버 관리 들어갈 수 있ㄱ</div>
          <div className="text-lg font-bold text-gray-800 dark:text-white mb-2 tracking-widest">517 579 9787 <button className="ml-1 text-xs text-gray-400">📋</button>
          </div>
        </div>
        {/* 설정 블록 */}
        <div className="bg-white dark:bg-[#1a1d21] rounded-xl shadow-xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-gray-800 dark:text-white">설정</span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-300 mb-2">설정 들어갈 수 있게(톱니바퀴 이미지 추가해서)</div>
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
