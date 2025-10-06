import { Power } from "lucide-react";
import AddGroupButton from "./Buttons/AddGroupButton";
import { ThemeToggleButton } from "./Buttons/ThemeTogglebutton";
import { Button } from "../common/ui/button";
import { ScrollArea } from "../common/ui/scroll-area";
import { useModal } from "@/store/useModalStore";
import CreateServerModal from "./Modals/CreateServerModal";
import EditModal from "./Modals/EditModal";
import { useUserStore } from "@/store/useUserStore";
import { useServers } from "@/store/useServersStore";
import { useEffect, useState } from "react";

export default function ServerSidebar() {
    const { currentModal, closeModal } = useModal();
    const logout = useUserStore((state) => state.logout);

    const servers = useServers((state) => state.servers);
    const fetchUserServers = useServers((state) => state.fetchUserServers);
    const user = useUserStore((state) => state.user);

    const [selectedServerId, setSelectedServerId] = useState<string | null>(null);

    useEffect(() => {
        if (!user?.id) return;
        fetchUserServers(user.id);
    }, [user?.id]);

    return (
        <div className="flex flex-col h-full items-center w-full">
            {/* 서버 리스트 + 상단 버튼들 */}
            <ScrollArea className="w-full pt-2 px-2 overflow-x-hidden">
                {/* 서버 버튼 리스트 */}
                <div className="flex flex-col gap-2 ">
                    {servers.map((server) => {
                        const isSelected = server.id === selectedServerId;
                        return (
                            <Button
                                key={server.id}
                                size="icon"
                                className={`
                                    w-10 h-10 rounded-md flex items-center justify-center text-sm overflow-hidden
                                    active:scale-95 transition
                                    ${isSelected ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-200"}
                                `}
                                title={server.room_name}
                                onClick={() => setSelectedServerId(server.id)}
                            >
                                {server.room_name.length > 2
                                    ? server.room_name.slice(0, 2)
                                    : server.room_name}
                            </Button>
                        );
                    })}
                </div>
            </ScrollArea>
            {/* 상단 고정 버튼 */}
            <div className="flex flex-col gap-2 pt-2">
                <AddGroupButton className="active:scale-95" />
                <ThemeToggleButton />
            </div>

            {/* 하단 로그아웃 */}
            <div className="pt-2 pb-4 mt-auto">
                <Button
                variant="outline"
                size="icon"
                title="로그아웃"
                className="active:scale-95"
                onClick={() => useModal.getState().openModal("logout")}
                >
                    <Power />
                </Button>
            </div>
          
            {/* 모달 */}
            {currentModal === "addGroup" && <CreateServerModal close={closeModal} />}
            {currentModal === "logout" && (
                <EditModal
                modalType="logout"
                title="로그아웃"
                description="현재 계정에서 로그아웃 하시겠습니까?"
                onConfirm={async () => { await logout(); }}
                confirmLabel="로그아웃"
                />
            )}
        </div>
    );
}
