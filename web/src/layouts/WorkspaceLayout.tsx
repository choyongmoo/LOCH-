import { Outlet } from "react-router";
import ServerSidebar from "@/components/Workspace/ServerSidebar";
import MenuSidebar from "@/components/Workspace/MenuSidebar";
import { SidebarProvider } from "@/components/common/ui/sidebar";
import { useThemeStore } from "@/store/themeStore";
import { useUserStore } from "@/store/useUserStore";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

export default function WorkspaceLayout() {
    const { theme } = useThemeStore();
    const isLight = theme === "light";
    const setUser = useUserStore((state) => state.setUser);
    
    useEffect(() => {
      const fetchUser = async () => {
        const { data: authData } = await supabase.auth.getUser();
        if (!authData?.user) return;

        const { data: profile } = await supabase
          .from("profile")
          .select("*")
          .eq("id", authData.user.id)
          .maybeSingle();

        if (profile) setUser(profile);
      };
      fetchUser();
    }, [setUser]);

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full relative overflow-hidden">
                <div className={`w-14 flex-shrink-0 border-r flex flex-col h-screen ${isLight ? "border-gray-300" : "border-gray-700"}`}>
                    <ServerSidebar />
                </div>
                <div className={`w-64 h-screen flex-shrink-0 border-r ${isLight ? "bg-white text-black" : "bg-[#0f172a] text-white"}`}>
                    <MenuSidebar />
                </div>
                <div className={`flex-1 relative h-screen overflow-x-auto overflow-y-hidden ${isLight ? "bg-white text-black" : "bg-zinc-800 text-white"}`}>
                    <div className="shrink-0 w-full h-full px-0">
                        <Outlet />
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}
