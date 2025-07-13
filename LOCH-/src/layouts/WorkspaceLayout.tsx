import { SidebarProvider } from "@/components/common/ui/sidebar";
import CustomSidebar from "@/components/Workspace/Sidebar/Sidebar";
import MiniSidebar from "@/components/Workspace/Sidebar/MiniSidebar";
import { Outlet } from "react-router-dom";

const WorkspaceLayout = () => {
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
        <div className="flex-1 relative overflow-visible bg-[#1C1D26]">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default WorkspaceLayout;
