import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/common/ui/sidebar"
import { ScrollArea } from "@/components/common/ui/scroll-area"
import { useNavigate, useLocation } from "react-router";
import React from "react";
import { supabase } from "@/lib/supabase";
import { OthLogo } from "@/components/common/OthLogo";


export default function CustomSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingCount, setPendingCount] = React.useState<number>(0);

  const loadPendingCount = React.useCallback(async () => {
    try {
      const { data: authData } = await supabase.auth.getUser();
      const email = authData.user?.email ?? null;
      if (!email) { setPendingCount(0); return; }
      const { data: me } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .order("id", { ascending: true })
        .limit(1)
        .maybeSingle();
      const myId = (me?.id as number | undefined) ?? null;
      if (!myId) { setPendingCount(0); return; }
      const { data: rows } = await supabase
        .from("friend_requests")
        .select("id")
        .eq("addressee_id", myId)
        .eq("status", "pending");
      setPendingCount((rows ?? []).length);
    } catch {
      setPendingCount(0);
    }
  }, []);

  React.useEffect(() => {
    void loadPendingCount();
    const handle = () => { void loadPendingCount(); };
    window.addEventListener('friends-updated', handle as EventListener);
    const { data: sub } = supabase.auth.onAuthStateChange(() => void loadPendingCount());
    return () => {
      window.removeEventListener('friends-updated', handle as EventListener);
      sub.subscription.unsubscribe();
    };
  }, [loadPendingCount]);
  return (
      <Sidebar className="min-h-screen bg-[#111827] w-full !static !max-h-none font-bold">
        <div className="flex items-center justify-center py-6">
          <OthLogo />
        </div>
        <SidebarContent>
          <ScrollArea className="h-full">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => navigate("/workspace/home")}
                      className={
                        (["/workspace", "/workspace/home", "/"].includes(location.pathname))
                          ? "bg-[var(--sidebar-accent)] dark:bg-[var(--sidebar-accent)] font-bold"
                          : ""
                      }
                    >
                      홈
                    </SidebarMenuButton>
                    <SidebarMenuButton
                      onClick={() => navigate("/meeting")}
                      className={location.pathname === "/meeting" ? "bg-[var(--sidebar-accent)] dark:bg-[var(--sidebar-accent)] font-bold" : ""}
                    >
                      회의
                    </SidebarMenuButton>
                    <SidebarMenuButton
                      onClick={() => navigate("/")}>
                      돌아가기
                    </SidebarMenuButton>
                    <br />
                    <SidebarMenuButton>
                      내 제품
                    </SidebarMenuButton>
                    <SidebarMenuSub>    
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                           onClick={() => navigate("/workspace/mun")}
                          className={location.pathname === "/workspace/mun" ? "bg-[var(--sidebar-accent)] dark:bg-[var(--sidebar-accent)] font-bold" : ""}
                        >
                          문서
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  
                    <SidebarMenuButton>
                      내 계정
                    </SidebarMenuButton>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          onClick={() => {navigate("/workspace/profile");}}
                          className={location.pathname === "/workspace/profile" ? "bg-[var(--sidebar-accent)] dark:bg-[var(--sidebar-accent)] font-bold" : ""}
                        >
                      프로필
                    </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          onClick={() => navigate("/workspace/setting")}
                          className={location.pathname === "/workspace/setting" ? "bg-[var(--sidebar-accent)] dark:bg-[var(--sidebar-accent)] font-bold" : ""}
                        >
                          설정
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          onClick={() => navigate("/workspace/contact")}
                          className={location.pathname === "/workspace/contact" ? "bg-[var(--sidebar-accent)] dark:bg-[var(--sidebar-accent)] font-bold" : ""}
                        >
                          개인 연락처
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                       {(location.pathname === "/workspace/contact" || location.pathname === "/workspace/friends/requests") && (
                       <SidebarMenuSubItem>
                           <SidebarMenuSubButton
                             onClick={() => navigate("/workspace/friends/requests")}
                             className={`pl-8 text-sm ${location.pathname === "/workspace/friends/requests" ? "bg-[var(--sidebar-accent)] dark:bg-[var(--sidebar-accent)] font-bold" : ""}`}
                           >
                             <div className="flex items-center justify-between w-full">
                               <span>친구 수신함</span>
                               {pendingCount > 0 && (
                                 <span className="ml-2 text-xs font-bold">{pendingCount}</span>
                               )}
                             </div>
                           </SidebarMenuSubButton>
                         </SidebarMenuSubItem>
                       )}
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                  <SidebarMenuItem>

                    <SidebarMenuButton>
                      관리자
                    </SidebarMenuButton>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          onClick={() => navigate("/workspace/manager")}  
                          className={location.pathname === "/workspace/manager" ? "bg-[var(--sidebar-accent)] dark:bg-[var(--sidebar-accent)] font-bold" : ""}
                        >
                          서버 관리
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                  
                   
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </ScrollArea>
        </SidebarContent>
      </Sidebar>
  )
}
