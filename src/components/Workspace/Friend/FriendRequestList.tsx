import FriendRequestItem from "./FriendRequestItem";

interface FriendRequest {
    id: number;
    name: string;
    requestedAt: string;
}

export default function FriendRequestList({ requests }: { requests: FriendRequest[] }) {
    if (requests.length === 0) {
        // 요청이 없으면 여기서 메시지 표시
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <span className="text-gray-500 dark:text-gray-400">
                수신 대기 중인 친구 요청이 없습니다.
                </span>
            </div>
        );
    }

    // 요청이 있으면 FriendRequestItem 목록 표시
    return (
        <div className="space-y-3">
            {requests.map((req) => (
                <FriendRequestItem
                key={req.id}
                name={req.name}
                requestedAt={req.requestedAt}
                />
            ))}
        </div>
    );
}
