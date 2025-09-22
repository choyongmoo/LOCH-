-- 기존 meetings → servers 이름 변경을 반영한 샘플 스키마 스크립트 (참고용)
-- Supabase SQL Editor에서 실행하세요

-- 1. 기존 meetings 테이블 삭제 (데이터 백업 필요시 먼저 백업하세요)
DROP TABLE IF EXISTS servers CASCADE;

-- 2. 새 meetings 테이블 생성
CREATE TABLE servers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_name VARCHAR(255) NOT NULL,
    description TEXT,
    host TEXT,
    max_participants INTEGER DEFAULT 10,
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'ended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    settings JSONB DEFAULT '{}'::jsonb
);

-- 3. meeting_members 테이블 생성
CREATE TABLE meeting_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'participant' CHECK (role IN ('host', 'participant', 'observer')),
    is_active BOOLEAN DEFAULT true,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    left_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(meeting_id, user_id)
);

-- 4. meeting_messages 테이블 생성
CREATE TABLE meeting_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'general' CHECK (message_type IN ('general', 'private', 'system')),
    receiver_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. RLS 정책 설정
ALTER TABLE servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_messages ENABLE ROW LEVEL SECURITY;

-- meetings 테이블 정책
CREATE POLICY "servers_select_policy" ON servers
    FOR SELECT USING (true);

CREATE POLICY "servers_insert_policy" ON servers
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "servers_update_policy" ON servers
    FOR UPDATE USING (auth.uid()::text = host);

CREATE POLICY "servers_delete_policy" ON servers
    FOR DELETE USING (auth.uid()::text = host);

-- meeting_members 테이블 정책
CREATE POLICY "meeting_members_select_policy" ON meeting_members
    FOR SELECT USING (true);

CREATE POLICY "meeting_members_insert_policy" ON meeting_members
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "meeting_members_update_policy" ON meeting_members
    FOR UPDATE USING (auth.uid() = user_id);

-- meeting_messages 테이블 정책
CREATE POLICY "meeting_messages_select_policy" ON meeting_messages
    FOR SELECT USING (true);

CREATE POLICY "meeting_messages_insert_policy" ON meeting_messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- 6. 인덱스 생성
CREATE INDEX idx_servers_host ON servers(host);
CREATE INDEX idx_servers_status ON servers(status);
CREATE INDEX idx_meeting_members_meeting_id ON meeting_members(meeting_id);
CREATE INDEX idx_meeting_members_user_id ON meeting_members(user_id);
CREATE INDEX idx_meeting_messages_meeting_id ON meeting_messages(meeting_id);
CREATE INDEX idx_meeting_messages_created_at ON meeting_messages(created_at);

-- 7. Realtime 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE servers;
ALTER PUBLICATION supabase_realtime ADD TABLE meeting_members;
ALTER PUBLICATION supabase_realtime ADD TABLE meeting_messages;

-- 완료 메시지
SELECT '테이블 교체가 완료되었습니다!' as message;
