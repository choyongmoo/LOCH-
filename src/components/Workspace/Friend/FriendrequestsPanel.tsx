import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUserStore } from "@/store/useUserStore";
import FriendRequestList from "./FriendRequestList";
import type { FriendRequest } from "@/types/workspace";

export default function FriendRequestsPanel() {
    const currentUser = useUserStore((state) => state.user);
    const [requests, setRequests] = useState<FriendRequest[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchRequests = async () => {
        if (!currentUser?.id) return;
        setLoading(true);
        try {
        const { data, error } = await supabase
            .from("friend_requests")
            .select(`
            id,
            requester_id,
            addressee_id,
            status,
            created_at,
            requester:requester_id (nickname)
            `)
            .eq("addressee_id", currentUser.id)
            .eq("status", "pending");

        if (error) throw error;

        const formatted = (data || []).map((req: any) => ({
            id: req.id,
            name: req.requester.nickname,
            requestedAt: new Date(req.created_at).toLocaleString(),
            requester_id: req.requester_id,
            addressee_id: req.addressee_id,
        }));

        setRequests(formatted);
        } catch (err) {
            console.error("친구 요청 조회 실패", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (requestId: string) => {
        try {
        const { error } = await supabase
            .from("friend_requests")
            .update({ status: "accepted", responded_at: new Date().toISOString() })
            .eq("id", requestId);

        if (error) throw error;
        fetchRequests();
        } catch (err) {
        console.error("수락 실패", err);
        }
    };

    const handleReject = async (requestId: string) => {
        try {
        const { error } = await supabase
            .from("friend_requests")
            .update({ status: "rejected", responded_at: new Date().toISOString() })
            .eq("id", requestId);

        if (error) throw error;
        fetchRequests();
        } catch (err) {
        console.error("거절 실패", err);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [currentUser?.id]);

    return (
        <FriendRequestList
        requests={requests.map(req => ({
            ...req,
            accept: () => handleAccept(req.id),
            reject: () => handleReject(req.id),
        }))}
        loading={loading}
        />
    );
}
