// src/components/ServerSidebar.tsx
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
import { useSelectedServerStore } from "@/store/useSelectedServerStore";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function ServerSidebar() {
  const { currentModal, closeModal } = useModal();
  const logout = useUserStore((state) => state.logout);
  const servers = useServers((state) => state.servers);
  const fetchUserServers = useServers((state) => state.fetchUserServers);
  const user = useUserStore((state) => state.user);

  const selectedServerId = useSelectedServerStore((state) => state.selectedServerId);
  const setSelectedServerId = useSelectedServerStore((state) => state.setSelectedServerId);

  useEffect(() => {
    const userId = user?.id;
    if (!userId) return;
    void fetchUserServers(userId);
  }, [user?.id, fetchUserServers]);

  useEffect(() => {
    const userId = user?.id;
    if (!userId) return;

    const subscription = supabase
      .channel(`server-members-user-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "server_members",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          void fetchUserServers(userId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user?.id, fetchUserServers]);

  return (
    <div className="flex flex-col h-full items-center w-full">
      <ScrollArea className="w-full pt-2 px-2 overflow-x-hidden">
        <div className="flex flex-col gap-2">
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
                {server.room_name.slice(0, 2)}
              </Button>
            );
          })}
        </div>
      </ScrollArea>

      <div className="flex flex-col gap-2 pt-2">
        <AddGroupButton className="active:scale-95" />
        <ThemeToggleButton />
      </div>

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

      {currentModal === "addGroup" && <CreateServerModal close={closeModal} />}
      {currentModal === "logout" && (
        <EditModal
          modalType="logout"
          title="로그아웃"
          description="현재 계정에서 로그아웃 하시겠습니까?"
          onConfirm={async () => {
            await logout();
          }}
          confirmLabel="로그아웃"
        />
      )}
    </div>
  );
}
