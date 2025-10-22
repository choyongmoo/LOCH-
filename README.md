## LOCH Web (Vite + React + Supabase + LiveKit)

협업 워크스페이스와 실시간 화상/음성 미팅을 위한 웹 애플리케이션입니다. React + Vite 기반으로 구축되었고, 인증과 데이터 관리는 Supabase, 실시간 미디어는 LiveKit을 사용합니다.

### 주요 기능
- **인증**: 회원가입, 로그인, 비밀번호 찾기/재설정
- **워크스페이스**: 프로필, 설정, 친구/초대, 문서 페이지, 서버 사이드바 등
- **미팅**: LiveKit 기반 실시간 음성/영상, 방 입장(`room/:roomId`)
- **문서/가이드**: 홈 페이지의 문서 목록/상세(`docs`, `docs/:slug`)

### 기술 스택
- **Frontend**: React 19, TypeScript 5, Vite 7, Tailwind CSS 4
- **UI/상태**: Radix UI, framer-motion, Zustand, react-router 7
- **Realtime/Backend**: Supabase JS, LiveKit Client, Supabase Edge Functions
- **기타**: ESLint, @tailwindcss/vite, path alias(`@ -> ./src`)

---

## 시작하기

### 필요 사항
- Node.js 18 이상(LTS 권장)
- npm(또는 pnpm, yarn)

### 설치
```bash
npm install
```

### 환경 변수 설정
프로젝트 루트에 `.env` 파일을 생성하고 아래 값을 설정하세요.

```bash
# Supabase 프로젝트 URL (예: https://xxxx.supabase.co)
VITE_SUPABASE_URL=

# LiveKit 서버 URL (예: https://livekit.example.com)
VITE_LIVEKIT_URL=

# 권장: 배포 시 anon 키는 환경변수로 분리해 사용하세요
# 현재 코드는 src/lib/supabase.ts에 anon 키가 하드코딩되어 있습니다.
# 코드 수정 후 아래 변수를 사용하도록 전환하는 것을 권장합니다.
# VITE_SUPABASE_ANON_KEY=
```

참고: `src/lib/livekit.ts`는 Supabase Edge Function을 호출할 때 `VITE_SUPABASE_URL`을 사용합니다. (`${VITE_SUPABASE_URL}/functions/v1/join-livekit-room`)

### 개발 서버 실행
```bash
npm run dev
```

### 프로덕션 빌드/미리보기
```bash
npm run build
npm run preview
```

---

## 스크립트
- `dev`: Vite 개발 서버 실행
- `build`: TypeScript 빌드 후 Vite 프로덕션 빌드
- `preview`: 빌드 결과 로컬 미리보기
- `lint`: ESLint 실행

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

경로 별칭: Vite에서 `@`는 `./src`를 가리킵니다. (`vite.config.ts` 참고)

---

## 라우팅(요약)
- 퍼블릭: `/`, `/about`, `/download`, `/docs`, `/docs/:slug`
- 인증: `/signin`, `/signup`, `/forgot-password`, `/reset-password`
- 워크스페이스(보호됨): `/workspace`, `/workspace/home`, `/workspace/profile`, `/workspace/setting`, `/workspace/manager`, `/workspace/contact`, `/workspace/docs`, `/workspace/friend`, `/workspace/invite/:serverId`
- 미팅: `/room`, `/room/:roomId`
- 404: `*`

---

## Supabase Edge Functions
프로젝트에는 다음 함수들이 포함되어 있습니다.
- `join-livekit-room`: LiveKit 방 참가 토큰 발급
- `livekit-token`, `livekit-webhook`: LiveKit 관련 토큰/웹훅 처리
- `meeting-summary`: 미팅 요약 처리
- `get-user-provider`, `delete-user`: 사용자 관련 유틸 함수

배포/테스트는 Supabase 대시보드 또는 CLI를 사용할 수 있습니다.

---

## 운영/보안 권장사항
- `src/lib/supabase.ts`에 있는 anon 키는 로컬 개발 편의를 위한 값입니다. 배포 전 반드시 환경 변수로 분리하고, 공개 저장소에 커밋된 키는 **즉시 무효화/회전**하세요.
- 배포 플랫폼(Vercel/Netlify/Cloudflare 등) 환경 변수에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_LIVEKIT_URL`을 설정하세요.
- LiveKit 서버 URL 및 토큰 발급 흐름이 올바르게 동작하는지 사전 점검하세요.

---

## 라이선스
프로젝트 라이선스가 정해지면 이 섹션을 업데이트하세요.
