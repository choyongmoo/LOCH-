import { useNavigate, useLocation } from "react-router";
import { SidebarMenu, SidebarProvider } from "../common/ui/sidebar";
import { ContactButton, HomeButton, ManagerButton, RecordButton, ProfileButton, SettingButton, FriendRequestButton } from "./Buttons/MenuButtons";
import MenuGroup from "./MenuGorup";
import { OthLogo } from "../common/OthLogo";
import { MeetingButton } from "./Buttons/MeetingButton";
import { useState } from "react";

export default function MenuSidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const activeClass = "bg-[var(--sidebar-accent)] dark:bg-[var(--sidebar-accent)] font-bold ring-2 ring-black/10 shadow dark:ring-2 dark:ring-white/20";
    const [showFriendRequest, setShowFriendRequest] = useState(false);

    const handleButtonClick = (path: string, type?: string) => {
        navigate(path);
        if (type === "contact" || type === "friendRequest") {
            setShowFriendRequest(true);
        } else {
            setShowFriendRequest(false);
        }
    };

    return (
        <>
            <div className="flex items-center justify-center py-6">
                <OthLogo></OthLogo>
            </div>
            <div className="px-2 py-2">
                <div className="flex w-full items-center justify-center">
                    <MeetingButton />
                </div>
            </div>
            <div className="font-bold">
                <SidebarProvider>
                    <SidebarMenu>
                        <MenuGroup title="문서">
                            <RecordButton
                                onClick={() => handleButtonClick("/workspace/record")}
                                className={location.pathname === "/workspace/record" ? activeClass : ""} children={undefined} />
                        </MenuGroup>
                        <MenuGroup title="내 계정">
                            <HomeButton
                                onClick={() => handleButtonClick("/workspace/home")}
                                className={["/workspace", "/workspace/home", "/"].includes(location.pathname) ? activeClass : ""} children={undefined} />
                            <ProfileButton
                                onClick={() => handleButtonClick("/workspace/profile")}
                                className={location.pathname === "/workspace/profile" ? activeClass : ""} children={undefined} />
                            <SettingButton
                                onClick={() => handleButtonClick("/workspace/setting")}
                                className={location.pathname === "/workspace/setting" ? activeClass : ""} children={undefined} />
                            <ContactButton
                                onClick={() =>
                                handleButtonClick("/workspace/contact", "contact")
                                }
                                className={
                                location.pathname === "/workspace/contact" ? activeClass : ""
                                }
                                children={undefined}
                            />
                            {showFriendRequest && (
                                <FriendRequestButton
                                    onClick={() => handleButtonClick("/workspace/friend", "friendRequest")}
                                    className="ml-6" children={undefined} />
                            )}
                        </MenuGroup>
                        <MenuGroup title="관리자">
                            <ManagerButton
                                onClick={() => navigate("/workspace/manager")}
                                className={location.pathname === "/workspace/manager" ? activeClass : ""} children={undefined} />
                        </MenuGroup>
                    </SidebarMenu>
                </SidebarProvider>
            </div>
        </>
    )
}