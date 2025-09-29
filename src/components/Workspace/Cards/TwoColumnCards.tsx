import FriendsCard from "./FriendsCard";
import IntroCard from "./IntroCard";

export default function TwoColumnCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <IntroCard />
            <FriendsCard />
        </div>
    );
}
