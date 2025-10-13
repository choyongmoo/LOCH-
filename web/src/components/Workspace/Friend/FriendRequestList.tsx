import FriendRequestItem from "./FriendRequestItem";

interface FriendRequest {
  id: string;
  name: string;
  requestedAt: string;
  accept: () => void;
  reject: () => void;
}

interface FriendRequestListProps {
  requests: FriendRequest[];
  loading?: boolean;
}

export default function FriendRequestList({ requests, loading }: FriendRequestListProps) {
  if (loading) {
    return <div className="text-center text-gray-500">로딩중...</div>;
  }

  if (requests.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <span className="text-gray-500 dark:text-gray-400">
          수신 대기 중인 친구 요청이 없습니다.
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map(req => (
        <FriendRequestItem
          key={req.id}
          name={req.name}
          requestedAt={req.requestedAt}
          accept={req.accept}
          reject={req.reject}
        />
      ))}
    </div>
  );
}
