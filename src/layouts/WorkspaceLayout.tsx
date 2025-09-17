import { SidebarProvider } from "@/components/common/ui/sidebar";
import CustomSidebar from "@/components/Workspace/Sidebar/Sidebar";
import MiniSidebar from "@/components/Workspace/Sidebar/MiniSidebar";
import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

const RECENT_KEY_PREFIX = "recentWorkspacePages:";
const MAX_STORE = 10; // 저장은 10개까지 유지 (화면은 4개 표시)

const WorkspaceLayout = () => {
  const location = useLocation();

  useEffect(() => {
    const run = async () => {
      const getRecentKey = (email: string | null | undefined) => `${RECENT_KEY_PREFIX}${email ?? "anonymous"}`;
      let currentKey = getRecentKey(null);
      try {
        const { data } = await supabase.auth.getUser();
        currentKey = getRecentKey(data.user?.email ?? null);
      } catch {
        // ignore
      }
    const pathname = location.pathname;
    if (!pathname.startsWith("/workspace")) return;

    const isWorkspaceHome = (p: string) => {
      const normalized = p.replace(/\/+$/, ""); // remove trailing slash
      return normalized === "/workspace" || normalized === "/workspace/home";
    };

    // 홈(/workspace, /workspace/home)은 기록하지 않음
    if (isWorkspaceHome(pathname)) return;

      try {
        const raw = localStorage.getItem(currentKey);
        const parsed: Array<{ path: string; ts: number }> = raw ? JSON.parse(raw) : [];
        // 기존 기록에서도 홈 경로는 제거
        const withoutHome = parsed.filter((p) => !isWorkspaceHome(p.path));
        // 동일 경로 중복 허용: 기존 목록 유지한 채 새 방문을 선두에 추가
        const withNew = [{ path: pathname, ts: Date.now() }, ...withoutHome];
        // 최대 10개 저장
        const next = withNew.slice(0, MAX_STORE);
        localStorage.setItem(currentKey, JSON.stringify(next));
        // 같은 탭에서도 홈이 즉시 갱신되도록 커스텀 이벤트 송신
        try {
          window.dispatchEvent(new CustomEvent('recentWorkspacePagesUpdated'));
        } catch {
          // ignore
        }
      } catch {
        // ignore
      }
    };

    void run();
  }, [location.pathname]);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full relative overflow-x-hidden">
        {/* 첫 번째 사이드바 */}
        <div className="w-14 h-full bg-[#0f172a] flex-shrink-0">
          <MiniSidebar />
        </div>

        {/* 두 번째 사이드바 */}
        <div className="w-64 bg-zinc-800 h-full flex-shrink-0">
          <CustomSidebar/>
        </div>

        {/* 메인 콘텐츠 + 슬라이드 패널 영역 */}
        <div className="flex-1 relative h-screen overflow-y-hidden bg-[#1C1D26]">
          <div className="min-w-0 w-full max-w-none min-h-full px-0">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default WorkspaceLayout;
