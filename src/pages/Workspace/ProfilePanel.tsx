// ProfilePanel.tsx (오버레이 패널)
import ProfileContent from "@/components/Workspace/ProfileContent";

type Props = { onClose: () => void };

export default function ProfilePanel({ onClose }: Props) {
  return (
    <div className="absolute right-0 top-0 h-full w-[400px] bg-white shadow-lg p-6">
      <button onClick={onClose}>닫기</button>
      <ProfileContent />
    </div>
  );
}
