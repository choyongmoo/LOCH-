export default function FriendsCard() {
    return (
        <div className="bg-white dark:bg-[#1a1d21] rounded-xl shadow-xl p-8 flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
                내 친구
            </h3>
            <div className="flex flex-col gap-3">
                {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#23242e]" />
                    <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded-md" />
                </div>
                ))}
            </div>
        </div>
    );
}
