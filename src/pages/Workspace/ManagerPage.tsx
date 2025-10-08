import ManagerTable from "@/components/Workspace/Manager/ManagerTable";
import ServerModal from "@/components/Workspace/Modals/ServerModal";
import { useModal } from "@/store/useModalStore";
import { useServers } from "@/store/useServersStore";
import { useUserStore } from "@/store/useUserStore";

export default function ManagerPage() {
  const { currentModal, selectedServer, closeModal } = useModal();
  const { servers, updateServer, deleteServer, kickMember, onLeaveServer } = useServers();
  const { user } = useUserStore();

  if (!user) return null;

  const handleSave = (server: any) => {
    updateServer(server);
    closeModal();
  };

  const handleDelete = (serverId: string) => {
    deleteServer(serverId);
    closeModal();
  };

  const handleKickMember = (serverId: string, userId: string) => {
    kickMember(serverId, userId);
  };

  const handleonLeaveServer = (serverId: string, userId: string) => {
    onLeaveServer(serverId, userId)
  }
  const serverWithMembers = selectedServer && servers.find((s) => s.id === selectedServer.id);

  return (
    <div className="h-screen w-full min-w-0 bg-gray-100 dark:bg-[#18191c] px-4 md:px-5 py-6 flex flex-col overflow-hidden">
      <ManagerTable />

      {currentModal === "serverModal" && serverWithMembers && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <ServerModal
            server={serverWithMembers}
            members={serverWithMembers.members || []}
            currentUserId={user.id!}
            onClose={closeModal}
            onSave={handleSave}
            onDelete={handleDelete}
            onKickMember={handleKickMember}
            onLeaveServer={handleonLeaveServer}
          />
        </div>
      )}
    </div>
  );
}
