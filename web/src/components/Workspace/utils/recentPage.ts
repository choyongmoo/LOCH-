export interface RecentPage {
  path: string;
  name: string;
  ts: number;
}

export const PAGE_NAME_MAP: Record<string, string> = {
  profile: "프로필",
  setting: "카메라 테스트",
  contact: "개인 연락처",
  friend: "친구 수신함",
  manager: "관리자",
  docs: "회의 내역"
};

export const EXCLUDED_KEYS = ["home", "workspace"];

export const getDisplayName = (path: string): string | null => {
  const key = path.split("/").filter(Boolean).pop();
  if (!key || EXCLUDED_KEYS.includes(key)) return null;
  return PAGE_NAME_MAP[key] ?? null;
};

export const getStorageKey = (userId?: string) =>
  userId ? `recentPages_${userId}` : "recentPages_guest";
