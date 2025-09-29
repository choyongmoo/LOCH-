import ChatWindow from "@/components/Workspace/Contact/ChatWindow";
import FriendSidebar from "@/components/Workspace/Contact/FriendSidebar";


export default function ContactPage() {
    return (
        <div className="flex h-screen">
            <FriendSidebar friends={[]} />

            <ChatWindow />
        </div>
    );
}
