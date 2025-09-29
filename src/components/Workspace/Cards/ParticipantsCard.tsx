const cardClass = "bg-white dark:bg-[#1a1d21] rounded-xl shadow-xl p-8 flex flex-col";

export default function ParticipantsCard() {
    return (
        <div className={`${cardClass} min-h-[160px]`}>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                참여자 목록
            </h2>
            <div className="flex flex-col gap-2">
                <div className="w-full h-4 bg-gray-300 dark:bg-gray-700 rounded-md" />
                <div className="w-full h-4 bg-gray-300 dark:bg-gray-700 rounded-md" />
                <div className="w-full h-4 bg-gray-300 dark:bg-gray-700 rounded-md" />
            </div>
        </div>
    );
}
