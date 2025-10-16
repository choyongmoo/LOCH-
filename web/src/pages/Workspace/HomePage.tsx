import CameraTestCard from "@/components/Workspace/Cards/CameraTestCard";
import MicrophoneTestCard from "@/components/Workspace/Cards/MicrophoneTestCard";
import ProfileCard from "@/components/Workspace/Cards/ProfileCard";
import RecentActivityCard from "@/components/Workspace/Cards/RecentActivityCard";
import RiverDownloadCard from "@/components/Workspace/Cards/RiverDownloadCard";
import ServerManagementCard from "@/components/Workspace/Cards/ServerManagementCard";
import TwoColumnCards from "@/components/Workspace/Cards/TwoColumnCards";
import UserProfileModal from "@/components/Workspace/Modals/UserProfileModal";
import { ScrollArea } from "@/components/common/ui/scroll-area";
import { useUserProfileModal } from "@/store/useUserProfileModalStore";

export default function HomePage() {
    const { selectedUserId } = useUserProfileModal();    
    return (
        <>
            <ScrollArea className="p-2 h-screen">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_20rem] gap-4">
                    {/* 좌측 컬럼 */}
                    <div className="flex flex-col gap-4 order-1 md:order-1">
                        <ProfileCard />
                        <TwoColumnCards />
                        <RecentActivityCard />
                    </div>

                    {/* 우측 컬럼 */}
                    <div className="flex flex-col gap-6 order-2 md:order-2">
                        <RiverDownloadCard />
                        <ServerManagementCard />
                        <CameraTestCard />
                        <MicrophoneTestCard />
                    </div>
                </div>
        </ScrollArea>
        {selectedUserId && <UserProfileModal />}     
       </>
    );
}