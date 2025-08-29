-- 기존 meetings 테이블을 새 테이블로 교체하는 SQL 스크립트
-- Supabase SQL Editor에서 실행하세요

-- 1. 기존 meetings 테이블 삭제 (데이터 백업 필요시 먼저 백업하세요)
DROP TABLE IF EXISTS meetings CASCADE;

-- 2. 새 meetings 테이블 생성
CREATE TABLE meetings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    host_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_messages ENABLE ROW LEVEL SECURITY;

-- meetings 테이블 정책
CREATE POLICY "meetings_select_policy" ON meetings
    FOR SELECT USING (true);

CREATE POLICY "meetings_insert_policy" ON meetings
    FOR INSERT WITH CHECK (auth.uid() = host_id);

CREATE POLICY "meetings_update_policy" ON meetings
    FOR UPDATE USING (auth.uid() = host_id);

CREATE POLICY "meetings_delete_policy" ON meetings
    FOR DELETE USING (auth.uid() = host_id);

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
CREATE INDEX idx_meetings_host_id ON meetings(host_id);
CREATE INDEX idx_meetings_status ON meetings(status);
CREATE INDEX idx_meeting_members_meeting_id ON meeting_members(meeting_id);
CREATE INDEX idx_meeting_members_user_id ON meeting_members(user_id);
CREATE INDEX idx_meeting_messages_meeting_id ON meeting_messages(meeting_id);
CREATE INDEX idx_meeting_messages_created_at ON meeting_messages(created_at);

-- 7. Realtime 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE meetings;
ALTER PUBLICATION supabase_realtime ADD TABLE meeting_members;
ALTER PUBLICATION supabase_realtime ADD TABLE meeting_messages;

-- 완료 메시지
SELECT '테이블 교체가 완료되었습니다!' as message;
