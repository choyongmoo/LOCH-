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
import { OthLogo } from "@/components/common/OthLogo";


export default function CustomSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
      <Sidebar className="min-h-screen bg-[#111827] w-full !static !min-h-0 !max-h-none font-bold">
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
                    <br />
                    <SidebarMenuButton
                      className={location.pathname.startsWith("/product") ? "bg-[var(--sidebar-accent)] dark:bg-[var(--sidebar-accent)] font-bold" : ""}
                    >
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
                          onClick={() => {
                          console.log("프로필 버튼 클럼나ㅣㅇ리ㅏㄴㅁ;ㅇ러ㅣㅏ;ㄴㅁ어라ㅣ;ㅁㄴ어리;마너링ㅁㄴ");navigate("/workspace/profile");}}
                          className={location.pathname === "/workspace/profile" ? "bg-[var(--sidebar-accent)] dark:bg-[var(--sidebar-accent)] font-bold" : ""}
                        >
                      프로필
                    </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          className={location.pathname === "/workspace/settings" ? "bg-[var(--sidebar-accent)] dark:bg-[var(--sidebar-accent)] font-bold" : ""}
                        >
                          설정
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          className={location.pathname === "/workspace/contact" ? "bg-[var(--sidebar-accent)] dark:bg-[var(--sidebar-accent)] font-bold" : ""}
                        >
                          개인 연락처
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                  <SidebarMenuItem>

                    <SidebarMenuButton
                      className={location.pathname.startsWith("/admin") ? "bg-[var(--sidebar-accent)] dark:bg-[var(--sidebar-accent)] font-bold" : ""}
                    >
                      관리자
                    </SidebarMenuButton>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          className={location.pathname === "/admin/server" ? "bg-[var(--sidebar-accent)] dark:bg-[var(--sidebar-accent)] font-bold" : ""}
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
