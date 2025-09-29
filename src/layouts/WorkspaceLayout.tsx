import { Outlet } from "react-router";
import ServerSidebar from "@/components/Workspace/ServerSidebar";
import MenuSidebar from "@/components/Workspace/MenuSidebar";
import { SidebarProvider } from "@/components/common/ui/sidebar";
import { useThemeStore } from "@/store/themeStore";

export default function WorkspaceLayout() {
    const { theme } = useThemeStore();
    const isLight = theme === "light";

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full relative overflow-hidden">
                <div className={`w-14 flex-shrink-0 border-r flex flex-col h-screen ${isLight ? "border-gray-300" : "border-gray-700"}`}>
                    <ServerSidebar />
                </div>
                <div className={`w-64 h-screen flex-shrink-0 border-r ${isLight ? "bg-white text-black" : "bg-[#0f172a] text-white"}`}>
                    <MenuSidebar />
                </div>
                <div className={`flex-1 relative h-screen overflow-hidden ${isLight ? "bg-white text-black" : "bg-zinc-800 text-white"}`}>
                    <div className="min-w-0 w-full max-w-none min-h-full px-0">
                        <Outlet />
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}
