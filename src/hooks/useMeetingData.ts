import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Meeting, MeetingMember, MeetingMessage, MeetingParticipant } from '@/pages/Meeting/types';

export const useMeetingData = (meetingId: string) => {
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [participants, setParticipants] = useState<MeetingParticipant[]>([]);
  const [messages, setMessages] = useState<MeetingMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // 현재 사용자 정보 로드
  const loadCurrentUser = useCallback(async () => {
    try {
      const { data: authData } = await supabase.auth.getUser();
      const email = authData.user?.email;
      if (!email) return;

      const { data: userData } = await supabase
        .from('users')
        .select('id, name')
        .eq('email', email)
        .single();

      if (userData) {
        setCurrentUserId(userData.id);
      }
    } catch (err) {
      }
  }, []);

  // 회의방 정보 로드
  const loadMeeting = useCallback(async () => {
    try {
      // meetingId가 비어있으면 로드하지 않음
      if (!meetingId || meetingId.trim() === '') {
        setError('회의방 ID가 유효하지 않습니다.');
        return;
      }

      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('id', meetingId)
        .single();

      if (error) throw error;
      setMeeting(data);
    } catch (err) {
      setError('회의방 정보를 불러올 수 없습니다.');
      }
  }, [meetingId]);

  // 참가자 목록 로드
  const loadParticipants = useCallback(async () => {
    try {
      // meetingId가 비어있으면 로드하지 않음
      if (!meetingId || meetingId.trim() === '') {
        return;
      }

      const { data, error } = await supabase
        .from('meeting_members')
        .select(`
          id,
          meeting_id,
          user_id,
          role,
          is_active,
          joined_at,
          left_at,
          users!meeting_members_user_id_fkey(id, name, email)
        `)
        .eq('meeting_id', meetingId)
        .eq('is_active', true);

      if (error) throw error;

      const participantsList: MeetingParticipant[] = (data || []).map((member: any) => ({
        id: member.users?.id || member.user_id,
        name: member.users?.name || 'Unknown',
        email: member.users?.email || '',
        is_local: member.users?.id === currentUserId,
        is_camera_on: false, // 기본값, 실제로는 별도 상태 관리 필요
        is_mic_on: true,
        is_screen_sharing: false,
        is_active: member.is_active,
        joined_at: member.joined_at,
        role: member.role
      }));

      setParticipants(participantsList);
    } catch (err) {
      }
  }, [meetingId, currentUserId]);

  // 메시지 로드
  const loadMessages = useCallback(async () => {
    try {
      // meetingId가 비어있으면 로드하지 않음
      if (!meetingId || meetingId.trim() === '') {
        return;
      }

      const { data, error } = await supabase
        .from('meeting_messages')
        .select(`
          id,
          meeting_id,
          sender_id,
          content,
          message_type,
          receiver_id,
          created_at,
          users!meeting_messages_sender_id_fkey(id, name, email)
        `)
        .eq('meeting_id', meetingId)
        .eq('message_type', 'general')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      }
  }, [meetingId]);

  // 회의방 참가
  const joinMeeting = useCallback(async () => {
    if (!currentUserId) return;

    try {
      // 이미 참가 중인지 확인
      const { data: existingMember } = await supabase
        .from('meeting_members')
        .select('id, is_active')
        .eq('meeting_id', meetingId)
        .eq('user_id', currentUserId)
        .single();

      if (existingMember) {
        // 이미 참가 중이면 활성 상태로 업데이트
        if (!existingMember.is_active) {
          const { error } = await supabase
            .from('meeting_members')
            .update({ 
              is_active: true,
              left_at: null
            })
            .eq('id', existingMember.id);

          if (error) throw error;
        }
      } else {
        // 새로운 참가자 추가
        const { error } = await supabase
          .from('meeting_members')
          .insert({
            meeting_id: meetingId,
            user_id: currentUserId,
            role: 'participant',
            is_active: true
          });

        if (error) throw error;
      }
      
      // 참가자 목록 새로고침
      await loadParticipants();
    } catch (err) {
      }
  }, [meetingId, currentUserId, loadParticipants]);

  // 회의방 나가기
  const leaveMeeting = useCallback(async () => {
    if (!currentUserId) return;

    try {
      const { error } = await supabase
        .from('meeting_members')
        .update({ 
          is_active: false,
          left_at: new Date().toISOString()
        })
        .eq('meeting_id', meetingId)
        .eq('user_id', currentUserId);

      if (error) throw error;
    } catch (err) {
      }
  }, [meetingId, currentUserId]);

  // 메시지 전송
  const sendMessage = useCallback(async (content: string, messageType: 'general' | 'private' = 'general', receiverId?: number) => {
    if (!currentUserId) return;

    try {
      const { error } = await supabase
        .from('meeting_messages')
        .insert({
          meeting_id: meetingId,
          sender_id: currentUserId,
          content,
          message_type: messageType,
          receiver_id: receiverId
        });

      if (error) throw error;
      
      // 메시지 목록 새로고침
      await loadMessages();
    } catch (err) {
      }
  }, [meetingId, currentUserId, loadMessages]);

  // 실시간 구독 설정
  useEffect(() => {
    if (!meetingId) return;

    // 참가자 변경 구독
    const participantsChannel = supabase
      .channel(`meeting_participants_${meetingId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'meeting_members',
          filter: `meeting_id=eq.${meetingId}`
        },
        () => {
          loadParticipants();
        }
      )
      .subscribe();

    // 메시지 변경 구독
    const messagesChannel = supabase
      .channel(`meeting_messages_${meetingId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'meeting_messages',
          filter: `meeting_id=eq.${meetingId}`
        },
        () => {
          loadMessages();
        }
      )
      .subscribe();

    return () => {
      participantsChannel.unsubscribe();
      messagesChannel.unsubscribe();
    };
  }, [meetingId, loadParticipants, loadMessages]);

  // 초기 데이터 로드
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await loadCurrentUser();
      await loadMeeting();
      await loadParticipants();
      await loadMessages();
      setLoading(false);
    };

    initializeData();
  }, [loadCurrentUser, loadMeeting, loadParticipants, loadMessages]);

  return {
    meeting,
    participants,
    messages,
    loading,
    error,
    currentUserId,
    joinMeeting,
    leaveMeeting,
    sendMessage,
    refreshParticipants: loadParticipants,
    refreshMessages: loadMessages
  };
};
