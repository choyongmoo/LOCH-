-- meetings 테이블 RLS 정책 수정
-- Supabase SQL Editor에서 실행하세요

-- 1. 기존 RLS 정책 삭제
DROP POLICY IF EXISTS "meetings_select_policy" ON meetings;
DROP POLICY IF EXISTS "meetings_insert_policy" ON meetings;
DROP POLICY IF EXISTS "meetings_update_policy" ON meetings;
DROP POLICY IF EXISTS "meetings_delete_policy" ON meetings;

-- 2. 새로운 RLS 정책 생성
-- 모든 사용자가 회의방을 볼 수 있음
CREATE POLICY "meetings_select_policy" ON meetings
    FOR SELECT USING (true);

-- 인증된 사용자가 회의방을 생성할 수 있음
CREATE POLICY "meetings_insert_policy" ON meetings
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 호스트만 회의방을 수정할 수 있음
CREATE POLICY "meetings_update_policy" ON meetings
    FOR UPDATE USING (auth.uid()::text = host);

-- 호스트만 회의방을 삭제할 수 있음
CREATE POLICY "meetings_delete_policy" ON meetings
    FOR DELETE USING (auth.uid()::text = host);

-- 3. meeting_members 테이블 정책도 수정
DROP POLICY IF EXISTS "meeting_members_select_policy" ON meeting_members;
DROP POLICY IF EXISTS "meeting_members_insert_policy" ON meeting_members;
DROP POLICY IF EXISTS "meeting_members_update_policy" ON meeting_members;

CREATE POLICY "meeting_members_select_policy" ON meeting_members
    FOR SELECT USING (true);

CREATE POLICY "meeting_members_insert_policy" ON meeting_members
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "meeting_members_update_policy" ON meeting_members
    FOR UPDATE USING (auth.uid() IS NOT NULL);

-- 4. meeting_messages 테이블 정책도 수정
DROP POLICY IF EXISTS "meeting_messages_select_policy" ON meeting_messages;
DROP POLICY IF EXISTS "meeting_messages_insert_policy" ON meeting_messages;

CREATE POLICY "meeting_messages_select_policy" ON meeting_messages
    FOR SELECT USING (true);

CREATE POLICY "meeting_messages_insert_policy" ON meeting_messages
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 완료 메시지
SELECT 'RLS 정책이 수정되었습니다!' as message;
