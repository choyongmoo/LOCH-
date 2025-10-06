import FriendsCard from "./FriendsCard";
import IntroCard from "./IntroCard";

export default function TwoColumnCards() {
    return (
        <div className="grid gap-6 w-full grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
            <IntroCard />
            <FriendsCard />
        </div>
    );
}
