import { SidebarProvider } from "@/components/common/ui/sidebar";
import CustomSidebar from "@/components/Workspace/Sidebar/Sidebar";
import MiniSidebar from "@/components/Workspace/Sidebar/MiniSidebar";
import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";

const RECENT_KEY = "recentWorkspacePages";
const MAX_STORE = 10; // 저장은 10개까지 유지 (화면은 4개 표시)

const WorkspaceLayout = () => {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;
    if (!pathname.startsWith("/workspace")) return;

    const isWorkspaceHome = (p: string) => {
      const normalized = p.replace(/\/+$/, ""); // remove trailing slash
      return normalized === "/workspace" || normalized === "/workspace/home";
    };

    // 홈(/workspace, /workspace/home)은 기록하지 않음
    if (isWorkspaceHome(pathname)) return;

    try {
      const raw = localStorage.getItem(RECENT_KEY);
      const parsed: Array<{ path: string; ts: number }> = raw ? JSON.parse(raw) : [];
      // 기존 기록에서도 홈 경로는 제거
      const withoutHome = parsed.filter((p) => !isWorkspaceHome(p.path));
      // 동일 경로 중복 허용: 기존 목록 유지한 채 새 방문을 선두에 추가
      const withNew = [{ path: pathname, ts: Date.now() }, ...withoutHome];
      // 최대 10개 저장
      const next = withNew.slice(0, MAX_STORE);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      // 같은 탭에서도 홈이 즉시 갱신되도록 커스텀 이벤트 송신
      try {
        window.dispatchEvent(new CustomEvent('recentWorkspacePagesUpdated'));
      } catch {
        // ignore
      }
    } catch {
      // 무시
    }
  }, [location.pathname]);

  return (
    <SidebarProvider>
      <div className="flex h-screen relative">
        {/* 첫 번째 사이드바 */}
        <div className="w-14 bg-[#0f172a] flex-shrink-0">
          <MiniSidebar />
        </div>

        {/* 두 번째 사이드바 */}
        <div className="w-64 bg-zinc-800 h-full flex-shrink-0">
          <CustomSidebar/>
        </div>

        {/* 메인 콘텐츠 + 슬라이드 패널 영역 */}
        <div className="flex-1 relative overflow-visible bg-[#1C1D26] min-h-screen">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default WorkspaceLayout;
