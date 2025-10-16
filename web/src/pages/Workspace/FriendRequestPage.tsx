import FriendRequestsPanel from "@/components/Workspace/Friend/FriendrequestsPanel";

export default function FriendRequestPage() {
    return (
        <div className="h-screen w-full min-w-0 overflow-hidden bg-gray-100 dark:bg-[#18191c] px-4 md:px-5 py-6">
            <h1 className="text-2xl font-bold mb-4">친구 요청</h1>
            <FriendRequestsPanel />
        </div>
    );
}
