
import { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import type { MeetingDetailsModalProps } from "@/pages/Meeting/types";

interface Friend {
  id: number;
  nickname: string;
  accent_color: string;
}

export const MeetingDetailsModal = ({
  visible,
  onClose,
  meetingInfo,
}: MeetingDetailsModalProps) => {
  const [inviteLink, setInviteLink] = useState<string>('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoadingFriends, setIsLoadingFriends] = useState<boolean>(false);

  // 친구 목록 로드
  const loadFriends = async () => {
    setIsLoadingFriends(true);
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
    } catch (error) {
      console.error('친구 목록 로드 실패:', error);
      setFriends([]);
    } finally {
      setIsLoadingFriends(false);
    }
  };

  // 초대 링크 생성
  const generateInviteLink = () => {
    const baseUrl = window.location.origin;
    const meetingId = roomInfo.roomId;
    const link = `${baseUrl}/meeting/${meetingId}`;
    setInviteLink(link);
    setShowInviteModal(true);
  };

  // 링크 복사
  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      alert('초대 링크가 클립보드에 복사되었습니다!');
    } catch (err) {
      // 클립보드 API가 지원되지 않는 경우
      const textArea = document.createElement('textarea');
      textArea.value = inviteLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('초대 링크가 클립보드에 복사되었습니다!');
    }
  };

  // 친구에게 초대 링크 보내기 (workspace 1대1 채팅)
  const sendInviteToFriend = async (friendId: number, friendName: string) => {
    try {
      const { data: authData } = await supabase.auth.getUser();
      const emailFromAuth = authData.user?.email ?? null;
      if (!emailFromAuth) {
        alert('로그인이 필요합니다.');
        return;
      }

      // 내 users.id 조회
      const { data: me } = await supabase
        .from('users')
        .select('id')
        .eq('email', emailFromAuth)
        .order('id', { ascending: true })
        .limit(1)
        .maybeSingle();
      const myId = (me?.id as number | undefined) ?? null;
      if (!myId) {
        alert('사용자 정보를 찾을 수 없습니다.');
        return;
      }

      // 초대 메시지 생성
      const inviteMessage = `회의방에 초대합니다: ${inviteLink}`;

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

      if (!convId) {
        alert('대화방을 생성할 수 없습니다.');
        return;
      }

      // 2) 메시지 저장
      const { error } = await supabase
        .from('messages')
        .insert({ 
          sender_id: myId, 
          receiver_id: friendId, 
          content: inviteMessage, 
          conversation_id: convId 
        });

      if (error) {
        throw error;
      }

      alert(`${friendName}에게 초대 링크를 보냈습니다!`);
      
      // workspace로 이동하여 해당 친구와의 채팅창 열기
      const workspaceUrl = `/workspace/contact?friendId=${friendId}`;
      window.open(workspaceUrl, '_blank');
      
    } catch (error) {
      console.error('초대 링크 전송 실패:', error);
      alert('초대 링크 전송에 실패했습니다.');
    }
  };

  // 초대 모달이 열릴 때 친구 목록 로드
  useEffect(() => {
    if (showInviteModal) {
      loadFriends();
    }
  }, [showInviteModal]);

  // 검색된 친구 목록 필터링
  const filteredFriends = friends.filter(friend =>
    friend.nickname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 현재 시간
  const currentTime = new Date().toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  // 회의방 정보 (props로 받거나 기본값 사용)
  const roomInfo = meetingInfo || {
    roomName: "프로젝트 기획 회의",
    roomId: "MEET-2024-001",
    createdAt: "2024-01-15",
    host: "김팀장",
    status: "진행중",
    participants: 8,
    maxParticipants: 12,
    duration: "2시간 30분",
    description: "Q1 프로젝트 기획 및 일정 조율을 위한 회의입니다."
  };

  // 조건부 렌더링 (모든 hooks 호출 후에)
  if (!visible) return null;

  return (
    <div>
      <div
        className="fixed inset-0"
        onClick={onClose}
      />
      <div
        className="
          fixed top-1/2 left-1/2 max-w-4xl w-full bg-[#2F3136] rounded-2xl shadow-xl
          transform -translate-x-1/2 -translate-y-1/2 z-50 text-white overflow-hidden
        "
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-[#4F545C]">
          <h2 className="text-2xl font-bold text-[#7289DA]">회의방 상세정보</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="flex">
          {/* 왼쪽 - 큰 이미지 영역 */}
          <div className="w-1/3 p-6 bg-gradient-to-br from-[#5865F2] to-[#7289DA] flex flex-col items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-6xl">🏢</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{roomInfo.roomName}</h3>
              <p className="text-sm opacity-80">회의방 ID: {roomInfo.roomId}</p>
            </div>
          </div>

          {/* 오른쪽 - 정보 영역 */}
          <div className="w-2/3 p-6">
            <div className="space-y-6">
              {/* 기본 정보 */}
              <div>
                <h4 className="text-lg font-semibold mb-3 text-[#7289DA] flex items-center">
                  📋 기본 정보
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#40444B] p-3 rounded-lg">
                    <p className="text-sm text-gray-400">회의명</p>
                    <p className="font-medium">{roomInfo.roomName}</p>
                  </div>
                  <div className="bg-[#40444B] p-3 rounded-lg">
                    <p className="text-sm text-gray-400">회의 ID</p>
                    <p className="font-medium">{roomInfo.roomId}</p>
                  </div>
                  <div className="bg-[#40444B] p-3 rounded-lg">
                    <p className="text-sm text-gray-400">생성일</p>
                    <p className="font-medium">{roomInfo.createdAt}</p>
                  </div>
                  <div className="bg-[#40444B] p-3 rounded-lg">
                    <p className="text-sm text-gray-400">호스트</p>
                    <p className="font-medium">{roomInfo.host}</p>
                  </div>
                </div>
              </div>

              {/* 현재 상태 */}
              <div>
                <h4 className="text-lg font-semibold mb-3 text-[#7289DA] flex items-center">
                  📊 현재 상태
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#40444B] p-3 rounded-lg text-center">
                    <p className="text-sm text-gray-400">상태</p>
                    <p className="font-medium text-green-400">{roomInfo.status}</p>
                  </div>
                  <div className="bg-[#40444B] p-3 rounded-lg text-center">
                    <p className="text-sm text-gray-400">참가자</p>
                    <p className="font-medium">{roomInfo.participants}/{roomInfo.maxParticipants}</p>
                  </div>
                  <div className="bg-[#40444B] p-3 rounded-lg text-center">
                    <p className="text-sm text-gray-400">진행 시간</p>
                    <p className="font-medium">{roomInfo.duration}</p>
                  </div>
                </div>
              </div>

              {/* 설명 */}
              <div>
                <h4 className="text-lg font-semibold mb-3 text-[#7289DA] flex items-center">
                  📝 회의 설명
                </h4>
                <div className="bg-[#40444B] p-4 rounded-lg">
                  <p className="text-sm leading-relaxed">{roomInfo.description}</p>
                </div>
              </div>

              {/* 현재 시간 */}
              <div>
                <h4 className="text-lg font-semibold mb-3 text-[#7289DA] flex items-center">
                  🕐 현재 시간
                </h4>
                <div className="bg-[#40444B] p-3 rounded-lg">
                  <p className="font-medium">{currentTime}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-end gap-3 p-6 border-t border-[#4F545C]">
          <button
            onClick={generateInviteLink}
            className="px-6 py-2 bg-[#57F287] rounded-lg hover:bg-[#3ba55c] transition-colors font-medium flex items-center gap-2"
          >
            <span>🎯</span>
            친구 초대
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#5865F2] rounded-lg hover:bg-[#4752c4] transition-colors font-medium"
          >
            닫기
          </button>
        </div>
      </div>

      {/* 초대 모달 */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-[#2F3136] rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            {/* 헤더 */}
            <div className="flex items-center justify-between p-6 border-b border-[#4F545C]">
              <div>
                <h3 className="text-xl font-bold text-white">친구를 {roomInfo.roomName}으로 초대하기</h3>
                <p className="text-gray-400 text-sm mt-1"># 일반</p>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-gray-400 hover:text-white transition-colors text-2xl"
              >
                ×
              </button>
            </div>

            {/* 친구 찾기 */}
            <div className="p-6 border-b border-[#4F545C]">
              <div className="relative">
                <input
                  type="text"
                  placeholder="친구 찾기"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 bg-[#40444B] text-white rounded-lg border border-[#4F545C] focus:outline-none focus:border-[#5865F2] pr-10"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </div>
              </div>
            </div>

            {/* 친구 목록 */}
            <div className="flex-1 overflow-y-auto max-h-96">
              {isLoadingFriends ? (
                <div className="p-6 text-center text-gray-400">
                  친구 목록을 불러오는 중...
                </div>
              ) : filteredFriends.length === 0 ? (
                <div className="p-6 text-center text-gray-400">
                  {searchQuery ? '검색 결과가 없습니다.' : '친구가 없습니다.'}
                </div>
              ) : (
                <div className="p-2">
                  {filteredFriends.map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center justify-between p-3 hover:bg-[#40444B] rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                          style={{ backgroundColor: friend.accent_color }}
                        >
                          {friend.nickname.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white font-medium">{friend.nickname}</span>
                      </div>
                      <button
                        onClick={() => sendInviteToFriend(friend.id, friend.nickname)}
                        className="px-4 py-2 bg-[#57F287] text-white rounded hover:bg-[#3ba55c] transition-colors font-medium text-sm"
                      >
                        초대...
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 초대 링크 섹션 */}
            <div className="p-6 border-t border-[#4F545C]">
              <h4 className="text-white font-semibold mb-3">또는 친구에게 서버 초대 링크 전송하기</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inviteLink}
                  readOnly
                  className="flex-1 px-3 py-2 bg-[#40444B] text-white rounded border border-[#4F545C] focus:outline-none focus:border-[#5865F2] text-sm"
                />
                <button
                  onClick={copyInviteLink}
                  className="px-4 py-2 bg-[#5865F2] text-white rounded hover:bg-[#4752c4] transition-colors font-medium text-sm"
                >
                  복사
                </button>
              </div>
              <p className="text-gray-400 text-xs mt-2">
                초대 링크가 7일 후 만료돼요. 초대 링크 편집하기.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
