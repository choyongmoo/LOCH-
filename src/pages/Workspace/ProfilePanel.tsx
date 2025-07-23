// ProfilePanel.tsx (오버레이 패널)
import ProfileContent from "@/components/Workspace/ProfileContent";



export default function ProfilePanel() {
  return (
    <div className="absolute right-0 top-0 h-full w-[400px] bg-white shadow-lg p-6">
      <ProfileContent />
    </div>
  );
}
