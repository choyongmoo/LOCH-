import ChatWindow from "@/components/Workspace/Contact/ChatWindow";
import FriendSidebar from "@/components/Workspace/Contact/FriendSidebar";
import FriendAddModal from "@/components/Workspace/Modals/FriendAddModal";
import { useModal } from "@/store/useModal";


export default function ContactPage() {
    const { currentModal, closeModal } = useModal();

    return (
        <div className="flex h-screen">
            <FriendSidebar friends={[]} />

            <ChatWindow />
            { currentModal === "addFriend" && <FriendAddModal close={closeModal} /> }
        </div>
    );
}
