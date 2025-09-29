import MicrophoneTestCard from "@/components/Workspace/Cards/MicrophoneTestCard";
import ProfileCard from "@/components/Workspace/Cards/ProfileCard";
import RecentActivityCard from "@/components/Workspace/Cards/RecentActivityCard";
import RiverDownloadCard from "@/components/Workspace/Cards/RiverDownloadCard";
import ServerManagementCard from "@/components/Workspace/Cards/ServerManagementCard";
import SettingsCard from "@/components/Workspace/Cards/SettingsCard";
import TwoColumnCards from "@/components/Workspace/Cards/TwoColumnCards";

export default function HomePage() {
    return (
        <div className="p-2 flex h-screen gap-4">
            <div className="flex-1 flex flex-col gap-2">
                <ProfileCard name={""} bio={""} />
                <TwoColumnCards />
                <RecentActivityCard />
            </div>
            <div className="w-[410px] flex flex-col gap-6">
                <RiverDownloadCard />
                <ServerManagementCard />
                <SettingsCard />
                <MicrophoneTestCard />
            </div>
        </div>
    );
}
