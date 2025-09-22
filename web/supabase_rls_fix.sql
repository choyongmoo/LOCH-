-- servers 테이블 RLS 정책 수정 (meetings → servers로 변경 후 사용)
-- Supabase SQL Editor에서 실행하세요

DROP POLICY IF EXISTS "meetings_select_policy" ON servers; -- 기존 이름을 쓰고 있다면 삭제
DROP POLICY IF EXISTS "meetings_insert_policy" ON servers;
DROP POLICY IF EXISTS "meetings_update_policy" ON servers;
DROP POLICY IF EXISTS "meetings_delete_policy" ON servers;

DROP POLICY IF EXISTS "servers_select_policy" ON servers;
DROP POLICY IF EXISTS "servers_insert_policy" ON servers;
DROP POLICY IF EXISTS "servers_update_policy" ON servers;
DROP POLICY IF EXISTS "servers_delete_policy" ON servers;

CREATE POLICY "servers_select_policy" ON servers
    FOR SELECT USING (true);

CREATE POLICY "servers_insert_policy" ON servers
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "servers_update_policy" ON servers
    FOR UPDATE USING (auth.uid()::text = host);

CREATE POLICY "servers_delete_policy" ON servers
    FOR DELETE USING (auth.uid()::text = host);

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

-- 5. Realtime(복제) 대상에 servers 추가 (이미 추가돼 있다면 무시됨)
ALTER PUBLICATION supabase_realtime ADD TABLE servers;

SELECT 'RLS/Realtime 정책이 수정되었습니다!' as message;
