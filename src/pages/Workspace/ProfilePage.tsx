// src/pages/Workspace/ProfilePage.tsx
import ProfileContent from "@/components/Workspace/ProfileContent";

const ProfilePage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-4">내 프로필</h1>
      <div className="bg-zinc-800 p-6 rounded">
        <ProfileContent />
      </div>
    </div>
  );
};

export default ProfilePage;
