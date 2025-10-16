import { useEffect } from "react";
import { useFriendStore } from "@/store/useFriendStore";
import { useUserStore } from "@/store/useUserStore";
import FriendRequestList from "./FriendRequestList";

export default function FriendRequestsPanel() {
  const currentUser = useUserStore((state) => state.user);
  const { requests, fetchFriendRequests, respondFriendRequest, setRequests, deleteFriendRequest } = useFriendStore();
  const pendingRequests = requests.filter(req => req.status === "pending");

  useEffect(() => {
    if (currentUser?.id) fetchFriendRequests(currentUser.id);
  }, [currentUser?.id]);

  return (
    <FriendRequestList
      requests={pendingRequests.map(req => ({
        ...req,
        accept: () => {
          respondFriendRequest(req.id, "accepted");
          setRequests(requests.filter(r => r.id !== req.id));
        },
        reject: () => {
          deleteFriendRequest(req.id);
          setRequests(requests.filter(r => r.id !== req.id));
        },
      }))}
      loading={false} 
    />
  );
}
