## LOCH Web (Vite + React + Supabase + LiveKit + AWS)

주소: https://d2m0eness3apiw.cloudfront.net

협업 워크스페이스와 실시간 화상/음성 미팅을 위한 웹 애플리케이션입니다. React + Vite 기반으로 구축되었고, 인증과 데이터 관리는 Supabase, 실시간 미디어는 LiveKit을 사용합니다.

### 주요 기능
- **인증**: 회원가입, 로그인, 비밀번호 찾기/재설정
  <img width="2559" height="1394" alt="image" src="https://github.com/user-attachments/assets/49ffbbd9-94d4-4e93-98ce-772a420a6766" />

- **워크스페이스**: 프로필, 설정, 친구/초대, 문서 페이지, 서버 사이드바 등
- **미팅**: LiveKit 기반 실시간 음성/영상, 방 입장
- **문서/가이드**: 홈 페이지의 문서 목록/상세

### 기술 스택
- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **UI/상태**: Zustand, react-router
- **Realtime/Backend**: Supabase JS, LiveKit Client, Supabase Edge Functions
---

## 디렉터리 구조(요약)
```
src/
  assets/                # 이미지/아이콘 등 정적 리소스
  components/            # 공용 컴포넌트, 레이아웃별 컴포넌트
  hooks/                 # 커스텀 훅
  layouts/               # 페이지 레이아웃 (Home/Auth/Workspace/Meeting)
  lib/                   # supabase, livekit 등 클라이언트 유틸
  pages/                 # 라우트 페이지
  providers/             # 컨텍스트/프로바이더 (예: LiveKitRoomProvider)
  store/                 # Zustand 스토어
  types/                 # 타입 정의
  styles.css             # 전역 스타일(Tailwind)

supabase/
  functions/             # Edge Functions (join-livekit-room 등)
  migrations/            # DB 마이그레이션
```
---

## Supabase Edge Functions
프로젝트에는 다음 함수들이 포함되어 있습니다.
- `join-livekit-room`: LiveKit 방 참가 토큰 발급
- `livekit-token`, `livekit-webhook`: LiveKit 관련 토큰/웹훅 처리
- `meeting-summary`: 미팅 요약 처리
- `get-user-provider`, `delete-user`: 사용자 관련 유틸 함수
---
