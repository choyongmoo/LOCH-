import React, { useState } from "react";
import { useThemeStore } from "@/store/themeStore";
//

// FriendItem 컴포넌트
interface FriendItemProps {
  name: string;
  nickname: string;
  accent_color: string;
  selected: boolean;
  onClick: () => void;
  onDelete: () => void;
}

const FriendItem: React.FC<FriendItemProps & { theme: 'dark' | 'light' }> = ({ nickname, accent_color, selected, onClick, onDelete, theme }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 12px',
        gap: 12,
        background: selected
          ? (theme === 'dark' ? '#393c41' : '#e5e7eb')
          : (hovered ? (theme === 'dark' ? '#2c2f33' : '#f1f5f9') : 'transparent'),
        cursor: 'pointer',
        borderRadius: 6,
        margin: '2px 4px',
        position: 'relative',
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: accent_color,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
          fontWeight: 700,
          fontSize: 18,
        }}
      >
        {nickname.charAt(0).toUpperCase()}
      </div>
      <span style={{ fontSize: 16, color: theme === 'dark' ? '#fff' : '#23272a' }}>{nickname}</span>
      {/* delete small x */}
      <button
        aria-label="친구 삭제"
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        style={{
          marginLeft: 'auto',
          background: 'transparent',
          border: 'none',
          color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
          cursor: 'pointer',
          fontSize: 14,
          padding: 2,
          opacity: hovered ? 1 : 0,
          pointerEvents: hovered ? 'auto' : 'none',
          transition: 'opacity 120ms ease-in-out',
        }}
        title="삭제"
      >
        ×
      </button>
    </div>
  );
};

type Friend = { id: number; name: string | null; email: string; nickname?: string; accent_color?: string };

interface FriendsSidebarProps {
  selectedFriend: string | null;
  onSelect: (name: string) => void;
  onOpenAdd: () => void;
  friends: Friend[];
}

const FriendsSidebar: React.FC<FriendsSidebarProps & { onDelete: (id: number) => void }> = ({ selectedFriend, onSelect, onOpenAdd, friends, onDelete }) => {
  const { theme } = useThemeStore();
  return (
    <aside
      style={{
        width: 260,
        background: theme === 'dark' ? '#1E1F2B' : '#f3f4f6',
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        borderRight: theme === 'dark' ? "1px solid #2c2f33" : "1px solid #e5e7eb",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", padding: "16px 12px", gap: 8 }}>
        <span style={{ color: theme === 'dark' ? "#fff" : "#23272a", fontWeight: 700, fontSize: 18 }}>친구</span>
        <button
          style={{
            marginLeft: "auto",
            background: theme === 'dark' ? '#111827' : '#e0e7ff',
            color: theme === 'dark' ? '#fff' : '#23272a',
            border: 'none',
            borderRadius: 4,
            padding: '6px 14px',
            fontWeight: 500,
            cursor: 'pointer',
            fontSize: 14,
            fontFamily: 'Bold',
          }}
          onClick={onOpenAdd}
        >+</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: friends.length === 0 ? '12px' : undefined }}>
        {friends.length === 0 ? (
          <div style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
            textAlign: 'center',
            fontSize: 14,
            padding: '0 8px',
          }}>
            친구를 추가해주세요!
          </div>
        ) : (
          friends.map((friend) => {
            const displayNickname = friend.nickname && friend.nickname.trim() ? friend.nickname : (friend.name ?? friend.email);
            return (
              <FriendItem
                key={friend.id}
                name={friend.name ?? friend.email}
                nickname={displayNickname}
                accent_color={friend.accent_color ?? '#7e22ce'}
                selected={selectedFriend === displayNickname}
                onClick={() => onSelect(displayNickname)}
                onDelete={() => onDelete(friend.id)}
                theme={theme}
              />
            );
          })
        )}
      </div>
    </aside>
  );
};

// ChatBox 컴포넌트
interface Message {
  sender: string;
  text: string;
  timestamp: number;
}

interface ChatBoxProps {
  friend: { name: string; accentColor: string };
  messages: Message[];
  onSend: (text: string) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ friend, messages, onSend }) => {
  const [input, setInput] = useState("");
  const { theme } = useThemeStore();

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: theme === 'dark' ? '#313338' : '#f4f4f4', flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px', borderBottom: theme === 'dark' ? '1px solid #23272a' : '1px solid #e5e7eb', gap: 12, background: theme === 'dark' ? '#23272a' : '#fff' }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: friend.accentColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
          {friend.name.charAt(0).toUpperCase()}
        </div>
        <span style={{ color: theme === 'dark' ? '#fff' : '#23272a', fontWeight: 600, fontSize: 18 }}>{friend.name}</span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.length === 0 ? (
          <span style={{ color: theme === 'dark' ? '#aaa' : '#666', textAlign: 'center', marginTop: 40 }}>메시지가 없습니다. 대화를 시작해보세요!</span>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'me' ? 'flex-end' : 'flex-start' }}>
              <div
                style={{
                  background: msg.sender === 'me'
                    ? (theme === 'dark' ? '#5865f2' : '#6366f1')
                    : (theme === 'dark' ? '#40444b' : '#e5e7eb'),
                  color: theme === 'dark' ? '#fff' : '#23272a',
                  borderRadius: 12,
                  padding: '8px 14px',
                  maxWidth: 320,
                  fontSize: 15,
                }}
              >
                {msg.text}
              </div>
              <span style={{ fontSize: 11, color: theme === 'dark' ? '#888' : '#999', marginTop: 2 }}>
                {new Date(msg.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleSend} style={{ display: 'flex', padding: '16px', borderTop: theme === 'dark' ? '1px solid #23272a' : '1px solid #e5e7eb', background: theme === 'dark' ? '#23272a' : '#fff' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="메시지를 입력하세요..."
          style={{
            flex: 1,
            border: 'none',
            borderRadius: 6,
            padding: '10px 14px',
            fontSize: 15,
            outline: 'none',
            background: theme === 'dark' ? '#40444b' : '#f1f5f9',
            color: theme === 'dark' ? '#fff' : '#23272a',
          }}
        />
        <button
          type="submit"
          style={{
            marginLeft: 8,
            background: theme === 'dark' ? '#5865f2' : '#6366f1',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '10px 18px',
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
          }}
        >전송</button>
      </form>
    </div>
  );
};

export default function ContactPage() {
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  // 친구별 메시지 상태 관리 (friendId 기준)
  const [messages, setMessages] = useState<Record<number, Message[]>>({});
  const { theme } = useThemeStore();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Array<{ id: number; name: string | null; email: string }>>([]);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [myId, setMyId] = useState<number | null>(null);
  const [pendingOut, setPendingOut] = useState<Set<number>>(new Set());
  const [pendingIn, setPendingIn] = useState<Set<number>>(new Set());
  const [acceptedSet, setAcceptedSet] = useState<Set<number>>(new Set());
  // 입력 디바운스 자동 검색
  React.useEffect(() => {
    const timer = setTimeout(async () => {
      const q = search.trim();
      if (q.length === 0) {
        setResults([]);
        return;
      }
      try {
        setAddError(null);
        const { supabase } = await import("@/lib/supabase");
        const { data: authData } = await supabase.auth.getUser();
        const selfEmail = authData.user?.email ?? null;
        const { data, error } = await supabase
          .from('users')
          .select('id, name, email')
          .or(`email.ilike.*${q}*,name.ilike.*${q}*`)
          .neq('email', selfEmail)
          .limit(10);
        if (error) throw error;
        const rows = (data ?? []) as Array<{ id: number; name: string | null; email: string }>;
        const filtered = rows.filter((u) => !pendingOut.has(u.id) && !pendingIn.has(u.id) && !acceptedSet.has(u.id));
        setResults(filtered);
      } catch (e) {
        setAddError(e instanceof Error ? e.message : '검색 실패');
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [search, pendingOut, pendingIn, acceptedSet]);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // 삭제 확인 열기
  const askRemoveFriend = (friendId: number) => {
    setConfirmDeleteId(friendId);
    setConfirmVisible(true);
  };

  // 친구 삭제 핸들러
  const removeFriend = async (friendId: number) => {
    try {
      if (!myId) return;
      setDeleteError(null);
      setDeleteBusy(true);
      const { supabase } = await import("@/lib/supabase");
      // 완전 삭제: 관계/대화/메시지 제거
      const { error: relErr } = await supabase
        .from('friend_requests')
        .delete()
        .or(`and(requester_id.eq.${myId},addressee_id.eq.${friendId}),and(requester_id.eq.${friendId},addressee_id.eq.${myId})`);
      if (relErr) throw relErr;

      const a = Math.min(myId, friendId);
      const b = Math.max(myId, friendId);
      const { data: convRows } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(user1_id.eq.${a},user2_id.eq.${b}),and(user1_id.eq.${b},user2_id.eq.${a})`);
      const convIds = (convRows ?? []).map((r: { id: number }) => r.id);
      if (convIds.length > 0) {
        await supabase.from('messages').delete().in('conversation_id', convIds);
        await supabase.from('conversations').delete().in('id', convIds);
      }
      await supabase
        .from('messages')
        .delete()
        .or(`and(sender_id.eq.${myId},receiver_id.eq.${friendId}),and(sender_id.eq.${friendId},receiver_id.eq.${myId})`);
      // 로컬 채팅 기록 제거 (삭제한 사람에게만 사라지도록)
      try { localStorage.removeItem(`dm:${myId}:${friendId}`); } catch { /* no-op */ }
      setMessages(prev => {
        const copy = { ...prev } as Record<number, Message[]>;
        delete copy[friendId];
        return copy;
      });
      // 현재 선택된 친구면 선택 해제
      const sel = friends.find(f => {
        const dn = f.nickname && f.nickname.trim() ? f.nickname : (f.name ?? f.email);
        return dn === selectedFriend;
      });
      if (sel?.id === friendId) setSelectedFriend(null);
      // 목록 새로고침
      await loadMyRelations();
      try { window.dispatchEvent(new CustomEvent('friends-updated')); } catch { /* no-op */ }
      setConfirmVisible(false);
      setConfirmDeleteId(null);
    } catch {
      setDeleteError('삭제 중 오류가 발생했습니다.');
    } finally {
      setDeleteBusy(false);
    }
  };

  // 내 사용자 id 및 친구 관계 캐시 로드
  const loadMyRelations = async () => {
    try {
      const { supabase } = await import("@/lib/supabase");
      const { data: authData } = await supabase.auth.getUser();
      const selfEmail = authData.user?.email ?? null;
      if (!selfEmail) return;
      const { data: me } = await supabase
        .from('users')
        .select('id')
        .eq('email', selfEmail)
        .order('id', { ascending: true })
        .limit(1)
        .maybeSingle();
      const my = (me?.id as number | undefined) ?? null;
      if (!my) return;
      setMyId(my);
      const { data: fr } = await supabase
        .from('friend_requests')
        .select('requester_id, addressee_id, status')
        .or(`requester_id.eq.${my},addressee_id.eq.${my}`);
      const pOut = new Set<number>();
      const pIn = new Set<number>();
      const acc = new Set<number>();
      (fr ?? []).forEach((r: { requester_id: number; addressee_id: number; status: string }) => {
        if (r.status === 'accepted') {
          const other = r.requester_id === my ? r.addressee_id : r.requester_id;
          acc.add(other);
        } else if (r.status === 'pending') {
          if (r.requester_id === my) pOut.add(r.addressee_id);
          if (r.addressee_id === my) pIn.add(r.requester_id);
        }
      });
      setPendingOut(pOut);
      setPendingIn(pIn);
      setAcceptedSet(acc);
      // 친구 목록 불러오기
      if (acc.size > 0) {
        const ids = Array.from(acc);
        const { data: rows } = await (await import("@/lib/supabase")).supabase
          .from('users')
          .select('id,name,email')
          .in('id', ids);
        // profile 정보도 함께 불러오기
        const { data: profiles } = await (await import("@/lib/supabase")).supabase
          .from('profile')
          .select('id, nickname, accent_color')
          .in('id', ids);
        // profileMap 타입 명확화
        const profileMap = new Map<number, { id: number; nickname: string; accent_color: string }>((profiles ?? []).map((p: { id: number; nickname: string; accent_color: string }) => [p.id, p]));
        const mergedFriends = (rows ?? []).map((u: { id: number; name: string | null; email: string }) => ({
          ...u,
          nickname: profileMap.get(u.id)?.nickname ?? u.name ?? u.email,
          accent_color: profileMap.get(u.id)?.accent_color ?? "#7e22ce",
        }));
        setFriends(mergedFriends);
      } else {
        setFriends([]);
      }
    } catch {
      // ignore
    }
  };

  // 친구 수락/거절 등 외부 이벤트에 반응해 목록 갱신
  React.useEffect(() => {
    const handler = () => { void loadMyRelations(); };
    window.addEventListener('friends-updated', handler as EventListener);
    return () => window.removeEventListener('friends-updated', handler as EventListener);
  }, []);

  // 최초 로드
  React.useEffect(() => { void loadMyRelations(); }, []);

  const handleSend = (text: string) => {
    if (!selectedFriend) return;
    const friend = friends.find(f => {
      const displayNickname = f.nickname && f.nickname.trim() ? f.nickname : (f.name ?? f.email);
      return displayNickname === selectedFriend;
    });
    if (!friend?.id || !myId) return;
    const friendId = friend.id;
    const next = {
      sender: 'me',
      text,
      timestamp: Date.now(),
    } as Message;
    setMessages(prev => {
      const updated = { ...prev, [friendId]: [ ...(prev[friendId] || []), next ] };
      try {
        const key = `dm:${myId}:${friendId}`;
        localStorage.setItem(key, JSON.stringify(updated[friendId]));
      } catch { /* no-op */ }
      return updated;
    });

    // 서버 저장 (비동기, 실패해도 UI는 유지)
    (async () => {
      try {
        const { supabase } = await import("@/lib/supabase");
        // 1) 대화방(conversations) 찾기/만들기
        const a = Math.min(myId, friendId);
        const b = Math.max(myId, friendId);
        let convId: number | null = null;
        const { data: found } = await supabase
          .from('conversations')
          .select('id')
          .or(`and(user1_id.eq.${a},user2_id.eq.${b}),and(user1_id.eq.${b},user2_id.eq.${a})`)
          .maybeSingle();
        if (found?.id) {
          convId = found.id as number;
        } else {
          const { data: inserted } = await supabase
            .from('conversations')
            .insert({ user1_id: a, user2_id: b })
            .select('id')
            .single();
          convId = inserted?.id ?? null;
        }
        // 2) 메시지 저장(conversation_id 포함)
        await supabase
          .from('messages')
          .insert({ sender_id: myId, receiver_id: friendId, content: text, conversation_id: convId });
      } catch { /* no-op */ }
    })();
  };

  const selectedFriendObj = friends.find(f => {
    const displayNickname = f.nickname && f.nickname.trim() ? f.nickname : (f.name ?? f.email);
    return displayNickname === selectedFriend;
  }) || null;

  // 선택된 친구 대화 내역을 로컬스토리지에서 필요 시 지연 로드
  React.useEffect(() => {
    if (!myId || !selectedFriendObj?.id) return;
    const friendId = selectedFriendObj.id;
    if (messages[friendId]) return; // 이미 메모리에 있으면 스킵
    (async () => {
      // 1) 서버 기록 로드
      try {
        const { supabase } = await import("@/lib/supabase");
        type DbMessage = { sender_id: number; receiver_id: number; content?: string | null; created_at?: string | null };
        const { data } = await supabase
          .from('messages')
          .select('sender_id, receiver_id, content, created_at')
          .or(`and(sender_id.eq.${myId},receiver_id.eq.${friendId}),and(sender_id.eq.${friendId},receiver_id.eq.${myId})`)
          .order('created_at', { ascending: true })
          .limit(200);
        const list = (data ?? []).map((r: DbMessage) => ({
          sender: r.sender_id === myId ? 'me' : 'friend',
          text: r.content ?? '',
          timestamp: new Date(r.created_at ?? Date.now()).getTime(),
        })) as Message[];
        if (list.length > 0) {
          setMessages(prev => ({ ...prev, [friendId]: list }));
          try { localStorage.setItem(`dm:${myId}:${friendId}`, JSON.stringify(list)); } catch { /* no-op */ }
          return;
        }
      } catch { /* ignore and fallback to local */ }

      // 2) 로컬 기록 로드 (서버가 없으면)
      try {
        const key = `dm:${myId}:${friendId}`;
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw) as Message[];
          setMessages(prev => ({ ...prev, [friendId]: parsed }));
        }
      } catch { /* no-op */ }
    })();
  }, [myId, selectedFriendObj?.id, messages]);

  // 내게 도착하는 새 메시지 실시간 구독
  React.useEffect(() => {
    if (!myId) return;
    let cleanup: (() => void) | null = null;
    (async () => {
      const { supabase } = await import("@/lib/supabase");
      const channel = supabase
        .channel(`dm-inbox:${myId}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${myId}` }, (payload: { new: { sender_id: number; receiver_id: number; content?: string | null; created_at?: string | null } }) => {
          const row = payload.new;
          const senderId = row.sender_id as number;
          const text = (row.content ?? '') as string;
          const ts = new Date(row.created_at ?? Date.now()).getTime();
          const msg: Message = { sender: 'friend', text, timestamp: ts };
          setMessages(prev => {
            const updated = { ...prev, [senderId]: [ ...(prev[senderId] || []), msg ] };
            try { localStorage.setItem(`dm:${myId}:${senderId}`, JSON.stringify(updated[senderId])); } catch { /* no-op */ }
            return updated;
          });
        })
        .subscribe();
      cleanup = () => { supabase.removeChannel(channel); };
    })();
    return () => { if (cleanup) cleanup(); };
  }, [myId]);

  return (
    <div className={theme === 'dark' ? 'theme-dark' : 'theme-light'} style={{ display: 'flex', height: '100vh', width: 'calc(83.7vw)', background: theme === 'dark' ? '#313338' : '#f4f4f4', position: 'relative' }}>
      <FriendsSidebar selectedFriend={selectedFriend} onSelect={setSelectedFriend} onOpenAdd={() => setShowAdd(true)} friends={friends} onDelete={askRemoveFriend} />
      <div style={{ flex: 1, minWidth: 0 }}>
        {selectedFriendObj ? (
          <ChatBox
            friend={{
              name: selectedFriendObj ? (selectedFriendObj.nickname && selectedFriendObj.nickname.trim() ? selectedFriendObj.nickname : (selectedFriendObj.name ?? selectedFriendObj.email)) : '',
              accentColor: selectedFriendObj?.accent_color ?? '#7e22ce',
            }}
            messages={selectedFriendObj ? (messages[selectedFriendObj.id] || []) : []}
            onSend={handleSend}
          />
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme === 'dark' ? '#aaa' : '#333', fontSize: 16 }}>
            {friends.length === 0 ? '친구를 추가해주세요!' : '채팅할 친구를 선택하세요.'}
          </div>
        )}
      </div>

      {/* 친구 삭제 확인 모달 */}
      {confirmVisible && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }} onClick={() => setConfirmVisible(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: theme === 'dark' ? '#23272a' : '#fff', color: theme === 'dark' ? '#fff' : '#111827', width: 380, borderRadius: 12, padding: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>정말로 삭제하시겠습니까?</div>
            <div style={{ fontSize: 12, color: theme === 'dark' ? '#9CA3AF' : '#6B7280', marginBottom: 12 }}>친구 관계와 해당 친구와의 대화가 삭제됩니다. 이 작업은 되돌릴 수 없습니다.</div>
            {deleteError && <div style={{ color: '#ef4444', fontSize: 12, marginBottom: 8 }}>{deleteError}</div>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={() => setConfirmVisible(false)} disabled={deleteBusy} style={{ padding: '8px 12px', borderRadius: 8, background: theme === 'dark' ? '#374151' : '#e5e7eb', color: theme === 'dark' ? '#fff' : '#111827', fontWeight: 600 }}>취소</button>
              <button onClick={() => { if (confirmDeleteId != null) removeFriend(confirmDeleteId); }} disabled={deleteBusy} style={{ padding: '8px 12px', borderRadius: 8, background: '#ef4444', color: '#fff', fontWeight: 700 }}>{deleteBusy ? '삭제 중...' : '삭제'}</button>
            </div>
          </div>
        </div>
      )}

      {/* 친구 추가 모달 */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }} onClick={() => setShowAdd(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: theme === 'dark' ? '#23272a' : '#fff', color: theme === 'dark' ? '#fff' : '#111827', width: 420, borderRadius: 12, padding: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>친구 추가</div>
            <div style={{ fontSize: 12, color: theme === 'dark' ? '#9CA3AF' : '#6B7280', marginBottom: 8 }}>이메일 또는 이름 일부를 입력하세요.</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    setAddError(null);
                    try {
                      const q = search.trim();
                      if (!q) { setResults([]); return; }
                      const { supabase } = await import("@/lib/supabase");
                      const { data: authData } = await supabase.auth.getUser();
                      const selfEmail = authData.user?.email ?? null;
                      const { data, error } = await supabase
                        .from('users')
                        .select('id, name, email')
                        .or(`email.ilike.*${q}*,name.ilike.*${q}*`)
                        .neq('email', selfEmail)
                        .limit(10);
                      if (error) throw error;
                      await loadMyRelations();
                      const rows = (data ?? []) as Array<{ id: number; name: string | null; email: string }>;
                      const filtered = rows.filter((u) => !pendingOut.has(u.id) && !pendingIn.has(u.id) && !acceptedSet.has(u.id));
                      setResults(filtered);
                    } catch (err) {
                      setAddError(err instanceof Error ? err.message : '검색 실패');
                    }
                  }
                }}
                placeholder="이메일 또는 이름"
                style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db', outline: 'none', background: theme === 'dark' ? '#40444b' : '#f9fafb', color: theme === 'dark' ? '#fff' : '#111827' }}
              />
              <button onClick={async () => {
                setAddError(null);
                try {
                  const q = search.trim();
                  if (!q) { setResults([]); return; }
                  // 본인 제외하고 users 검색 + 관계 필터링
                  const { supabase } = await import("@/lib/supabase");
                  const { data: authData } = await supabase.auth.getUser();
                  const selfEmail = authData.user?.email ?? null;
                  const { data, error } = await supabase
                    .from('users')
                    .select('id, name, email')
                    .or(`email.ilike.*${q}*,name.ilike.*${q}*`)
                    .neq('email', selfEmail)
                    .limit(10);
                  if (error) throw error;
                  // 관계 로드 최신화
                  await loadMyRelations();
                  const rows = (data ?? []) as Array<{ id: number; name: string | null; email: string }>;
                  const filtered = rows.filter((u) => !pendingOut.has(u.id) && !pendingIn.has(u.id) && !acceptedSet.has(u.id));
                  setResults(filtered);
                } catch (e) {
                  setAddError(e instanceof Error ? e.message : '검색 실패');
                }
              }} style={{ padding: '10px 12px', borderRadius: 8, background: theme === 'dark' ? '#111827' : '#3b82f6', color: '#fff', fontWeight: 600 }}>검색</button>
            </div>
            {addError && <div style={{ color: '#ef4444', fontSize: 12, marginBottom: 8 }}>{addError}</div>}
            <div style={{ maxHeight: 260, overflowY: 'auto', display: 'grid', gap: 8 }}>
              {results.map((u) => (
                <div key={u.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 10, border: '1px solid #e5e7eb', borderRadius: 10, background: theme === 'dark' ? '#1f2937' : '#fff' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600 }}>{u.name ?? u.email}</span>
                    <span style={{ fontSize: 12, color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}>{u.email}</span>
                  </div>
                  <button disabled={adding} onClick={async () => {
                    setAddError(null);
                    try {
                      setAdding(true);
                      const { supabase } = await import("@/lib/supabase");
                      if (!myId) {
                        await loadMyRelations();
                      }
                      if (!myId) throw new Error('내 사용자 정보를 찾을 수 없습니다');
                      // 기존 쌍 레코드 제거 후 새 요청 생성
                      await supabase
                        .from('friend_requests')
                        .delete()
                        .or(`and(requester_id.eq.${myId},addressee_id.eq.${u.id}),and(requester_id.eq.${u.id},addressee_id.eq.${myId})`);

                      const { error: insErr } = await supabase
                        .from('friend_requests')
                        .insert({ requester_id: myId, addressee_id: u.id, status: 'pending' });
                      if (insErr) throw insErr;
                      setResults((prev) => prev.filter((x) => x.id !== u.id));
                      // 친구 요청 생성 후 이벤트 알림 (에러는 무시)
                      try { window.dispatchEvent(new CustomEvent('friends-updated')); } catch { /* no-op */ }
                    } catch (e) {
                      setAddError(e instanceof Error ? e.message : '요청 실패');
                    } finally {
                      setAdding(false);
                    }
                  }} style={{ padding: '8px 12px', borderRadius: 8, background: '#10b981', color: '#fff', fontWeight: 600 }}>{adding ? '요청 중...' : '요청'}</button>
                </div>
              ))}
              {results.length === 0 && <div style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280', fontSize: 12, textAlign: 'center' }}>검색 결과가 없습니다.</div>}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
              <button onClick={() => setShowAdd(false)} style={{ padding: '8px 12px', borderRadius: 8, background: theme === 'dark' ? '#374151' : '#e5e7eb', color: theme === 'dark' ? '#fff' : '#111827', fontWeight: 600 }}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}