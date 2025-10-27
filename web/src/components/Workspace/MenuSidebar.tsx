import { useNavigate, useLocation } from "react-router";
import { SidebarMenu, SidebarProvider } from "../common/ui/sidebar";
import { ContactButton, HomeButton, ManagerButton, ProfileButton, SettingButton, FriendRequestButton } from "./Buttons/MenuButtons";
import MenuGroup from "./MenuGorup";
import { OthLogo } from "../common/OthLogo";
import { MeetingButton } from "./Buttons/MeetingButton";
import { useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { getDisplayName, getStorageKey, type RecentPage } from "./utils/RecentPage";

const MAX_RECENT = 10;

export default function MenuSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const activeClass = "bg-[var(--sidebar-accent)] dark:bg-[var(--sidebar-accent)] font-bold ring-2 ring-black/10 shadow dark:ring-2 dark:ring-white/20";
  const [showFriendRequest, setShowFriendRequest] = useState(false);
  const [, setRecentPages] = useState<RecentPage[]>([]);

  const addRecentPage = (path: string) => {
    const storageKey = getStorageKey(user?.id);
    const stored: RecentPage[] = JSON.parse(localStorage.getItem(storageKey) || "[]");
    const name = getDisplayName(path);
    if (!name) return; // home/workspace 제외

    const newPage: RecentPage = { path, name, ts: Date.now() };
    const updatedPages = [newPage, ...stored.filter(p => p.path !== path)].slice(0, MAX_RECENT);

    setRecentPages(updatedPages);
    localStorage.setItem(storageKey, JSON.stringify(updatedPages));
  };

  const handleButtonClick = (path: string, type?: string) => {
    navigate(path);
    addRecentPage(path);
    if (type === "contact" || type === "friendRequest") {
      setShowFriendRequest(true);
    } else {
      setShowFriendRequest(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center py-6">
        <OthLogo />
      </div>
      <div className="px-2 py-2">
        <div className="flex w-full items-center justify-center">
          <MeetingButton />
        </div>
      </div>
      <div className="font-bold">
        <SidebarProvider>
          <SidebarMenu>
            <MenuGroup title="내 계정">
              <HomeButton
                onClick={() => handleButtonClick("/workspace/home")}
                className={["/workspace", "/workspace/home", "/"].includes(location.pathname) ? activeClass : ""}
                children={undefined}
              />
              <ProfileButton
                onClick={() => handleButtonClick("/workspace/profile")}
                className={location.pathname === "/workspace/profile" ? activeClass : ""}
                children={undefined}
              />
              <SettingButton
                onClick={() => handleButtonClick("/workspace/setting")}
                className={location.pathname === "/workspace/setting" ? activeClass : ""}
                children={undefined}
              />
              <ContactButton
                onClick={() => handleButtonClick("/workspace/contact", "contact")}
                className={location.pathname === "/workspace/contact" ? activeClass : ""}
                children={undefined}
              />
              {showFriendRequest && (
                <FriendRequestButton
                  onClick={() => handleButtonClick("/workspace/friend", "friendRequest")}
                  className="ml-6"
                  children={undefined}
                />
              )}
            </MenuGroup>
            <MenuGroup title="관리자">
              <ManagerButton
                onClick={() => handleButtonClick("/workspace/manager")}
                className={location.pathname === "/workspace/manager" ? activeClass : ""}
                children={undefined}
              />
            </MenuGroup>
          </SidebarMenu>
        </SidebarProvider>
      </div>
    </>
  );
}
