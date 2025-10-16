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
import { useNavigate } from "react-router-dom";

export default function ServerSidebar() {
  const { currentModal, closeModal } = useModal();
  const logout = useUserStore((state) => state.logout);
  const user = useUserStore((state) => state.user);
  const servers = useServers((state) => state.servers);
  const fetchAllUserServers = useServers((state) => state.fetchAllUserServers);
  const resetSelectedServer = useSelectedServerStore((state) => state.resetSelectedServer);
  const selectedServerId = useSelectedServerStore((state) => state.selectedServerId);
  const setSelectedServerId = useSelectedServerStore((state) => state.setSelectedServerId);

  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      void fetchAllUserServers(user.id);
    }
  }, [user?.id, fetchAllUserServers]);

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
                onClick={() => {setSelectedServerId(server.id); navigate("/workspace/home");}}
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

      {currentModal === "addGroup" && user?.id && (<CreateServerModal close={closeModal} userId={user.id} />)}
      {currentModal === "logout" && (
        <EditModal
          modalType="logout"
          title="로그아웃"
          description="현재 계정에서 로그아웃 하시겠습니까?"
          onConfirm={async () => {
            await logout();
            resetSelectedServer();
          }}
          confirmLabel="로그아웃"
        />
      )}
    </div>
  );
}
