import { Button } from "@/components/common/ui/button";

interface FriendRequestItemProps {
    name: string;
    requestedAt: string;
}

export default function FriendRequestItem({ name, requestedAt }: FriendRequestItemProps) {
    return (
        <div className="flex items-center justify-between p-4 bg-white dark:bg-[#23242e] rounded-xl border">
            <div className="flex flex-col">
                <span className="font-semibold">{name}</span>
                <span className="text-xs text-gray-500">
                요청 시각: {requestedAt}
                </span>
            </div>
            <div className="flex gap-2">
                <Button>수락</Button>
                <Button variant="outline">거절</Button>
            </div>
        </div>
    );
}
