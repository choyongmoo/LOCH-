import { Outlet } from "react-router";
import ServerSidebar from "@/components/Workspace/ServerSidebar";
import MenuSidebar from "@/components/Workspace/MenuSidebar";
import { SidebarProvider } from "@/components/common/ui/sidebar";
import { useThemeStore } from "@/store/themeStore";
import { useUserStore } from "@/store/useUserStore";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useFriendStore } from "@/store/useFriendStore";

export default function WorkspaceLayout() {
    const { theme } = useThemeStore();
    const isLight = theme === "light";
    const setUser = useUserStore((state) => state.setUser);
    const setRequests = useFriendStore((state) => state.setRequests);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. 로그인한 유저 정보
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        const user = authData.user;
        if (!user?.id) throw new Error("로그인 정보가 없습니다");

        const userId = user.id;

        // 2. 프로필 데이터
        const { data: profileData, error: profileError } = await supabase
          .from("profile")
          .select("*")
          .eq("id", userId)
          .maybeSingle();

        if (profileError) throw profileError;
        if (profileData) setUser(profileData);

        // 3. 친구 요청 데이터
        const { data: requestsData, error: requestsError } = await supabase
          .from("friend_requests")
          .select("*")
          .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`);

        if (requestsError) throw requestsError;
        if (requestsData) setRequests(requestsData);

      } catch (err) {
        console.error("WorkspaceLayout fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setUser, setRequests]);

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
