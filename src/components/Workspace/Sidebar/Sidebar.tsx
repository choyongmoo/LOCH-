import { OthLogo } from "@/components/common/OthLogo";
import { ScrollArea } from "@/components/common/ui/scroll-area";
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
} from "@/components/common/ui/sidebar";
import { supabase } from "@/lib/supabase";

import React from "react";
import { useLocation, useNavigate } from "react-router";
import { MeetingButton } from "./MeetingButton";
import { Input } from "@/components/common/ui/input";
import { Button } from "@/components/common/ui/button";
import { OthLogo } from "@/components/common/OthLogo";

export default function CustomSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingCount, setPendingCount] = React.useState<number>(0);
  const [createOpen, setCreateOpen] = React.useState<boolean>(false);
  const [newName, setNewName] = React.useState<string>("");
  const [newDesc, setNewDesc] = React.useState<string>("");
  const [creating, setCreating] = React.useState<boolean>(false);

  const loadPendingCount = React.useCallback(async () => {
    try {
      const { data: authData } = await supabase.auth.getUser();
      const email = authData.user?.email ?? null;
      if (!email) {
        setPendingCount(0);
        return;
      }
      const { data: me } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .order("id", { ascending: true })
        .limit(1)
        .maybeSingle();
      const myId = (me?.id as number | undefined) ?? null;
      if (!myId) {
        setPendingCount(0);
        return;
      }
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
    const handle = () => {
      void loadPendingCount();
    };
    window.addEventListener("friends-updated", handle as EventListener);
    const { data: sub } = supabase.auth.onAuthStateChange(() => void loadPendingCount());
    return () => {
      window.removeEventListener("friends-updated", handle as EventListener);
      sub.subscription.unsubscribe();
    };
  }, [loadPendingCount]);
  return (
    <>
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
                    <div className="px-2 py-2">
                    <div className="flex w-full items-center justify-center">
                      <MeetingButton />
                    </div>
                  </div>
                    <SidebarMenuButton
                      onClick={async () => {
                        try {
                          const raw = localStorage.getItem('home:selectedMeeting');
                          if (raw) {
                            const parsed = JSON.parse(raw) as { meetingId?: string } | null;
                            const meetingId = parsed?.meetingId;
                            if (meetingId) { navigate(`/meeting/${meetingId}`); return; }
                          }
                        } catch { /* ignore */ }
                        setCreateOpen(true);
                      }}
                      className={`bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 ${location.pathname === "/meeting" ? "bg-[var(--sidebar-accent)] dark:bg-[var(--sidebar-accent)] font-bold ring-2  ring-black/10 shadow dark:ring-2 dark:ring-white/20" : ""}`}
                    >
                      회의
                    </SidebarMenuButton>
                    
                    <SidebarMenuButton className="hover:bg-transparent dark:hover:bg-transparent focus:bg-transparent active:bg-transparent cursor-default">
                      내 제품
                    </SidebarMenuButton>
                    <SidebarMenuSub>    
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                           onClick={() => navigate("/workspace/mun")}
                          className={`bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 ${location.pathname === "/workspace/mun" ? "bg-[var(--sidebar-accent)] dark:bg-[var(--sidebar-accent)] font-bold ring-2 ring-black/10 shadow dark:ring-2 dark:ring-white/20" : ""}`}
                        >
                          문서
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  
                    <SidebarMenuButton className="hover:bg-transparent dark:hover:bg-transparent focus:bg-transparent active:bg-transparent cursor-default">
                      내 계정
                    </SidebarMenuButton>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          onClick={() => navigate("/workspace/home")}
                          className={`bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 ${(["/workspace", "/workspace/home", "/"].includes(location.pathname))
                            ? "bg-[var(--sidebar-accent)] dark:bg-[var(--sidebar-accent)] font-bold ring-2 ring-black/10 shadow dark:ring-2 dark:ring-white/20"
                            : ""}`}
                        >
                          홈
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          onClick={() => {navigate("/workspace/profile");}}
                          className={`bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 ${location.pathname === "/workspace/profile" ? "bg-[var(--sidebar-accent)] dark:bg-[var(--sidebar-accent)] font-bold ring-2 ring-black/10 shadow dark:ring-2 dark:ring-white/20" : ""}`}
                        >
                          프로필
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          onClick={() => navigate("/workspace/setting")}
                          className={`bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 ${location.pathname === "/workspace/setting" ? "bg-[var(--sidebar-accent)] dark:bg-[var(--sidebar-accent)] font-bold ring-2 ring-black/10 shadow dark:ring-2 dark:ring-white/20" : ""}`}
                        >
                          설정
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          onClick={() => navigate("/workspace/contact")}
                          className={`bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 ${location.pathname === "/workspace/contact" ? "bg-[var(--sidebar-accent)] dark:bg-[var(--sidebar-accent)] font-bold ring-2 ring-black/10 shadow dark:ring-2 dark:ring-white/20" : ""}`}
                        >
                          개인 연락처
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                       {(location.pathname === "/workspace/contact" || location.pathname === "/workspace/friends/requests") && (
                       <SidebarMenuSubItem>
                           <SidebarMenuSubButton
                             onClick={() => navigate("/workspace/friends/requests")}
                             className={`pl-8 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 ${location.pathname === "/workspace/friends/requests" ? "bg-[var(--sidebar-accent)] dark:bg-[var(--sidebar-accent)] font-bold ring-2 ring-black/10 shadow dark:ring-2 dark:ring-white/20" : ""}`}
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

                    <SidebarMenuButton className="hover:bg-transparent dark:hover:bg-transparent focus:bg-transparent active:bg-transparent cursor-default">
                      관리자
                    </SidebarMenuButton>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          onClick={() => navigate("/workspace/manager")}  
                          className={`bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 ${location.pathname === "/workspace/manager" ? "bg-[var(--sidebar-accent)] dark:bg-[var(--sidebar-accent)] font-bold ring-2 ring-black/10 shadow dark:ring-2 dark:ring-white/20" : ""}`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>친구 수신함</span>
                            {pendingCount > 0 && (
                              <span className="ml-2 text-xs font-bold">{pendingCount}</span>
                            )}
                          </div>
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
      {createOpen && (
        <div>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => { if (!creating) { setCreateOpen(false); setNewName(""); setNewDesc(""); } }} />
          <div className="fixed top-1/2 left-1/2 w-[360px] max-w-[90vw] bg-white dark:bg-[#2F3136] p-4 rounded-md shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-50">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">서버 생성</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">이름</label>
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="서버 이름" />
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">소개</label>
                <Input value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="서버 소개(선택)" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => { if (!creating) { setCreateOpen(false); setNewName(""); setNewDesc(""); } }}>취소</Button>
              <Button disabled={creating || !newName.trim()} onClick={async () => {
                const name = newName.trim();
                const description = newDesc.trim();
                if (!name) return;
                setCreating(true);
                try {
                  const { data: auth } = await supabase.auth.getUser();
                  const host = auth.user?.id ?? null;
                  const { data, error } = await supabase
                    .from('servers')
                    .insert({ room_name: name, description: description || null, host })
                    .select('id, room_name, description')
                    .single();
                  if (error) throw error;
                  if (data) {
                    if (host) {
                      try { await supabase.from('server_members').insert({ server_id: data.id, user_id: host }); } catch { /* ignore */ }
                    }
                    try { localStorage.setItem('home:selectedMeeting', JSON.stringify({ meetingId: data.id, meetingName: data.room_name || '' })); } catch { /* ignore */ }
                    try { window.dispatchEvent(new CustomEvent('meetings-updated')); } catch { /* ignore */ }
                    setCreateOpen(false); setNewName(""); setNewDesc("");
                    navigate(`/meeting/${data.id}`);
                  }
                } catch {
                } finally {
                  setCreating(false);
                }
              }}>생성</Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
