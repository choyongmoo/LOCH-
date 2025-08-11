import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/common/ui/button";
import { Paragraph } from "@/components/common/ui/Paragraph";

type FriendRequestRow = {
  id: number;
  requester_id: number;
  addressee_id: number;
  status: "pending" | "accepted" | "declined" | "blocked";
  created_at: string;
  requester?: { id: number; name: string | null; email: string } | null;
};

export default function FriendRequestPage() {
  // const [myUserId, setMyUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [incoming, setIncoming] = useState<FriendRequestRow[]>([]);

  const load = async () => {
    setError(null);
    try {
      setLoading(true);
      const { data: authData } = await supabase.auth.getUser();
      const email = authData.user?.email ?? null;
      const authUuid = authData.user?.id ?? null;
      if (!email) {
        setError("로그인이 필요합니다.");
        setIncoming([]);
        return;
      }

      // 내 users.id 조회 (없으면 생성)
      const { data: userRow } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .order("id", { ascending: true })
        .limit(1)
        .maybeSingle();
      let uid: number | null = userRow?.id ?? null;
      if (!uid) {
        const { data: inserted } = await supabase
          .from("users")
          .insert({ email, name: email.split("@")[0], user_uuid: authUuid })
          .select("id")
          .single();
        uid = inserted?.id ?? null;
      }
      // setMyUserId(uid);
      if (!uid) return;

      // 수신 대기중 요청 목록
      const { data: reqs, error: qErr } = await supabase
        .from("friend_requests")
        .select("id, requester_id, addressee_id, status, created_at, requester:requester_id(id,name,email)")
        .eq("addressee_id", uid)
        .eq("status", "pending")
        .order("created_at", { ascending: false });
      if (qErr) throw qErr;
      setIncoming(((reqs ?? []) as unknown as FriendRequestRow[]));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "목록을 불러오지 못했습니다.";
      setError(msg);
      setIncoming([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (id: number, next: "accepted" | "declined") => {
    try {
      const { error: upErr } = await supabase
        .from("friend_requests")
        .update({ status: next, responded_at: new Date().toISOString() })
        .eq("id", id);
      if (upErr) throw upErr;
      await load();
      // 수락/거절 후 연락처 페이지가 친구 목록을 새로고침하도록 알림
      try { window.dispatchEvent(new CustomEvent('friends-updated')); } catch { /* no-op */ }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "처리에 실패했습니다.";
      setError(msg);
    }
  };

  useEffect(() => {
    void load();
    const { data: sub } = supabase.auth.onAuthStateChange(() => void load());
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen w-402 bg-gray-100 dark:bg-[#18191c] px-5 py-6">
      <h1 className="text-2xl font-bold mb-4">친구 요청</h1>
      {error && <Paragraph className="text-red-500 text-sm mb-3">{error}</Paragraph>}
      {loading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <Paragraph>불러오는 중...</Paragraph>
        </div>
      ) : incoming.length === 0 ? (
        <div className="flex items-center justify-center h-[60vh]">
          <Paragraph className="text-gray-500">수신 대기 중인 친구 요청이 없습니다.</Paragraph>
        </div>
      ) : (
        <div className="space-y-3">
          {incoming.map((r) => (
            <div key={r.id} className="flex items-center justify-between p-4 bg-white dark:bg-[#23242e] rounded-xl border">
              <div className="flex flex-col">
                <span className="font-semibold">
                  {r.requester?.name || r.requester?.email || `사용자 #${r.requester_id}`}
                </span>
                <span className="text-xs text-gray-500">요청 시각: {new Date(r.created_at).toLocaleString()}</span>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleRespond(r.id, "accepted")}>수락</Button>
                <Button variant="outline" onClick={() => handleRespond(r.id, "declined")}>
                  거절
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


